import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { ScanWarning } from "@/types/qr";

export function ScanSafetyScore({
  score,
  warnings,
}: {
  score: number;
  warnings: ScanWarning[];
}) {
  const tone = score >= 86 ? "#000" : score >= 70 ? colors.secondary : colors.accent;

  return (
    <View
      style={{
        gap: 10,
        borderWidth: 4,
        borderColor: "#000",
        padding: 16,
        backgroundColor: colors.white,
        boxShadow: "6px 6px 0px 0px #000",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 14,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Scan Safety
        </Text>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "900",
            fontSize: 28,
            fontVariant: ["tabular-nums"],
          }}
        >
          {score}
        </Text>
      </View>

      {/* Solid bar */}
      <View
        style={{
          height: 12,
          backgroundColor: colors.background,
          borderWidth: 3,
          borderColor: "#000",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${score}%`,
            backgroundColor: tone,
          }}
        />
      </View>

      {warnings.length === 0 ? (
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 12,
          }}
        >
          Strong contrast, quiet zone, and logo balance.
        </Text>
      ) : (
        <View style={{ gap: 6 }}>
          {warnings.map((warning) => (
            <Text
              key={warning.id}
              selectable
              style={{
                color:
                  warning.severity === "danger" ? colors.accent : colors.secondary,
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {warning.message}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
