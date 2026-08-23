import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "addis_kiray_default_secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as any
  );
};

// @desc    Register a new user (Tenant or Landlord)
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || "tenant",
      isEmailVerified: false,
      verificationTier: "unverified",
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        verificationTier: user.verificationTier,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide both an email and a password.",
      });
      return;
    }

    // Find user by email and explicitly include password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        verificationTier: user.verificationTier,
        preferences: user.preferences,
        savedProperties: user.savedProperties,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).populate("savedProperties");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user email address (Simulated / OTP)
// @route   POST /api/auth/verify-email
// @access  Private
export const verifyEmail = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { isEmailVerified: true, verificationTier: "phone_verified" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};
