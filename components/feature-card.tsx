import { Text, View } from "react-native";
import { colors } from "@/constants/theme";

export function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ flex: 1, minWidth: 240, gap: 8, paddingVertical: 6 }}>
      <View style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: "#e0ecff", borderWidth: 1, borderColor: "#c7d7fe" }} />
      <Text selectable style={{ color: colors.text, fontSize: 16, fontWeight: "900" }}>
        {title}
      </Text>
      <Text selectable style={{ color: colors.textMuted, fontSize: 14, lineHeight: 21 }}>
        {body}
      </Text>
    </View>
  );
}
