import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

// Same hash function as in login route
async function hashPassword(password: string): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(password + "berto_salt_2024");
  return hash.digest("hex");
}

async function main() {
  console.log("Seeding database...");

  // Admin kullanıcıları oluştur
  const admin1Password = await hashPassword("admin123");
  const admin2Password = await hashPassword("Abuzittin74");

  // Admin 1: admin / admin123
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: admin1Password },
    create: {
      username: "admin",
      password: admin1Password,
    },
  });
  console.log("Admin kullanicisi olusturuldu: admin / admin123");

  // Admin 2: Semhkaramn / Abuzittin74
  await prisma.admin.upsert({
    where: { username: "Semhkaramn" },
    update: { password: admin2Password },
    create: {
      username: "Semhkaramn",
      password: admin2Password,
    },
  });
  console.log("Admin kullanicisi olusturuldu: Semhkaramn / Abuzittin74");

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seed hatasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
