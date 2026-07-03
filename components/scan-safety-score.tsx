import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { ScanWarning } from "@/types/qr";

export function ScanSafetyScore({ score, warnings }: { score: number; warnings: ScanWarning[] }) {
  const tone = score >= 86 ? colors.success : score >= 70 ? colors.warning : colors.danger;
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <Text selectable style={{ color: colors.text, fontSize: 15, fontWeight: "800" }}>
          Scan safety
        </Text>
        <Text selectable style={{ color: tone, fontSize: 22, fontWeight: "900", fontVariant: ["tabular-nums"] }}>
          {score}
        </Text>
      </View>
      <View style={{ height: 8, borderRadius: 999, backgroundColor: colors.surfaceMuted, overflow: "hidden" }}>
        <View style={{ height: "100%", width: `${score}%`, backgroundColor: tone, borderRadius: 999 }} />
      </View>
      {warnings.length === 0 ? (
        <Text selectable style={{ color: colors.success, fontSize: 13, lineHeight: 18 }}>
          Strong contrast, quiet zone, and logo balance.
        </Text>
      ) : (
        <View style={{ gap: 6 }}>
          {warnings.map((warning) => (
            <Text key={warning.id} selectable style={{ color: warning.severity === "danger" ? colors.danger : colors.warning, fontSize: 12, lineHeight: 17 }}>
              {warning.message}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
