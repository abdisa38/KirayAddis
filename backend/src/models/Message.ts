import mongoose, { Document, Schema, Types } from "mongoose";

export interface IViewingRequest {
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
}

export interface IMessage extends Document {
  inquiry: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  isRead: boolean;
  viewingRequest?: IViewingRequest;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    inquiry: {
      type: Schema.Types.ObjectId,
      ref: "Inquiry",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Message text cannot be empty"],
      trim: true,
      maxlength: [1000, "Message text cannot exceed 1000 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    viewingRequest: {
      date: { type: Date },
      time: { type: String },
      status: {
        type: String,
        enum: ["pending", "confirmed", "rejected", "cancelled"],
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
