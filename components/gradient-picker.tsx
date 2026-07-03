import { View } from "react-native";
import { SelectPill } from "@/components/ui";
import { GradientMode } from "@/types/qr";

export function GradientPicker({
  value,
  onChange,
}: {
  value: GradientMode;
  onChange: (value: GradientMode) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
      <SelectPill value={value} option="none" label="Solid" onSelect={onChange} />
      <SelectPill
        value={value}
        option="linear"
        label="Soft gradient"
        onSelect={onChange}
      />
    </View>
  );
}
