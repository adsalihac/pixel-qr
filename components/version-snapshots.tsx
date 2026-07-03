import { useEffect, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Panel, Button } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";

export function VersionSnapshots() {
  const snapshots = useQRStore((s) => s.snapshots);
  const formValues = useQRStore((s) => s.formValues);
  const customization = useQRStore((s) => s.customization);
  const refreshSnapshots = useQRStore((s) => s.refreshSnapshots);
  const takeSnapshot = useQRStore((s) => s.takeSnapshot);
  const restoreSnapshot = useQRStore((s) => s.restoreSnapshot);
  const deleteSnapshot = useQRStore((s) => s.deleteSnapshot);
  const lastSnapshotRef = useRef("");

  useEffect(() => {
    refreshSnapshots();
    const interval = setInterval(() => {
      const current = JSON.stringify({ f: formValues, c: customization });
      if (current !== lastSnapshotRef.current) {
        lastSnapshotRef.current = current;
        takeSnapshot("Auto");
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <View style={{ gap: 4 }}>
          <Text selectable style={{ color: colors.foreground, fontWeight: "900", fontSize: 20, textTransform: "uppercase", letterSpacing: -0.5 }}>
            Snapshots
          </Text>
          <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 13, opacity: 0.6 }}>
            Auto-saves every 30s. {snapshots.length} saved.
          </Text>
        </View>
        <Button
          label="Snapshot Now"
          variant="secondary"
          onPress={() => takeSnapshot(`v${snapshots.length + 1}`)}
        />
      </View>

      {snapshots.length === 0 ? (
        <Text selectable style={{ color: "#000", fontWeight: "700", fontSize: 12, opacity: 0.4, textAlign: "center" }}>
          No snapshots yet. They auto-save every 30 seconds.
        </Text>
      ) : (
        <View style={{ maxHeight: 360, borderWidth: 3, borderColor: "#000", backgroundColor: colors.background }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 6, padding: 8 }}>
            {snapshots.slice(0, 50).map((snap) => (
              <View
                key={snap.id}
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
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: snap.label === "Auto" ? colors.muted : colors.secondary,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text selectable style={{ color: "#000", fontWeight: "900", fontSize: 11, textTransform: "uppercase" }}>
                    {snap.label}
                  </Text>
                  <Text selectable style={{ color: "#000", fontWeight: "700", fontSize: 9, opacity: 0.4 }}>
                    {new Date(snap.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <Pressable onPress={() => restoreSnapshot(snap)} style={({ pressed }) => ({ borderWidth: 2, borderColor: "#000", backgroundColor: colors.secondary, paddingHorizontal: 8, paddingVertical: 4, opacity: pressed ? 0.7 : 1 })}>
                  <Text selectable style={{ color: "#000", fontWeight: "900", fontSize: 9, letterSpacing: 1, textTransform: "uppercase" }}>
                    Restore
                  </Text>
                </Pressable>
                <Pressable onPress={() => deleteSnapshot(snap.id)} style={({ pressed }) => ({ paddingHorizontal: 6, opacity: pressed ? 0.7 : 1 })}>
                  <Text selectable style={{ color: colors.accent, fontWeight: "900", fontSize: 9, letterSpacing: 1, textTransform: "uppercase" }}>
                    Del
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </Panel>
  );
}
