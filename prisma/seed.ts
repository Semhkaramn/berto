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
