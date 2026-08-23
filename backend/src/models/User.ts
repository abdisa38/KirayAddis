import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserPreferences {
  workplace?: string;
  budgetMax?: number;
  maxCommuteMin?: number;
  mustHaveAmenities?: string[];
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "tenant" | "landlord" | "admin";
  avatar?: string;
  isEmailVerified: boolean;
  verificationTier: "unverified" | "phone_verified" | "id_verified" | "property_verified";
  preferences?: IUserPreferences;
  savedProperties: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a full name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["tenant", "landlord", "admin"],
      default: "tenant",
    },
    avatar: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationTier: {
      type: String,
      enum: ["unverified", "phone_verified", "id_verified", "property_verified"],
      default: "unverified",
    },
    preferences: {
      workplace: { type: String, default: "Bole Edna Mall" },
      budgetMax: { type: Number, default: 40000 },
      maxCommuteMin: { type: Number, default: 30 },
      mustHaveAmenities: { type: [String], default: ["Water tank", "Generator", "Parking"] },
    },
    savedProperties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
