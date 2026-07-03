import { useState, useCallback } from "react";
import { Pressable, Text, View, Platform } from "react-native";
import { colors } from "@/constants/theme";
import {
  Button,
  FieldLabel,
  Input,
  Panel,
} from "@/components/ui";
import {
  parseCsv,
  detectColumns,
  buildPayloadsFromRows,
  downloadBulkZip,
} from "@/utils/bulk-generator";
import { BulkEntry } from "@/types/qr";

export function BulkGenerator() {
  const [csvText, setCsvText] = useState("");
  const [entries, setEntries] = useState<BulkEntry[]>([]);
  const [status, setStatus] = useState("");
  const [columnMap, setColumnMap] = useState<{
    label: string;
    content: string;
  }>({ label: "0", content: "1" });

  const handleParse = useCallback(() => {
    try {
      const rows = parseCsv(csvText);
      if (rows.length < 2) {
        setStatus("Need at least a header row and one data row.");
        return;
      }
      const header = rows[0];
      const detected = detectColumns(header);
      setColumnMap(detected);

      const dataRows = rows.slice(1);
      const result = buildPayloadsFromRows(dataRows, detected);
      setEntries(result);
      setStatus(
        `Parsed ${result.length} QR entr${result.length === 1 ? "y" : "ies"} from ${dataRows.length} row${dataRows.length === 1 ? "" : "s"}.`,
      );
    } catch {
      setStatus("Failed to parse CSV. Check formatting.");
    }
  }, [csvText]);

  const handleDownloadAll = useCallback(async () => {
    if (entries.length === 0) return;
    setStatus("Generating QR codes...");
    try {
      await downloadBulkZip(entries);
      setStatus(`Downloaded ${entries.length} QR codes as ZIP.`);
    } catch {
      setStatus("Failed to generate ZIP.");
    }
  }, [entries]);

  const handleDownloadIndividual = useCallback(
    async (entry: BulkEntry) => {
      setStatus(`Generating ${entry.label}...`);
      try {
        const QRCode = (await import("qrcode")).default;
        const dataUrl = await QRCode.toDataURL(entry.content, {
          errorCorrectionLevel: "H",
          margin: 2,
          scale: 12,
        });
        const safeName =
          entry.label.replace(/[^a-z0-9]/gi, "_").slice(0, 40) ||
          `qr_${entry.row}`;
        const anchor = document.createElement("a");
        anchor.href = dataUrl;
        anchor.download = `${safeName}.png`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setStatus(`Downloaded ${entry.label}.`);
      } catch {
        setStatus("Failed to generate QR.");
      }
    },
    [],
  );

  const csvSample = `label,content
Menu,pixelqr.app/menu
Reviews,pixelqr.app/review
WiFi,pixelqr.app/wifi`;

  return (
    <Panel>
      <View style={{ gap: 4 }}>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 20,
            textTransform: "uppercase",
            letterSpacing: -0.5,
          }}
        >
          Bulk QR Generator
        </Text>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 13,
            opacity: 0.6,
          }}
        >
          Paste CSV data with "label" and "content" columns to generate multiple QR codes at once.
        </Text>
      </View>

      <View style={{ gap: 8 }}>
        <FieldLabel>CSV data</FieldLabel>
        <Input
          value={csvText}
          onChangeText={setCsvText}
          placeholder={csvSample}
          multiline
        />
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 10,
            opacity: 0.4,
          }}
        >
          Format: label,content (one per line). First row is column headers.
        </Text>
      </View>

      <Button label="Parse CSV" onPress={handleParse} />

      {entries.length > 0 ? (
        <View style={{ gap: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontWeight: "900",
                fontSize: 14,
                textTransform: "uppercase",
              }}
            >
              Preview ({entries.length})
            </Text>
            <Button label="Download All (ZIP)" onPress={handleDownloadAll} />
          </View>

          {/* Column mapping */}
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            <View style={{ flex: 1, minWidth: 120 }}>
              <FieldLabel>Label column</FieldLabel>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                {["0", "1", "2"].map((i) => (
                  <Pressable
                    key={`l${i}`}
                    onPress={() => setColumnMap({ ...columnMap, label: i })}
                    style={({ pressed }) => ({
                      minHeight: 38,
                      paddingHorizontal: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 3,
                      borderColor: "#000",
                      backgroundColor:
                        columnMap.label === i
                          ? colors.secondary
                          : colors.white,
                      transform: pressed
                        ? [{ translateX: 1 }, { translateY: 1 }]
                        : [{ translateX: 0 }, { translateY: 0 }],
                    })}
                  >
                    <Text
                      selectable
                      style={{
                        color: colors.foreground,
                        fontWeight: "700",
                        fontSize: 12,
                        textTransform: "uppercase",
                      }}
                    >
                      Col {parseInt(i) + 1}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={{ flex: 1, minWidth: 120 }}>
              <FieldLabel>Content column</FieldLabel>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                {["0", "1", "2"].map((i) => (
                  <Pressable
                    key={`c${i}`}
                    onPress={() =>
                      setColumnMap({ ...columnMap, content: i })
                    }
                    style={({ pressed }) => ({
                      minHeight: 38,
                      paddingHorizontal: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 3,
                      borderColor: "#000",
                      backgroundColor:
                        columnMap.content === i
                          ? colors.secondary
                          : colors.white,
                      transform: pressed
                        ? [{ translateX: 1 }, { translateY: 1 }]
                        : [{ translateX: 0 }, { translateY: 0 }],
                    })}
                  >
                    <Text
                      selectable
                      style={{
                        color: colors.foreground,
                        fontWeight: "700",
                        fontSize: 12,
                        textTransform: "uppercase",
                      }}
                    >
                      Col {parseInt(i) + 1}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Entry list */}
          <View style={{ maxHeight: 300 }} nativeID="bulk-scroll">
            {entries.map((entry) => (
              <View
                key={entry.row}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  borderWidth: 3,
                  borderColor: "#000",
                  padding: 8,
                  marginBottom: 6,
                  backgroundColor: colors.background,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderWidth: 3,
                    borderColor: "#000",
                    backgroundColor: "#000",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    selectable
                    style={{
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: 11,
                    }}
                  >
                    {entry.row}
                  </Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    selectable
                    style={{
                      color: colors.foreground,
                      fontWeight: "900",
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    {entry.label}
                  </Text>
                  <Text
                    selectable
                    style={{
                      color: colors.foreground,
                      fontWeight: "700",
                      fontSize: 10,
                      opacity: 0.5,
                    }}
                  >
                    {entry.content.slice(0, 60)}
                  </Text>
                </View>
                <Button
                  label="Download"
                  size="sm"
                  variant="outline"
                  onPress={() => handleDownloadIndividual(entry)}
                />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {status ? (
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 12,
            opacity: 0.6,
          }}
        >
          {status}
        </Text>
      ) : null}
    </Panel>
  );
}
