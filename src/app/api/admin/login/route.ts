import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Check if any admin exists, if not create default
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      await prisma.admin.create({
        data: {
          username: "admin",
          password: "admin123", // In production, use proper hashing
        },
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: "Gecersiz kullanici adi veya sifre" }, { status: 401 });
    }

    // Simple session token (in production, use proper JWT)
    const token = Buffer.from(`${admin.id}:${Date.now()}`).toString("base64");

    return NextResponse.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Giris yapilamadi" }, { status: 500 });
  }
}
