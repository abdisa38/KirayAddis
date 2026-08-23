import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { Property } from "../models/Property.js";
import { AuthRequest } from "../middleware/auth.js";
import { calculateMatchScore } from "./propertyController.js";

// @desc    Get tenant saved properties
// @route   GET /api/tenant/saved
// @access  Private (Tenant)
export const getSavedProperties = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).populate({
      path: "savedProperties",
      populate: { path: "owner", select: "name avatar verificationTier" },
    });

    res.status(200).json({
      success: true,
      savedProperties: user?.savedProperties || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle save / favorite property
// @route   POST /api/tenant/saved/:propertyId
// @access  Private
export const toggleSavedProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isSaved = user.savedProperties.some(
      (id) => id.toString() === propertyId
    );

    if (isSaved) {
      user.savedProperties = user.savedProperties.filter(
        (id) => id.toString() !== propertyId
      );
      await Property.findByIdAndUpdate(propertyId, {
        $inc: { "statistics.saves": -1 },
      });
    } else {
      user.savedProperties.push(propertyId as any);
      await Property.findByIdAndUpdate(propertyId, {
        $inc: { "statistics.saves": 1 },
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !isSaved,
      savedProperties: user.savedProperties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update housing match preferences
// @route   PUT /api/tenant/preferences
// @access  Private
export const updatePreferences = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { workplace, budgetMax, maxCommuteMin, mustHaveAmenities } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        preferences: {
          workplace,
          budgetMax,
          maxCommuteMin,
          mustHaveAmenities,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully.",
      preferences: user?.preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top recommendations for tenant
// @route   GET /api/tenant/recommendations
// @access  Private
export const getRecommendations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const properties = await Property.find({
      "availability.status": "Available",
    }).populate("owner", "name avatar verificationTier");

    const userPrefs = req.user?.preferences;

    // Score and rank all available properties
    const ranked = properties
      .map((p) => ({
        ...p.toObject(),
        matchScore: calculateMatchScore(p, userPrefs),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);

    res.status(200).json({
      success: true,
      count: ranked.length,
      recommendations: ranked,
    });
  } catch (error) {
    next(error);
  }
};
