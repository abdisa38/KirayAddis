import { Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { Property } from "../models/Property.js";
import { Report } from "../models/Report.js";
import { Viewing } from "../models/Viewing.js";
import { AuthRequest } from "../middleware/auth.js";

// @desc    Get marketplace statistics & KPIs
// @route   GET /api/admin/kpis
// @access  Private (Admin)
export const getAdminKPIs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      activeProperties,
      availableProperties,
      totalTenants,
      totalLandlords,
      pendingProperties,
      openReports,
      upcomingViewings,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ "availability.status": "Available" }),
      User.countDocuments({ role: "tenant" }),
      User.countDocuments({ role: "landlord" }),
      Property.countDocuments({ "verification.status": "Pending" }),
      Report.countDocuments({ status: "open" }),
      Viewing.countDocuments({ status: "pending" }),
    ]);

    res.status(200).json({
      success: true,
      kpis: {
        activeProperties,
        availableProperties,
        totalTenants,
        totalLandlords,
        pendingProperties,
        openReports,
        upcomingViewings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get property moderation review queue
// @route   GET /api/admin/queue
// @access  Private (Admin)
export const getReviewQueue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const queue = await Property.find({ "verification.status": "Pending" })
      .populate("owner", "name email phone verificationTier")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: queue.length,
      queue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a property listing
// @route   PATCH /api/admin/properties/:id/moderate
// @access  Private (Admin)
export const moderateProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // status: "Approved" | "Rejected"

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      res.status(400).json({ success: false, message: "Invalid status value" });
      return;
    }

    const property = await Property.findByIdAndUpdate(
      id,
      {
        "verification.status": status,
        "verification.verifiedAt": status === "Approved" ? new Date() : undefined,
        "verification.verifiedBy": req.user?._id,
        "verification.notes": notes,
      },
      { new: true }
    );

    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Property listing ${status.toLowerCase()} successfully.`,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};
