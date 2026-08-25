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

// @desc    Submit trust & safety report
// @route   POST /api/admin/reports
// @access  Public / Private
export const createReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { propertyId, reason, details } = req.body;

    let reporterId = req.user?._id;
    if (!reporterId) {
      // Find default tenant or first user
      const defaultUser = await User.findOne({ role: "tenant" });
      reporterId = defaultUser?._id;
    }

    const report = await Report.create({
      reporter: reporterId,
      targetType: "property",
      targetId: propertyId || (await Property.findOne())?._id,
      reason: reason || "Inaccurate listing data",
      description: details || "",
      status: "open",
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully.",
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user verification or active status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
export const toggleUserStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { verificationTier } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (verificationTier) {
      user.verificationTier = verificationTier;
    } else {
      user.verificationTier =
        user.verificationTier === "property_verified" || user.verificationTier === "id_verified"
          ? "unverified"
          : user.role === "landlord"
          ? "property_verified"
          : "id_verified";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated to ${user.verificationTier}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (investigating, resolved, dismissed)
// @route   PATCH /api/admin/reports/:id/status
// @access  Private (Admin)
export const updateReportStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const report = await Report.findById(id);
    if (!report) {
      res.status(404).json({ success: false, message: "Report not found" });
      return;
    }

    report.status = status || report.status;
    if (adminNotes) report.adminNotes = adminNotes;
    if (status === "resolved" || status === "dismissed") {
      report.resolvedAt = new Date();
      report.resolvedBy = req.user?._id as any;
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: `Report status updated to ${status}.`,
      report,
    });
  } catch (error) {
    next(error);
  }
};


