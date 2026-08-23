import { Response, NextFunction } from "express";
import { Inquiry } from "../models/Inquiry.js";
import { Message } from "../models/Message.js";
import { Viewing } from "../models/Viewing.js";
import { Property } from "../models/Property.js";
import { AuthRequest } from "../middleware/auth.js";

// @desc    Get all conversations for authenticated user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;

    const conversations = await Inquiry.find({
      participants: userId,
    })
      .populate("participants", "name avatar role verificationTier")
      .populate("property", "title price location media availability")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start or find conversation for a property
// @route   POST /api/messages/conversations
// @access  Private
export const startConversation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { propertyId, initialMessage } = req.body;
    const senderId = req.user?._id;

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    const landlordId = property.owner;

    // Check if inquiry thread already exists between these users for this property
    let inquiry = await Inquiry.findOne({
      participants: { $all: [senderId, landlordId] },
      property: propertyId,
    });

    if (!inquiry) {
      inquiry = await Inquiry.create({
        participants: [senderId, landlordId],
        property: propertyId,
        lastMessage: initialMessage || "Inquiry started",
        lastMessageAt: new Date(),
      });
    }

    // If initial message provided, save it
    if (initialMessage) {
      await Message.create({
        inquiry: inquiry._id,
        sender: senderId,
        text: initialMessage,
      });

      inquiry.lastMessage = initialMessage;
      inquiry.lastMessageAt = new Date();
      await inquiry.save();
    }

    // Populate and return
    const populated = await Inquiry.findById(inquiry._id)
      .populate("participants", "name avatar role")
      .populate("property", "title price location media");

    res.status(201).json({
      success: true,
      conversation: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message history for a conversation
// @route   GET /api/messages/conversations/:id/messages
// @access  Private
export const getMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const messages = await Message.find({ inquiry: id })
      .populate("sender", "name avatar role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message in conversation
// @route   POST /api/messages/conversations/:id/messages
// @access  Private
export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { text, viewingRequest } = req.body;
    const senderId = req.user?._id;

    const message = await Message.create({
      inquiry: id as any,
      sender: senderId,
      text,
      viewingRequest,
    });

    // Update conversation lastMessage
    await Inquiry.findByIdAndUpdate(id, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    const populated = await Message.findById(message._id).populate(
      "sender",
      "name avatar role"
    );

    res.status(201).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule a viewing appointment
// @route   POST /api/messages/viewings
// @access  Private
export const requestViewing = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { propertyId, appointmentDate, appointmentTime, notes } = req.body;
    const tenantId = req.user?._id;

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    const viewing = await Viewing.create({
      tenant: tenantId,
      landlord: property.owner,
      property: propertyId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      notes,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Viewing request submitted to landlord.",
      viewing,
    });
  } catch (error) {
    next(error);
  }
};
