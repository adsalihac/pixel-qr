import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Panel, Button } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";

export function VersionSnapshots() {
  const snapshots = useQRStore((s) => s.snapshots);
  const refreshSnapshots = useQRStore((s) => s.refreshSnapshots);
  const takeSnapshot = useQRStore((s) => s.takeSnapshot);
  const restoreSnapshot = useQRStore((s) => s.restoreSnapshot);
  const deleteSnapshot = useQRStore((s) => s.deleteSnapshot);

  useEffect(() => {
    refreshSnapshots();
    const interval = setInterval(() => {
      takeSnapshot("Auto");
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshSnapshots, takeSnapshot]);

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
            Snapshots
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
            Auto-saved every 30s. Revert anytime.
          </Text>
        </View>
        <Button
          label="Snapshot Now"
          variant="secondary"
          onPress={() => takeSnapshot("Manual")}
        />
      </View>

      {snapshots.length === 0 ? (
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
          No snapshots yet. They appear here as you design.
        </Text>
      ) : (
        <View style={{ gap: 6 }}>
          {snapshots.slice(0, 20).map((snapshot) => (
            <View
              key={snapshot.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderWidth: 2,
                borderColor: "#000",
                padding: 8,
                backgroundColor: colors.white,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: snapshot.customization.foregroundColor,
                  borderWidth: 2,
                  borderColor: "#000",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  selectable
                  style={{ color: "#fff", fontWeight: "900", fontSize: 9 }}
                >
                  {snapshot.formValues.kind.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "900",
                    fontSize: 11,
                    textTransform: "uppercase",
                  }}
                >
                  {snapshot.label}
                </Text>
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "700",
                    fontSize: 9,
                    opacity: 0.4,
                  }}
                >
                  {new Date(snapshot.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <Pressable
                onPress={() => restoreSnapshot(snapshot)}
                style={({ pressed }) => ({
                  borderWidth: 2,
                  borderColor: "#000",
                  backgroundColor: colors.secondary,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "900",
                    fontSize: 8,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Restore
                </Text>
              </Pressable>
              <Pressable
                onPress={() => deleteSnapshot(snapshot.id)}
                style={({ pressed }) => ({
                  borderWidth: 2,
                  borderColor: "#000",
                  backgroundColor: colors.white,
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text
                  selectable
                  style={{
                    color: colors.accent,
                    fontWeight: "900",
                    fontSize: 8,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Del
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </Panel>
  );
}
