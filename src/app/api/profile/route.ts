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

// Get admin profile
export async function GET() {
  try {
    const admin = await prisma.admin.findFirst({
      select: {
        id: true,
        username: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin bulunamadi" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Get admin error:", error);
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

// Update admin profile (username or password)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, currentPassword, newPassword } = body;

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json({ error: "Admin bulunamadi" }, { status: 404 });
    }

    // Username update
    if (username && !currentPassword && !newPassword) {
      // Check if username already exists
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          username: username,
          NOT: { id: admin.id },
        },
      });

      if (existingAdmin) {
        return NextResponse.json({ error: "Bu kullanici adi zaten kullaniliyor" }, { status: 400 });
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: { username },
      });

      return NextResponse.json({ message: "Kullanici adi guncellendi" });
    }

    // Password update
    if (currentPassword && newPassword) {
      const currentHash = await hashPassword(currentPassword);

      if (currentHash !== admin.password) {
        return NextResponse.json({ error: "Mevcut sifre yanlis" }, { status: 400 });
      }

      const newHash = await hashPassword(newPassword);

      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: newHash },
      });

      return NextResponse.json({ message: "Sifre guncellendi" });
    }

    return NextResponse.json({ error: "Gecersiz istek" }, { status: 400 });
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}
