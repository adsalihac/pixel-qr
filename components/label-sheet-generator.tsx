import { useState } from "react";
import { Text, View } from "react-native";
import QRCode from "qrcode";
import { colors } from "@/constants/theme";
import { Button, FieldLabel, Input, Panel, SelectPill } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { LabelSheetConfig, LabelSheetSize, LabelSize, BulkEntry } from "@/types/qr";

const pageSizes: LabelSheetSize[] = ["a4", "letter"];
const labelSizes: { value: LabelSize; label: string; cols: number; rows: number }[] = [
  { value: "1x1", label: "1\" × 1\" (63 per sheet)", cols: 7, rows: 9 },
  { value: "2x1", label: "2\" × 1\" (30 per sheet)", cols: 5, rows: 6 },
  { value: "2x2", label: "2\" × 2\" (15 per sheet)", cols: 3, rows: 5 },
  { value: "3x2", label: "3\" × 2\" (10 per sheet)", cols: 3, rows: 4 },
];

async function generatePngDataUrl(content: string, size: number): Promise<string> {
  return QRCode.toDataURL(content || "pixelqr.app", { margin: 1, scale: Math.max(4, Math.round(size / 10)), color: { dark: "#000000", light: "#ffffff" } });
}

export function LabelSheetGenerator() {
  const formValues = useQRStore((state) => state.formValues);
  const [config, setConfig] = useState<LabelSheetConfig>({ pageSize: "letter", labelSize: "1x1", useBulkEntries: false });
  const [bulkEntries, setBulkEntries] = useState<BulkEntry[]>([]);
  const [status, setStatus] = useState("");

  const update = (patch: Partial<LabelSheetConfig>) => setConfig((c) => ({ ...c, ...patch }));
  const ls = labelSizes.find((l) => l.value === config.labelSize)!;
  const totalLabels = ls.cols * ls.rows;

  const handlePrint = async () => {
    setStatus("Building label sheet…");
    try {
      const items: string[] = [];
      if (config.useBulkEntries && bulkEntries.length > 0) {
        for (const e of bulkEntries) {
          items.push(e.content || e.payload);
        }
      } else {
        for (let i = 0; i < totalLabels; i++) items.push(formValues.content || "pixelqr.app");
      }

      const pngSize = Math.round(ls.value.startsWith("2") ? 160 : 120);
      const dataUrls = await Promise.all(items.slice(0, totalLabels).map((c) => generatePngDataUrl(c, pngSize)));

      const pageWidth = config.pageSize === "a4" ? 210 : 216;
      const pageHeight = config.pageSize === "a4" ? 297 : 279;
      const margin = 12;
      const gapH = 4;
      const gapV = 4;
      const labelW = (pageWidth - margin * 2 - gapH * (ls.cols - 1)) / ls.cols;
      const labelH = (pageHeight - margin * 2 - gapV * (ls.rows - 1)) / ls.rows;
      const imgW = labelW * 0.7;
      const imgH = imgW;

      let labels = "";
      for (let r = 0; r < ls.rows; r++) {
        for (let c = 0; c < ls.cols; c++) {
          const idx = r * ls.cols + c;
          if (idx >= dataUrls.length) break;
          const x = margin + c * (labelW + gapH) + (labelW - imgW) / 2;
          const y = margin + r * (labelH + gapV) + 6;
          labels += `<image x="${x}mm" y="${y}mm" width="${imgW}mm" height="${imgH}mm" href="${dataUrls[idx]}" />`;
        }
      }

      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>PixelQR Labels</title>
<style>
  @page { size: ${config.pageSize}; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${pageWidth}mm; height: ${pageHeight}mm; position: relative; }
  svg { width: 100%; height: 100%; }
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${pageWidth}mm" height="${pageHeight}mm" viewBox="0 0 ${pageWidth} ${pageHeight}">
  <rect width="${pageWidth}" height="${pageHeight}" fill="#ffffff"/>
  ${labels}
</svg>
<script>window.print();</script>
</body></html>`;

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "pixelqr-labels.html";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus("Label sheet opened. Use print dialog to print.");
    } catch {
      setStatus("Failed to generate label sheet.");
    }
  };

  return (
    <Panel>
      <View style={{ gap: 4 }}>
        <Text selectable style={{ color: colors.foreground, fontWeight: "900", fontSize: 20, textTransform: "uppercase", letterSpacing: -0.5 }}>
          Label Sheets
        </Text>
        <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 13, opacity: 0.6 }}>
          Print QR codes on adhesive label sheets.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <View style={{ gap: 6 }}>
          <FieldLabel>Page size</FieldLabel>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {pageSizes.map((s) => (
              <SelectPill key={s} value={config.pageSize} option={s} label={s.toUpperCase()} onSelect={(pageSize) => update({ pageSize })} />
            ))}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <FieldLabel>Label size</FieldLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {labelSizes.map((l) => (
              <SelectPill key={l.value} value={config.labelSize} option={l.value} label={l.label.split(" (")[0]} onSelect={(labelSize) => update({ labelSize })} />
            ))}
          </View>
          <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 10, opacity: 0.4 }}>
            {ls.label} · {totalLabels} labels per sheet
          </Text>
        </View>

        <View style={{ gap: 6 }}>
          <FieldLabel>Source</FieldLabel>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <SelectPill value={config.useBulkEntries ? "bulk" : "current"} option="current" label="Current QR" onSelect={() => update({ useBulkEntries: false })} />
            <SelectPill value={config.useBulkEntries ? "bulk" : "current"} option="bulk" label="Bulk entries" onSelect={() => update({ useBulkEntries: true })} />
          </View>
        </View>

        {config.useBulkEntries ? (
          <View style={{ gap: 6 }}>
            <FieldLabel>Bulk entries (paste JSON)</FieldLabel>
            <Input value={JSON.stringify(bulkEntries.map((e) => ({ label: e.label, content: e.content })))} onChangeText={(v) => {
              try { const arr = JSON.parse(v); setBulkEntries(arr.map((item: any, i: number) => ({ row: i + 1, label: item.label || "", content: item.content || "", payload: "" }))); } catch { /* ignore */ }
            }} multiline />
          </View>
        ) : null}
      </View>

      <Button label="Open Print Sheet" onPress={handlePrint} />

      {status ? (
        <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 12, opacity: 0.6 }}>{status}</Text>
      ) : null}
    </Panel>
  );
}



