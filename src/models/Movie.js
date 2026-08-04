import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    trailer: {
      type: String,
      default: "",
    },

    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],

    duration: {
      type: Number,
      required: true,
    },

    language: {
      type: String,
      default: "English",
    },

    rating: {
      type: Number,
      default: 0,
    },

    releaseDate: {
      type: Date,
    },

    status: {
      type: String,

      enum: ["Now Showing", "Coming Soon", "Ended"],

      default: "Coming Soon",
    },

    isFeatured: {
      type: Boolean,

      default: false,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
