import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { useQRStore } from "@/store/qr-store";
import { getDailyInspiration, dailyInspirations } from "@/utils/daily-inspiration";
import { DailyInspiration as DailyInspirationType } from "@/types/qr";

export function DailyInspiration() {
  const [inspiration, setInspiration] = useState<DailyInspirationType | null>(null);
  const [showAll, setShowAll] = useState(false);
  const setFormValues = useQRStore((s) => s.setFormValues);
  const setCustomization = useQRStore((s) => s.setCustomization);
  const setBeautification = useQRStore((s) => s.setBeautification);
  const pushUndo = useQRStore((s) => s.pushUndo);

  useEffect(() => {
    setInspiration(getDailyInspiration());
  }, []);

  const apply = (item: DailyInspirationType) => {
    pushUndo();
    if (item.form) setFormValues(item.form);
    if (item.customization) setCustomization(item.customization);
    if (item.beautification) setBeautification(item.beautification);
  };

  const displayed = showAll ? dailyInspirations : inspiration ? [inspiration] : [];

  return (
    <View style={{ gap: 12 }}>
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "900",
          fontSize: 16,
          textTransform: "uppercase",
          letterSpacing: -0.3,
        }}
      >
        {showAll ? "All Inspirations" : "Daily Inspiration"}
      </Text>
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "700",
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        {showAll
          ? "Browse all 90 style presets."
          : `Today's pick — "${inspiration?.label || "Loading..."}".`}
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {displayed.map((item) => (
          <Pressable
            key={item.dayOfYear}
            onPress={() => apply(item)}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 3,
              borderColor: "#000",
              backgroundColor: colors.white,
              paddingHorizontal: 10,
              paddingVertical: 8,
              boxShadow: "3px 3px 0px 0px #000",
              opacity: pressed ? 0.7 : 1,
              transform: pressed ? [{ translateX: 1 }, { translateY: 1 }] : [],
            })}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderWidth: 2,
                borderColor: "#000",
                backgroundColor: item.customization.foregroundColor || "#000",
              }}
            />
            <Text
              selectable
              style={{
                color: colors.foreground,
                fontWeight: "900",
                fontSize: 11,
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {!showAll && inspiration ? (
        <Pressable
          onPress={() => setShowAll(true)}
          style={({ pressed }) => ({
            alignSelf: "flex-start",
            borderWidth: 3,
            borderColor: "#000",
            backgroundColor: colors.background,
            paddingHorizontal: 10,
            paddingVertical: 5,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Browse all 90 →
          </Text>
        </Pressable>
      ) : showAll ? (
        <Pressable
          onPress={() => setShowAll(false)}
          style={({ pressed }) => ({
            alignSelf: "flex-start",
            borderWidth: 3,
            borderColor: "#000",
            backgroundColor: colors.background,
            paddingHorizontal: 10,
            paddingVertical: 5,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Show daily only
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
