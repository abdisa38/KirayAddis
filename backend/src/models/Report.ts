import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReport extends Document {
  reporter: Types.ObjectId;
  targetType: "property" | "user" | "inquiry";
  targetId: Types.ObjectId;
  reason: string;
  description?: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  adminNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["property", "user", "inquiry"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Please provide a reason for the report"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved", "dismissed"],
      default: "open",
    },
    adminNotes: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model<IReport>("Report", ReportSchema);
