import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Dosyayı base64'e çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // imgbb API kullan (ücretsiz image hosting)
    const imgbbApiKey = process.env.IMGBB_API_KEY;

    if (imgbbApiKey) {
      // imgbb'ye yükle
      const imgbbFormData = new FormData();
      imgbbFormData.append("key", imgbbApiKey);
      imgbbFormData.append("image", base64);

      const imgbbRes = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: imgbbFormData,
      });

      const imgbbData = await imgbbRes.json();

      if (imgbbData.success) {
        return NextResponse.json({
          success: true,
          url: imgbbData.data.url,
        });
      }
    }

    // Cloudinary kullan (alternatif)
    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (cloudinaryCloudName && cloudinaryUploadPreset) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", `data:${file.type};base64,${base64}`);
      cloudinaryFormData.append("upload_preset", cloudinaryUploadPreset);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (cloudinaryData.secure_url) {
        return NextResponse.json({
          success: true,
          url: cloudinaryData.secure_url,
        });
      }
    }

    // Hiçbir servis yapılandırılmamışsa, data URL olarak döndür (küçük dosyalar için)
    if (buffer.length < 500 * 1024) { // 500KB'dan küçükse
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        warning: "Gorsel hosting servisi yapilandirilmamis. Lutfen IMGBB_API_KEY veya CLOUDINARY ayarlarini ekleyin.",
      });
    }

    return NextResponse.json(
      { error: "Gorsel hosting servisi yapilandirilmamis. Lutfen IMGBB_API_KEY veya CLOUDINARY ayarlarini Netlify env'e ekleyin." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
