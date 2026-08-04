import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    cinemaName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "NGN",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);
