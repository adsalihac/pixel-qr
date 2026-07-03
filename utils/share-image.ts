import { Platform } from "react-native";

export async function shareAsImage(
  element: HTMLElement | null,
  title: string,
): Promise<void> {
  if (!element || Platform.OS !== "web") return;

  try {
    const { toPng } = await import("html-to-image");

    // Capture the preview element
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 3,
      backgroundColor: "#FFFDF5",
    });

    // Create a canvas to add the branded frame
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const pad = 40;
      const footerH = 80;
      canvas.width = img.width + pad * 2;
      canvas.height = img.height + pad * 2 + footerH;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = "#FFFDF5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // QR image
      ctx.drawImage(img, pad, pad, img.width, img.height);

      // Footer
      ctx.fillStyle = "#000";
      ctx.font = "bold 18px 'Space Grotesk', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Made with PixelQR", canvas.width / 2, canvas.height - 38);
      ctx.font = "bold 12px 'Space Grotesk', Arial, sans-serif";
      ctx.fillStyle = "#666";
      ctx.fillText(title || "pixelqr.app", canvas.width / 2, canvas.height - 16);

      // Trigger download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "pixelqr-share.png";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = dataUrl;
  } catch {
    // silently fail
  }
}
