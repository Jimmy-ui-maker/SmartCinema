import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },

    seats: [String],

    showDate: Date,

    showTime: Date,

    amount: Number,

    qrCode: {
      type: String,
      default: "",
    },

    ticketStatus: {
      type: String,
      enum: ["Valid", "Used", "Expired", "Cancelled"],
      default: "Valid",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
