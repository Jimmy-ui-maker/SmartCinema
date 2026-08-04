import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      unique: true,

      trim: true,
    },

    description: {
      type: String,

      default: "",
    },

    image: {
      type: String,

      default: "",
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.models.Genre || mongoose.model("Genre", GenreSchema);
