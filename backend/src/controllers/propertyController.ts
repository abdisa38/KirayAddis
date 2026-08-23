import { Request, Response, NextFunction } from "express";
import { Property, IProperty } from "../models/Property.js";
import { AuthRequest } from "../middleware/auth.js";

// Helper to calculate Match Score for a property based on user criteria or default Bole context
export const calculateMatchScore = (
  property: IProperty,
  criteria?: {
    workplace?: string;
    budgetMax?: number;
    maxCommuteMin?: number;
    mustHaveAmenities?: string[];
  }
): number => {
  let score = 70; // baseline

  const budgetMax = criteria?.budgetMax || 40000;
  if (property.price <= budgetMax) {
    score += 15;
  } else if (property.price <= budgetMax * 1.15) {
    score += 5;
  } else {
    score -= 10;
  }

  // Location/Destination proximity bonus
  if (
    property.location.subCity?.toLowerCase().includes("bole") ||
    property.location.neighborhood?.toLowerCase().includes("bole")
  ) {
    score += 10;
  }

  // Amenities bonus
  if (property.amenities.includes("Water") || property.amenities.includes("Water tank")) {
    score += 5;
  }
  if (property.amenities.includes("Generator") || property.amenities.includes("Electricity")) {
    score += 5;
  }

  return Math.min(Math.max(score, 60), 98);
};

// @desc    Get all properties with filtering, search, & pagination
// @route   GET /api/properties
// @access  Public
export const getProperties = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      search,
      subCity,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      amenities,
      status,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = {};

    // Only show published / approved properties by default unless admin query
    if (status) {
      query["availability.status"] = status;
    } else {
      query["availability.status"] = { $in: ["Available", "Soon"] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.neighborhood": { $regex: search, $options: "i" } },
        { "location.subCity": { $regex: search, $options: "i" } },
      ];
    }

    if (subCity) {
      query["location.subCity"] = { $regex: subCity, $options: "i" };
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : (amenities as string).split(",");
      query.amenities = { $all: amenitiesList };
    }

    // Sort order
    let sortOption: any = { createdAt: -1 };
    if (sort === "lowest_price") {
      sortOption = { price: 1 };
    } else if (sort === "highest_price") {
      sortOption = { price: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate("owner", "name role avatar verificationTier")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Property.countDocuments(query),
    ]);

    // Attach dynamic match score to each property
    const userPrefs = req.user?.preferences;
    const enrichedProperties = properties.map((prop) => {
      const matchScore = calculateMatchScore(prop, userPrefs);
      return {
        ...prop.toObject(),
        matchScore,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedProperties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      properties: enrichedProperties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone role avatar verificationTier"
    );

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property listing not found.",
      });
      return;
    }

    // Increment view count asynchronously
    Property.findByIdAndUpdate(property._id, { $inc: { "statistics.views": 1 } }).exec();

    const matchScore = calculateMatchScore(property, req.user?.preferences);

    res.status(200).json({
      success: true,
      property: {
        ...property.toObject(),
        matchScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property listing (Landlord only)
// @route   POST /api/properties
// @access  Private (Landlord, Admin)
export const createProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user?._id,
      verification: {
        status: "Pending",
      },
      availability: {
        status: "Available",
        availableFrom: req.body.availableFrom || new Date(),
        lastConfirmedAt: new Date(),
      },
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: "Property listing submitted successfully.",
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner, Admin)
export const updateProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });
      return;
    }

    // Verify ownership or admin privileges
    if (
      property.owner.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this listing.",
      });
      return;
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Property listing updated successfully.",
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner, Admin)
export const deleteProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({
        success: false,
        message: "Property not found.",
      });
      return;
    }

    if (
      property.owner.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing.",
      });
      return;
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: "Property listing deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm availability freshness
// @route   PATCH /api/properties/:id/confirm-availability
// @access  Private (Owner, Admin)
export const confirmAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { "availability.lastConfirmedAt": new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Availability freshness confirmed.",
      property,
    });
  } catch (error) {
    next(error);
  }
};
