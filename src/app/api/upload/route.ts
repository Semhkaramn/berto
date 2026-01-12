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

    // Cloudinary kullan
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
      } else {
        console.error("Cloudinary error:", cloudinaryData);
        return NextResponse.json(
          { error: "Cloudinary yukleme hatasi. Lutfen tekrar deneyin." },
          { status: 500 }
        );
      }
    }

    // Cloudinary yapılandırılmamışsa ve dosya küçükse data URL olarak döndür
    if (buffer.length < 500 * 1024) {
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        warning: "Cloudinary yapilandirilmamis. Lutfen CLOUDINARY_CLOUD_NAME ve CLOUDINARY_UPLOAD_PRESET env degiskenlerini ekleyin.",
      });
    }

    return NextResponse.json(
      { error: "Cloudinary yapilandirilmamis. Lutfen CLOUDINARY_CLOUD_NAME ve CLOUDINARY_UPLOAD_PRESET env degiskenlerini Netlify'a ekleyin." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Dosya yuklenirken hata olustu" }, { status: 500 });
  }
}
