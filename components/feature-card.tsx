import { Text, View } from "react-native";
import { colors, shadows } from "@/constants/theme";

export function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 250,
        gap: 12,
        padding: 18,
        borderRadius: 18,
        borderWidth: 1.25,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        boxShadow: shadows.subtle
      }}
    >
      <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: "#e7efff", borderWidth: 1, borderColor: "#cad9fc" }} />
      <Text selectable style={{ color: colors.text, fontSize: 16, fontWeight: "900" }}>
        {title}
      </Text>
      <Text selectable style={{ color: colors.textMuted, fontSize: 14, lineHeight: 22 }}>
        {body}
      </Text>
    </View>
  );
}
