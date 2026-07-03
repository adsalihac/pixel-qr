import QRCode from "qrcode";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { colors } from "@/constants/theme";

export function QRAnalysis({
  payload,
  errorCorrectionLevel,
  maskPattern,
}: {
  payload: string;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  maskPattern: number | undefined;
}) {
  const info = useMemo(() => {
    try {
      const qr = QRCode.create(payload || "pixelqr.app", {
        errorCorrectionLevel,
        maskPattern,
      });
      const modules = qr.modules as unknown as { size: number };
      const count = modules.size;
      const eclBit = (qr.errorCorrectionLevel as { bit: number }).bit;
      const eclName = eclBit === 1 ? "L" : eclBit === 0 ? "M" : eclBit === 3 ? "Q" : "H";
      const dataCapacity = maxDataCapacity(qr.version, eclName);
      const approxChars = payload.length;
      const usagePct = dataCapacity > 0 ? Math.round((approxChars / dataCapacity) * 100) : 0;

      return {
        version: qr.version,
        moduleCount: count,
        gridSize: `${count} × ${count}`,
        mask: qr.maskPattern,
        ecl: eclName,
        usagePct,
      };
    } catch {
      return null;
    }
  }, [payload, errorCorrectionLevel, maskPattern]);

  if (!info) return null;

  const rows: { label: string; value: string }[] = [
    { label: "Version", value: `${info.version}` },
    { label: "Grid", value: info.gridSize },
    { label: "Modules", value: `${info.moduleCount}` },
    { label: "Error correction", value: `${info.ecl} (${eclLabel(info.ecl)})` },
    { label: "Mask pattern", value: `${info.mask}` },
    { label: "Data capacity used", value: `${info.usagePct}%` },
  ];

  return (
    <View
      style={{
        borderWidth: 3,
        borderColor: "#000",
        backgroundColor: colors.muted,
        padding: 14,
        gap: 8,
      }}
    >
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "900",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        QR Analysis
      </Text>
      <View style={{ gap: 4 }}>
        {rows.map((row) => (
          <View
            key={row.label}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
              borderBottomWidth: 1,
              borderColor: "#000",
              paddingVertical: 4,
            }}
          >
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontWeight: "700",
                fontSize: 11,
                opacity: 0.6,
              }}
            >
              {row.label}
            </Text>
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontWeight: "900",
                fontSize: 11,
              }}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function eclLabel(ecl: string) {
  switch (ecl) {
    case "L": return "Low (~7%)";
    case "M": return "Medium (~15%)";
    case "Q": return "Quartile (~25%)";
    case "H": return "High (~30%)";
    default: return "";
  }
}

function maxDataCapacity(version: number, ecl: string): number {
  const capacities: Record<string, Record<number, number>> = {
    L: { 1: 152, 2: 272, 3: 440, 4: 640, 5: 864, 6: 1088, 7: 1248, 8: 1552, 9: 1856, 10: 2192, 11: 2592, 12: 2960, 13: 3424, 14: 3688, 15: 4184, 16: 4712, 17: 5176, 18: 5768, 19: 6360, 20: 6888, 21: 7456, 22: 8048, 23: 8752, 24: 9392, 25: 10208, 26: 10960, 27: 11744, 28: 12248, 29: 13048, 30: 13880, 31: 14744, 32: 15640, 33: 16568, 34: 17528, 35: 18448, 36: 19472, 37: 20528, 38: 21616, 39: 22496, 40: 23648 },
    M: { 1: 128, 2: 224, 3: 352, 4: 512, 5: 688, 6: 864, 7: 992, 8: 1232, 9: 1456, 10: 1728, 11: 2032, 12: 2320, 13: 2672, 14: 2920, 15: 3320, 16: 3624, 17: 4056, 18: 4504, 19: 5016, 20: 5352, 21: 5712, 22: 6256, 23: 6880, 24: 7312, 25: 8000, 26: 8496, 27: 9024, 28: 9544, 29: 10136, 30: 10984, 31: 11640, 32: 12328, 33: 13048, 34: 13800, 35: 14496, 36: 15312, 37: 15936, 38: 16816, 39: 17728, 40: 18672 },
    Q: { 1: 104, 2: 176, 3: 272, 4: 384, 5: 496, 6: 608, 7: 704, 8: 880, 9: 1056, 10: 1232, 11: 1440, 12: 1648, 13: 1952, 14: 2088, 15: 2360, 16: 2600, 17: 2936, 18: 3176, 19: 3560, 20: 3880, 21: 4096, 22: 4544, 23: 4912, 24: 5312, 25: 5744, 26: 6032, 27: 6464, 28: 6968, 29: 7288, 30: 7880, 31: 8344, 32: 8896, 33: 9424, 34: 9936, 35: 10216, 36: 10896, 37: 11568, 38: 12208, 39: 12856, 40: 13536 },
    H: { 1: 72, 2: 128, 3: 208, 4: 288, 5: 368, 6: 480, 7: 528, 8: 688, 9: 800, 10: 976, 11: 1120, 12: 1264, 13: 1440, 14: 1576, 15: 1784, 16: 2024, 17: 2264, 18: 2504, 19: 2728, 20: 3080, 21: 3248, 22: 3536, 23: 3712, 24: 4112, 25: 4304, 26: 4768, 27: 5024, 28: 5288, 29: 5608, 30: 5960, 31: 6344, 32: 6760, 33: 7208, 34: 7688, 35: 7888, 36: 8432, 37: 8768, 38: 9136, 39: 9776, 40: 10208 },
  };
  return capacities[ecl]?.[version] ?? 0;
}
