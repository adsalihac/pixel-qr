import { useState, useCallback } from "react";
import { ScrollView, Text, View, Platform } from "react-native";
import JSZip from "jszip";
import QRCode from "qrcode";
import { colors } from "@/constants/theme";
import { Button, FieldLabel, Input, Panel } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { SequentialConfig } from "@/types/qr";

export function SequentialGenerator() {
  const ecl = useQRStore((state) => state.customization.errorCorrectionLevel);
  const [config, setConfig] = useState<SequentialConfig>({
    prefix: "QR",
    suffix: "",
    start: 1,
    end: 10,
    padding: 3,
    contentTemplate: "https://example.com/{SEQ}",
  });
  const [entries, setEntries] = useState<{ label: string; content: string }[]>([]);
  const [status, setStatus] = useState("");

  const update = (patch: Partial<SequentialConfig>) =>
    setConfig((c) => ({ ...c, ...patch }));

  const generate = useCallback(() => {
    const { prefix, suffix, start, end, padding, contentTemplate } = config;
    if (start > end) { setStatus("Start must be less than or equal to end."); return; }
    if (end - start > 500) { setStatus("Maximum 500 entries at a time."); return; }
    const result: { label: string; content: string }[] = [];
    for (let i = start; i <= end; i++) {
      const num = String(i).padStart(padding, "0");
      const label = `${prefix}${num}${suffix}`;
      const content = contentTemplate.replace(/\{SEQ\}/g, label);
      result.push({ label, content });
    }
    setEntries(result);
    setStatus(`Generated ${result.length} entries.`);
  }, [config]);

  const downloadZip = useCallback(async () => {
    if (entries.length === 0) return;
    setStatus("Generating QR codes...");
    try {
      const zip = new JSZip();
      for (const entry of entries) {
        const safeName = entry.label.replace(/[^a-z0-9]/gi, "_").slice(0, 40) || `qr_${entry.content.slice(0, 8)}`;
        const dataUrl = await QRCode.toDataURL(entry.content, {
          errorCorrectionLevel: ecl,
          margin: 2, scale: 12,
        });
        zip.file(`${safeName}.png`, dataUrl.replace(/^data:image\/png;base64,/, ""), { base64: true });
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "pixelqr-sequential.zip";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus(`Downloaded ${entries.length} QR codes as ZIP.`);
    } catch {
      setStatus("Failed to generate ZIP.");
    }
  }, [entries, ecl]);

  return (
    <Panel>
      <View style={{ gap: 4 }}>
        <Text selectable style={{ color: colors.foreground, fontWeight: "900", fontSize: 20, textTransform: "uppercase", letterSpacing: -0.5 }}>
          Sequential Batch
        </Text>
        <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 13, opacity: 0.6 }}>
          Generate QR codes with sequential labels (QR-001, QR-002, …).
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
        <View style={{ flex: 1, minWidth: 100, gap: 6 }}>
          <FieldLabel>Prefix</FieldLabel>
          <Input value={config.prefix} onChangeText={(v) => update({ prefix: v })} placeholder="QR" />
        </View>
        <View style={{ flex: 1, minWidth: 100, gap: 6 }}>
          <FieldLabel>Suffix</FieldLabel>
          <Input value={config.suffix} onChangeText={(v) => update({ suffix: v })} placeholder="" />
        </View>
        <View style={{ flex: 1, minWidth: 80, gap: 6 }}>
          <FieldLabel>Start</FieldLabel>
          <Input value={String(config.start)} onChangeText={(v) => update({ start: Number(v) || 1 })} />
        </View>
        <View style={{ flex: 1, minWidth: 80, gap: 6 }}>
          <FieldLabel>End</FieldLabel>
          <Input value={String(config.end)} onChangeText={(v) => update({ end: Number(v) || 1 })} />
        </View>
        <View style={{ flex: 1, minWidth: 80, gap: 6 }}>
          <FieldLabel>Padding</FieldLabel>
          <Input value={String(config.padding)} onChangeText={(v) => update({ padding: Number(v) || 1 })} />
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <FieldLabel>Content template</FieldLabel>
        <Input value={config.contentTemplate} onChangeText={(v) => update({ contentTemplate: v })} placeholder="https://example.com/{SEQ}" />
        <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 10, opacity: 0.4 }}>
          Use {'{SEQ}'} as placeholder for the sequential label (e.g., QR-001).
        </Text>
      </View>

      <Button label="Generate Entries" onPress={generate} />

      {entries.length > 0 ? (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Text selectable style={{ color: colors.foreground, fontWeight: "900", fontSize: 14, textTransform: "uppercase" }}>
              Preview ({entries.length})
            </Text>
            <Button label="Download All (ZIP)" onPress={downloadZip} />
          </View>
          <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator>
            {entries.slice(0, 20).map((entry, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 10, borderWidth: 3, borderColor: "#000", padding: 8, marginBottom: 4, backgroundColor: colors.background }}>
                <View style={{ width: 28, height: 28, borderWidth: 3, borderColor: "#000", backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
                  <Text selectable style={{ color: "#fff", fontWeight: "900", fontSize: 10 }}>{config.start + i}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text selectable style={{ color: colors.foreground, fontWeight: "900", fontSize: 11, textTransform: "uppercase" }}>{entry.label}</Text>
                  <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 10, opacity: 0.5 }}>{entry.content.slice(0, 60)}</Text>
                </View>
              </View>
            ))}
            {entries.length > 20 ? (
              <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 10, opacity: 0.4, textAlign: "center" }}>
                … and {entries.length - 20} more
              </Text>
            ) : null}
          </ScrollView>
        </View>
      ) : null}

      {status ? (
        <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 12, opacity: 0.6 }}>{status}</Text>
      ) : null}
    </Panel>
  );
}
