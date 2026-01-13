// Resimden dominant rengi çıkar
export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve("#1a1a2e"); // Fallback koyu renk
          return;
        }

        // Küçük boyutta sample al (performans için)
        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;

        // Renkleri topla
        const colorCounts: Record<string, { count: number; r: number; g: number; b: number }> = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Transparan ve çok açık/koyu pikselleri atla
          if (a < 128) continue;

          // Çok beyaz veya çok siyah pikselleri atla
          const brightness = (r + g + b) / 3;
          if (brightness > 240 || brightness < 15) continue;

          // Rengi grupla (benzer renkleri birleştir)
          const quantizedR = Math.round(r / 32) * 32;
          const quantizedG = Math.round(g / 32) * 32;
          const quantizedB = Math.round(b / 32) * 32;

          const key = `${quantizedR}-${quantizedG}-${quantizedB}`;

          if (!colorCounts[key]) {
            colorCounts[key] = { count: 0, r: quantizedR, g: quantizedG, b: quantizedB };
          }
          colorCounts[key].count++;
        }

        // En çok kullanılan rengi bul
        let dominantColor = { r: 26, g: 26, b: 46 }; // Fallback
        let maxCount = 0;

        for (const key in colorCounts) {
          if (colorCounts[key].count > maxCount) {
            maxCount = colorCounts[key].count;
            dominantColor = colorCounts[key];
          }
        }

        // Rengi koyu yap (arka plan için)
        const darkenFactor = 0.3;
        const darkR = Math.round(dominantColor.r * darkenFactor);
        const darkG = Math.round(dominantColor.g * darkenFactor);
        const darkB = Math.round(dominantColor.b * darkenFactor);

        resolve(`rgb(${darkR}, ${darkG}, ${darkB})`);
      } catch (error) {
        console.error("Color extraction error:", error);
        resolve("#1a1a2e");
      }
    };

    img.onerror = () => {
      resolve("#1a1a2e");
    };

    img.src = imageUrl;
  });
}

// Rengin parlaklığına göre metin rengini belirle
export function getContrastColor(bgColor: string): string {
  // RGB değerlerini çıkar
  const match = bgColor.match(/\d+/g);
  if (!match) return "#ffffff";

  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);

  // Parlaklık hesapla
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "#000000" : "#ffffff";
}

// Rengin açık versiyonunu al (border için)
export function getLighterColor(bgColor: string, factor: number = 1.5): string {
  const match = bgColor.match(/\d+/g);
  if (!match) return "rgba(255,255,255,0.1)";

  const r = Math.min(255, Math.round(parseInt(match[0]) * factor));
  const g = Math.min(255, Math.round(parseInt(match[1]) * factor));
  const b = Math.min(255, Math.round(parseInt(match[2]) * factor));

  return `rgba(${r}, ${g}, ${b}, 0.3)`;
}
