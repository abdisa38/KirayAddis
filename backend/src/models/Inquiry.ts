import mongoose, { Document, Schema, Types } from "mongoose";

export interface IInquiry extends Document {
  participants: Types.ObjectId[];
  property: Types.ObjectId;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

InquirySchema.index({ participants: 1, property: 1 });

export const Inquiry = mongoose.model<IInquiry>("Inquiry", InquirySchema);
