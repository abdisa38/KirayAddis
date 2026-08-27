import { Request, Response, NextFunction } from "express";
import { Property, IProperty } from "../models/Property.js";
import { AuthRequest } from "../middleware/auth.js";

// Helper to calculate Match Score for a property based on user criteria or default context
export const calculateMatchScore = (
  property: IProperty,
  criteria?: {
    workplace?: string;
    budgetMax?: number;
    maxCommuteMin?: number;
    mustHaveAmenities?: string[];
    minBedrooms?: number;
  }
): number => {
  let score = 50; // neutral base

  const budgetMax = criteria?.budgetMax || 40000;

  // 1. Precise Budget Scoring
  if (property.price <= budgetMax) {
    score += 25;
  } else if (property.price <= budgetMax * 1.15) {
    score += 10;
  } else if (property.price <= budgetMax * 1.35) {
    score -= 15;
  } else if (property.price <= budgetMax * 1.8) {
    score -= 35;
  } else {
    // Heavily penalize listings far beyond budget
    score -= 55;
  }

  // 2. Location / Workplace proximity scoring
  if (criteria?.workplace) {
    const locSearch = criteria.workplace.toLowerCase();
    const propSubCity = (property.location?.subCity || "").toLowerCase();
    const propNeigh = (property.location?.neighborhood || "").toLowerCase();
    const propLandmark = (property.location?.landmark || "").toLowerCase();

    if (
      propSubCity.includes(locSearch) ||
      propNeigh.includes(locSearch) ||
      propLandmark.includes(locSearch) ||
      locSearch.includes(propSubCity) ||
      locSearch.includes(propNeigh)
    ) {
      score += 25;
    } else {
      // Check related corridors (e.g. Saris <-> Nifas Silk / Gotera)
      if (
        (locSearch.includes("saris") && (propSubCity.includes("nifas") || propNeigh.includes("jommo") || propNeigh.includes("gotera"))) ||
        (locSearch.includes("kazanchis") && (propSubCity.includes("kirkos") || propNeigh.includes("megenagna"))) ||
        (locSearch.includes("bole") && propSubCity.includes("bole"))
      ) {
        score += 15;
      }
    }
  } else {
    score += 10;
  }

  // 3. Bedrooms Match
  if (criteria?.minBedrooms) {
    if (property.bedrooms >= criteria.minBedrooms) {
      score += 10;
    } else {
      score -= 15;
    }
  }

  // 4. Amenities bonuses
  if (criteria?.mustHaveAmenities?.length) {
    let matched = 0;
    for (const item of criteria.mustHaveAmenities) {
      if (property.amenities.some((a) => a.toLowerCase().includes(item.toLowerCase()))) {
        matched++;
      }
    }
    score += Math.min(matched * 5, 15);
  } else {
    if (property.amenities.includes("Water") || property.amenities.includes("Water tank")) {
      score += 5;
    }
    if (property.amenities.includes("Generator") || property.amenities.includes("Electricity")) {
      score += 5;
    }
  }

  return Math.min(Math.max(score, 15), 98);
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

    const locationFilter = (subCity || req.query.location || search) as string | undefined;

    if (locationFilter) {
      const regex = { $regex: locationFilter.trim(), $options: "i" };
      query.$or = [
        { "location.subCity": regex },
        { "location.neighborhood": regex },
        { "location.landmark": regex },
        { title: regex },
        { description: regex },
      ];
    }

    if (propertyType && propertyType !== "All") {
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

// @desc    Get neighborhood stats with property counts
// @route   GET /api/properties/neighborhoods
// @access  Public
export const getNeighborhoods = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await Property.aggregate([
      { $match: { "availability.status": { $in: ["Available", "Soon"] } } },
      {
        $group: {
          _id: { subCity: "$location.subCity", neighborhood: "$location.neighborhood" },
          count: { $sum: 1 },
          image: { $first: { $arrayElemAt: ["$media.url", 0] } },
          landmark: { $first: "$location.landmark" },
        },
      },
      {
        $group: {
          _id: "$_id.subCity",
          neighborhoods: {
            $push: {
              neighborhood: "$_id.neighborhood",
              count: "$count",
              image: "$image",
              landmark: "$landmark",
            },
          },
          totalCount: { $sum: "$count" },
        },
      },
      { $sort: { totalCount: -1 } },
    ]);

    const totalProperties = await Property.countDocuments({
      "availability.status": { $in: ["Available", "Soon"] },
    });

    const result = stats.map((s) => ({
      subCity: s._id,
      count: s.totalCount,
      neighborhoods: s.neighborhoods,
    }));

    res.status(200).json({
      success: true,
      totalProperties,
      areas: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties owned by authenticated landlord
// @route   GET /api/properties/mine
// @access  Private (Landlord, Admin)
export const getMyProperties = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const properties = await Property.find({ owner: req.user?._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property availability status (Available <-> Rented)
// @route   PATCH /api/properties/:id/toggle-status
// @access  Private (Landlord, Admin)
export const togglePropertyStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    if (
      property.owner.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    const currentStatus = property.availability.status;
    const newStatus = currentStatus === "Available" ? "Rented" : "Available";

    property.availability.status = newStatus as any;
    property.availability.lastConfirmedAt = new Date();
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property marked as ${newStatus}.`,
      property,
    });
  } catch (error) {
    next(error);
  }
};

