import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },

    seats: [
      {
        type: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Booking lifecycle
    bookingStatus: {
      type: String,
      enum: ["Pending", "Reserved", "Confirmed", "Cancelled"],
      default: "Pending",
    },

    // Payment lifecycle
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Pending Verification", "Paid", "Failed", "Refunded"],
      default: "Unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "Online"],
      default: "Bank Transfer",
    },

    paymentProof: {
      type: String,
      default: "",
    },

    ticketGenerated: {
      type: Boolean,
      default: false,
    },

    paymentReference: {
      type: String,
      default: "",
    },

    // Cashier/Admin that verified payment
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
