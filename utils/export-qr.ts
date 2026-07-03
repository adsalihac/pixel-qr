import { Platform, Share } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import QRCode from "qrcode";

const svgMarkup = (payload: string, foregroundColor: string, backgroundColor: string) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="64" fill="${backgroundColor}"/>
  <text x="512" y="470" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="${foregroundColor}">PixelQR</text>
  <text x="512" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="${foregroundColor}">${payload.slice(0, 56)}</text>
</svg>`;

export async function copyPayload(payload: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(payload);
    return;
  }
  await Share.share({ message: payload });
}

export async function sharePayload(payload: string) {
  await Share.share({ message: payload });
}

export async function downloadSvg(payload: string, foregroundColor: string, backgroundColor: string) {
  const svg = svgMarkup(payload, foregroundColor, backgroundColor);
  if (Platform.OS === "web") {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pixelqr.svg";
    anchor.click();
    URL.revokeObjectURL(url);
    return;
  }

  const fileUri = `${FileSystem.cacheDirectory ?? ""}pixelqr.svg`;
  await FileSystem.writeAsStringAsync(fileUri, svg);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
}

const triggerWebDownload = (url: string, filename: string) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

export async function downloadPng(payload: string, foregroundColor: string, backgroundColor: string) {
  const dataUrl = await QRCode.toDataURL(payload || "pixelqr.app", {
    errorCorrectionLevel: "H",
    margin: 2,
    scale: 12,
    color: {
      dark: foregroundColor,
      light: backgroundColor
    }
  });

  if (Platform.OS === "web") {
    triggerWebDownload(dataUrl, "pixelqr.png");
    return;
  }

  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const fileUri = `${FileSystem.cacheDirectory ?? ""}pixelqr.png`;
  await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: "image/png", dialogTitle: "Export PixelQR PNG" });
  }
}
