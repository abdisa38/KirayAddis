import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILocation {
  city: string;
  subCity: string;
  woreda?: string;
  neighborhood?: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IMedia {
  url: string;
  isCover?: boolean;
  type?: "image" | "video";
}

export interface IRentalTerms {
  minContractMonths?: number;
  furnishing?: "Unfurnished" | "Partially furnished" | "Fully furnished";
  paymentFrequency?: string;
  petsAllowed?: boolean;
}

export interface IAvailability {
  status: "Available" | "Soon" | "Rented";
  availableFrom?: Date;
  lastConfirmedAt: Date;
}

export interface IVerification {
  status: "Pending" | "Approved" | "Rejected";
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
  notes?: string;
}

export interface IProperty extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  propertyType: "Apartment" | "House" | "Condominium" | "Studio" | "Villa" | "Shared";
  price: number;
  deposit?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: ILocation;
  amenities: string[];
  media: IMedia[];
  rentalTerms: IRentalTerms;
  availability: IAvailability;
  verification: IVerification;
  statistics: {
    views: number;
    inquiries: number;
    saves: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Property must belong to a registered user / landlord"],
    },
    title: {
      type: String,
      required: [true, "Please provide a property title"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a property description"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Condominium", "Studio", "Villa", "Shared"],
      required: [true, "Please specify property type"],
    },
    price: {
      type: Number,
      required: [true, "Please provide monthly rent in ETB"],
      min: [0, "Rent price must be positive"],
    },
    deposit: {
      type: Number,
      default: 0,
    },
    bedrooms: {
      type: Number,
      required: [true, "Please specify number of bedrooms"],
      min: [0, "Bedrooms cannot be negative"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Please specify number of bathrooms"],
      min: [0, "Bathrooms cannot be negative"],
    },
    area: {
      type: Number,
      required: [true, "Please specify property area in square meters"],
      min: [1, "Area must be at least 1 square meter"],
    },
    location: {
      city: { type: String, default: "Addis Ababa" },
      subCity: {
        type: String,
        required: [true, "Please provide a sub-city"],
        trim: true,
      },
      woreda: { type: String, trim: true },
      neighborhood: { type: String, trim: true },
      landmark: { type: String, trim: true },
      coordinates: {
        lat: { type: Number, default: 9.0107 },
        lng: { type: Number, default: 38.7613 },
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    media: [
      {
        url: { type: String, required: true },
        isCover: { type: Boolean, default: false },
        type: { type: String, enum: ["image", "video"], default: "image" },
      },
    ],
    rentalTerms: {
      minContractMonths: { type: Number, default: 12 },
      furnishing: {
        type: String,
        enum: ["Unfurnished", "Partially furnished", "Fully furnished"],
        default: "Partially furnished",
      },
      paymentFrequency: { type: String, default: "Monthly" },
      petsAllowed: { type: Boolean, default: false },
    },
    availability: {
      status: {
        type: String,
        enum: ["Available", "Soon", "Rented"],
        default: "Available",
      },
      availableFrom: { type: Date, default: Date.now },
      lastConfirmedAt: { type: Date, default: Date.now },
    },
    verification: {
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      verifiedAt: { type: Date },
      verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
      notes: { type: String },
    },
    statistics: {
      views: { type: Number, default: 0 },
      inquiries: { type: Number, default: 0 },
      saves: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast geospatial / search queries
PropertySchema.index({ "location.subCity": 1, price: 1, bedrooms: 1, propertyType: 1 });
PropertySchema.index({ "verification.status": 1, "availability.status": 1 });
PropertySchema.index({ title: "text", description: "text", "location.neighborhood": "text" });

export const Property = mongoose.model<IProperty>("Property", PropertySchema);
