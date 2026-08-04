import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function registerUser(userData) {
  const { firstName, lastName, email, phone, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return { user, token };
}
