import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple hash function for password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "berto_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Check if any admin exists, if not create default with hashed password
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const hashedPassword = await hashPassword("admin123");
      await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
        },
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: "Gecersiz kullanici adi veya sifre" }, { status: 401 });
    }

    // Hash the provided password and compare
    const hashedPassword = await hashPassword(password);

    if (hashedPassword !== admin.password) {
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
