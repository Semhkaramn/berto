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

// Logodan neon border için belirgin renk çıkar (beyaz ve siyah hariç)
export async function extractNeonColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve("#7dd3fc"); // Fallback buz mavisi
          return;
        }

        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;

        // Renkleri topla - saturation ve renk belirginliği ile
        const colorCounts: Record<string, {
          count: number;
          r: number;
          g: number;
          b: number;
          saturation: number;
        }> = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Transparan pikselleri atla
          if (a < 128) continue;

          // Parlaklık hesapla
          const brightness = (r + g + b) / 3;

          // Çok beyaz pikselleri atla (brightness > 230 ve düşük saturation)
          // Çok siyah pikselleri atla (brightness < 25)
          if (brightness > 230 || brightness < 25) continue;

          // Saturation hesapla (rengin ne kadar belirgin olduğu)
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;

          // Düşük saturation'lı renkleri atla (gri tonları - beyaz/siyah arası)
          if (saturation < 0.15) continue;

          // Rengi grupla
          const quantizedR = Math.round(r / 32) * 32;
          const quantizedG = Math.round(g / 32) * 32;
          const quantizedB = Math.round(b / 32) * 32;

          const key = `${quantizedR}-${quantizedG}-${quantizedB}`;

          if (!colorCounts[key]) {
            colorCounts[key] = {
              count: 0,
              r: quantizedR,
              g: quantizedG,
              b: quantizedB,
              saturation: saturation
            };
          }
          colorCounts[key].count++;
          // En yüksek saturation'ı sakla
          if (saturation > colorCounts[key].saturation) {
            colorCounts[key].saturation = saturation;
          }
        }

        // En belirgin rengi bul (count * saturation skoruna göre)
        let bestColor = { r: 125, g: 211, b: 252 }; // Fallback buz mavisi
        let bestScore = 0;

        for (const key in colorCounts) {
          const color = colorCounts[key];
          // Skor = count * saturation (daha renkli ve daha çok kullanılan renkler tercih edilir)
          const score = color.count * (color.saturation + 0.5);

          if (score > bestScore) {
            bestScore = score;
            bestColor = color;
          }
        }

        // Rengi neon için parlat (daha canlı yap)
        const brightenFactor = 1.3;
        const neonR = Math.min(255, Math.round(bestColor.r * brightenFactor));
        const neonG = Math.min(255, Math.round(bestColor.g * brightenFactor));
        const neonB = Math.min(255, Math.round(bestColor.b * brightenFactor));

        resolve(`rgb(${neonR}, ${neonG}, ${neonB})`);
      } catch (error) {
        console.error("Neon color extraction error:", error);
        resolve("#7dd3fc");
      }
    };

    img.onerror = () => {
      resolve("#7dd3fc");
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

// RGB string'i hex'e çevir
export function rgbToHex(rgbString: string): string {
  const match = rgbString.match(/\d+/g);
  if (!match) return "#7dd3fc";

  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
