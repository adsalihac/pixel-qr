import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { FieldLabel, Input } from "@/components/ui";
import { isHexColor } from "@/utils/qr-validation";

const swatches = ["#111827", "#2563eb", "#7c3aed", "#0f766e", "#c2410c", "#ffffff"];

export function ColorPicker({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <FieldLabel>{label}</FieldLabel>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {swatches.map((swatch) => (
          <Pressable
            key={swatch}
            accessibilityRole="button"
            onPress={() => onChange(swatch)}
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              backgroundColor: swatch,
              borderWidth: value.toLowerCase() === swatch ? 3 : 1,
              borderColor: value.toLowerCase() === swatch ? colors.primary : colors.borderStrong
            }}
          />
        ))}
      </View>
      <Input value={value} onChangeText={onChange} placeholder="#111827" />
      {!isHexColor(value) ? (
        <Text selectable style={{ color: colors.danger, fontSize: 12 }}>
          Use a valid hex color.
        </Text>
      ) : null}
    </View>
  );
}
