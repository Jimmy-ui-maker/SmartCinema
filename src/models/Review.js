import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
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

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Visible", "Hidden"],
      default: "Visible",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
