import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { FieldLabel, Input } from "@/components/ui";
import { isHexColor } from "@/utils/qr-validation";

const swatches = ["#111827", "#2563eb", "#7c3aed", "#FF6B6B", "#FFD93D", "#C4B5FD", "#ffffff", "#000000"];

export function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <FieldLabel>{label}</FieldLabel>
      <View
        style={{ flexDirection: "row", gap: 6, alignItems: "center", flexWrap: "wrap" }}
      >
        {swatches.map((swatch) => (
          <Pressable
            key={swatch}
            accessibilityRole="button"
            onPress={() => onChange(swatch)}
            style={{
              width: 30,
              height: 30,
              backgroundColor: swatch,
              borderWidth: value.toLowerCase() === swatch ? 4 : 2,
              borderColor: "#000",
              boxShadow:
                value.toLowerCase() === swatch
                  ? "2px 2px 0px 0px #000"
                  : undefined,
            }}
          />
        ))}
      </View>
      <Input value={value} onChangeText={onChange} placeholder="#111827" />
      {!isHexColor(value) ? (
        <Text
          selectable
          style={{ color: colors.accent, fontWeight: "700", fontSize: 12 }}
        >
          Use a valid hex color.
        </Text>
      ) : null}
    </View>
  );
}
