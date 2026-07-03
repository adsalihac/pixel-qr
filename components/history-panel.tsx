import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Panel, Button, Input, FieldLabel } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";

export function HistoryPanel() {
  const history = useQRStore((state) => state.history);
  const refreshHistory = useQRStore((state) => state.refreshHistory);
  const saveToHistory = useQRStore((state) => state.saveToHistory);
  const restoreFromHistory = useQRStore((state) => state.restoreFromHistory);
  const deleteFromHistory = useQRStore((state) => state.deleteFromHistory);
  const [name, setName] = useState("");

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const handleSave = () => {
    if (name.trim()) {
      saveToHistory(name.trim());
      setName("");
    }
  };

  if (history.length === 0) {
    return (
      <Panel>
        <View style={{ gap: 4 }}>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: -0.5,
            }}
          >
            History
          </Text>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            Save your QR configurations to reuse later.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Name this QR"
            />
          </View>
          <Button label="Save" onPress={handleSave} />
        </View>
        <Text
          selectable
          style={{
            color: colors.foreground,
            fontWeight: "700",
            fontSize: 12,
            opacity: 0.4,
            textAlign: "center",
          }}
        >
          No saved QR codes yet.
        </Text>
      </Panel>
    );
  }

  return (
    <Panel>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <View style={{ gap: 4 }}>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "900",
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: -0.5,
            }}
          >
            History
          </Text>
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 13,
              opacity: 0.6,
            }}
          >
            {history.length} saved QR configuration
            {history.length !== 1 ? "s" : ""}.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ width: 140 }}>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Name this QR"
            />
          </View>
          <Button label="Save" onPress={handleSave} />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        {history.map((entry) => (
          <View
            key={entry.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: 3,
              borderColor: "#000",
              padding: 12,
              backgroundColor: colors.background,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: entry.customization.foregroundColor,
                borderWidth: 3,
                borderColor: "#000",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                selectable
                style={{
                  color: "#ffffff",
                  fontWeight: "900",
                  fontSize: 14,
                }}
              >
                {entry.formValues.kind.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                selectable
                style={{
                  color: colors.foreground,
                  fontWeight: "900",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                {entry.name}
              </Text>
              <Text
                selectable
                style={{
                  color: colors.foreground,
                  fontWeight: "700",
                  fontSize: 11,
                  opacity: 0.5,
                }}
              >
                {entry.formValues.content.slice(0, 40)}
                {entry.formValues.content.length > 40 ? "..." : ""}
              </Text>
            </View>
            <Pressable
              onPress={() => restoreFromHistory(entry)}
              style={({ pressed }) => ({
                borderWidth: 3,
                borderColor: "#000",
                backgroundColor: colors.secondary,
                paddingHorizontal: 10,
                paddingVertical: 6,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                selectable
                style={{
                  color: colors.foreground,
                  fontWeight: "900",
                  fontSize: 10,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Restore
              </Text>
            </Pressable>
            <Pressable
              onPress={() => deleteFromHistory(entry.id)}
              style={({ pressed }) => ({
                borderWidth: 3,
                borderColor: "#000",
                backgroundColor: colors.white,
                paddingHorizontal: 8,
                paddingVertical: 6,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                selectable
                style={{
                  color: colors.accent,
                  fontWeight: "900",
                  fontSize: 10,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </Panel>
  );
}
