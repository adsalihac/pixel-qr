import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { useQRStore } from "@/store/qr-store";
import { getDailyInspiration } from "@/utils/daily-inspiration";

export function DailyInspiration() {
  const setFormValues = useQRStore((s) => s.setFormValues);
  const setCustomization = useQRStore((s) => s.setCustomization);

  const inspiration = useMemo(() => getDailyInspiration(), []);

  const handleApply = () => {
    setFormValues(inspiration.form);
    setCustomization(inspiration.customization);
  };

  return (
    <View
      style={{
        borderWidth: 3,
        borderColor: "#000",
        backgroundColor: colors.white,
        padding: 12,
        gap: 8,
        boxShadow: "4px 4px 0px 0px #000",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: "#000",
            backgroundColor: colors.accent,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Daily Inspiration
          </Text>
        </View>
        <Pressable
          onPress={handleApply}
          style={({ pressed }) => ({
            borderWidth: 2,
            borderColor: "#000",
            backgroundColor: colors.secondary,
            paddingHorizontal: 10,
            paddingVertical: 4,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 9,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Apply
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderWidth: 2,
            borderColor: "#000",
            backgroundColor: inspiration.customization.foregroundColor || "#000",
          }}
        />
        <View style={{ flex: 1 }}>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 13,
              textTransform: "uppercase",
            }}
          >
            {inspiration.label}
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
            {inspiration.form.content || ""}
          </Text>
        </View>
      </View>
    </View>
  );
}
