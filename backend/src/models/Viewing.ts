import mongoose, { Document, Schema, Types } from "mongoose";

export interface IViewing extends Document {
  tenant: Types.ObjectId;
  landlord: Types.ObjectId;
  property: Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ViewingSchema = new Schema<IViewing>(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    landlord: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ViewingSchema.index({ tenant: 1, appointmentDate: 1 });
ViewingSchema.index({ landlord: 1, appointmentDate: 1 });

export const Viewing = mongoose.model<IViewing>("Viewing", ViewingSchema);
