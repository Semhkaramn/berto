import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin kullanıcısı oluştur
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: "admin" },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: "admin",
        password: "admin123",
      },
    });
    console.log("Admin kullanicisi olusturuldu: admin / admin123");
  } else {
    console.log("Admin kullanicisi zaten mevcut");
  }

  // Site ayarlarını oluştur
  const existingSettings = await prisma.siteSettings.findFirst();

  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: "Sponsor Portal",
        logoUrl: null,
        telegramUrl: "https://t.me/username",
      },
    });
    console.log("Site ayarlari olusturuldu");
  } else {
    console.log("Site ayarlari zaten mevcut");
  }

  console.log("Seed tamamlandi!");
}

main()
  .catch((e) => {
    console.error("Seed hatasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
