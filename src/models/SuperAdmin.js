import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  imgUrl: { type: String, default: "" },
  role: { type: String, default: "Admin" },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SuperAdmin ||
  mongoose.model("SuperAdmin", superAdminSchema);
