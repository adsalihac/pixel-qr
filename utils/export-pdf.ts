import QRCode from "qrcode";

export async function downloadPdf(
  payload: string,
  foregroundColor: string,
  backgroundColor: string,
  title: string,
  label = "Scan QR",
  errorCorrectionLevel: "L" | "M" | "Q" | "H" = "H",
) {
  const dataUrl = await QRCode.toDataURL(payload || "pixelqr.app", {
    errorCorrectionLevel,
    margin: 2,
    scale: 20,
    color: { dark: foregroundColor, light: backgroundColor },
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PixelQR Export</title>
  <style>
    @page { margin: 20mm; size: A4 portrait; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Space Grotesk", Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px;
    }
    .qr-sheet {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      border: 4px solid #000;
      padding: 40px;
      background: ${backgroundColor};
      box-shadow: 12px 12px 0 0 #000;
    }
    .qr-sheet img { display: block; width: 400px; height: 400px; image-rendering: pixelated; }
    .qr-sheet h1 {
      font-weight: 900;
      font-size: 32px;
      text-transform: uppercase;
      letter-spacing: -1px;
      color: ${foregroundColor};
    }
    .qr-sheet p {
      font-weight: 700;
      font-size: 16px;
      opacity: 0.65;
      color: ${foregroundColor};
    }
    .qr-sheet .cta {
      border: 4px solid #000;
      padding: 12px 32px;
      font-weight: 900;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      background: ${foregroundColor};
      color: ${backgroundColor};
    }
    @media print {
      body { padding: 0; }
      .qr-sheet { box-shadow: none; border: 4px solid #000; }
    }
  </style>
</head>
<body>
  <div class="qr-sheet">
    <h1>${title || "PixelQR"}</h1>
    <img src="${dataUrl}" alt="QR Code" />
    <p>${label}</p>
    <div class="cta">Scan to open</div>
  </div>
  <script>window.print();</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pixelqr-print.html";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
