import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema(
  {
    row: String,
    number: Number,
  },
  {
    _id: false,
  },
);

const HallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    seats: [SeatSchema],

    status: {
      type: String,
      enum: ["Available", "Maintenance"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Hall || mongoose.model("Hall", HallSchema);
