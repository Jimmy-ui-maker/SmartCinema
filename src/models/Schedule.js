import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
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

    showDate: {
      type: Date,
      required: true,
    },

    showTime: {
      type: Date,
      required: true,
    },

    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    bookedSeats: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["Scheduled", "Showing", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Schedule ||
  mongoose.model("Schedule", ScheduleSchema);
