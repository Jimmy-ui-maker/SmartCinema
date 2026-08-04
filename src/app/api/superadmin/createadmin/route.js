import dbConnect from "@/lib/db";
import SuperAdmin from "@/models/SuperAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, phone, address, password, imgUrl, role } = body;

    if (!name || !email || !phone || !address || !password) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const existing = await SuperAdmin.findOne({ email });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const admin = await SuperAdmin.create({
      name,
      email,
      phone,
      address,
      password,
      imgUrl,
      role: role || "Admin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}

// 🟢 FETCH ALL ADMINS
export async function GET() {
  try {
    await dbConnect();
    const admins = await SuperAdmin.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, admins });
  } catch (error) {
    console.error("❌ Error fetching admins:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}

// 🟡 UPDATE ADMIN
export async function PUT(req) {
  try {
    await dbConnect();
    const { _id, name, email, phone, address, password, imgUrl, role } =
      await req.json();

    if (!_id) {
      return NextResponse.json({ success: false, message: "Missing admin ID" });
    }

    // Build update data
    const updateData = { name, email, phone, address, imgUrl, role };
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    const updated = await SuperAdmin.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updated)
      return NextResponse.json({ success: false, message: "Admin not found" });

    return NextResponse.json({
      success: true,
      message: "Admin updated successfully",
      admin: updated,
    });
  } catch (error) {
    console.error("❌ Error updating admin:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}

// 🔴 BLOCK OR UNBLOCK ADMIN
export async function PATCH(req) {
  try {
    await dbConnect();
    const { id, block } = await req.json();

    const admin = await SuperAdmin.findByIdAndUpdate(
      id,
      { isBlocked: block },
      { new: true }
    );

    if (!admin)
      return NextResponse.json({ success: false, message: "Admin not found" });

    return NextResponse.json({
      success: true,
      message: "Admin status updated",
      admin,
    });
  } catch (error) {
    console.error("❌ Error blocking/unblocking admin:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}

// 🗑️ DELETE ADMIN
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const deleted = await SuperAdmin.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ success: false, message: "Admin not found" });

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting admin:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
