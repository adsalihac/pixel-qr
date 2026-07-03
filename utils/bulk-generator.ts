import QRCode from "qrcode";
import JSZip from "jszip";
import { BulkEntry, QRFormValues } from "@/types/qr";

export function parseCsv(text: string): string[][] {
  const lines: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field.trim());
        field = "";
      } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        current.push(field.trim());
        field = "";
        if (current.length > 0 && current.some((f) => f.length > 0)) {
          lines.push(current);
        }
        current = [];
        if (ch === "\r") i++;
      } else {
        field += ch;
      }
    }
  }
  if (field.trim() || current.length > 0) {
    current.push(field.trim());
    if (current.some((f) => f.length > 0)) lines.push(current);
  }

  return lines;
}

export function buildPayloadsFromRows(
  rows: string[][],
  columnMap: { label: string; content: string },
): BulkEntry[] {
  const labelIdx = parseInt(columnMap.label, 10);
  const contentIdx = parseInt(columnMap.content, 10);
  return rows
    .map((row, idx) => ({
      row: idx + 1,
      label: row[labelIdx] || `QR ${idx + 1}`,
      content: row[contentIdx] || "",
      payload: "",
    }))
    .filter((e) => e.content.length > 0);
}

export function detectColumns(
  header: string[],
): { label: string; content: string } {
  let label = 0;
  let content = 1;
  header.forEach((h, i) => {
    const l = h.toLowerCase();
    if (/label|name|title|desc/i.test(l)) label = i;
    if (/content|url|link|data|value|qr|dest/i.test(l)) content = i;
  });
  return { label: String(label), content: String(content) };
}

export async function downloadBulkZip(entries: BulkEntry[]) {
  const zip = new JSZip();

  for (const entry of entries) {
    const safeName = entry.label.replace(/[^a-z0-9]/gi, "_").slice(0, 40) || `qr_${entry.row}`;

    const dataUrl = await QRCode.toDataURL(entry.content, {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 12,
    });

    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    zip.file(`${safeName}.png`, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pixelqr-bulk.zip";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
