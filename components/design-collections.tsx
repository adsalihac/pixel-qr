import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Panel, Button, Input, FieldLabel } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";

export function DesignCollections() {
  const collections = useQRStore((s) => s.collections);
  const refreshCollections = useQRStore((s) => s.refreshCollections);
  const createCollection = useQRStore((s) => s.createCollection);
  const deleteCollection = useQRStore((s) => s.deleteCollection);
  const renameCollection = useQRStore((s) => s.renameCollection);
  const saveToHistory = useQRStore((s) => s.saveToHistory);
  const restoreFromHistory = useQRStore((s) => s.restoreFromHistory);
  const [newName, setNewName] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  const handleCreate = () => {
    if (newName.trim()) {
      createCollection(newName.trim());
      setNewName("");
    }
  };

  const handleDelete = (id: string) => {
    deleteCollection(id);
    if (expanded === id) setExpanded(null);
  };

  const handleRename = (id: string) => {
    if (renameValue.trim()) {
      renameCollection(id, renameValue.trim());
      setRenaming(null);
    }
  };

  if (collections.length === 0) {
    return (
      <Panel>
        <View style={{ gap: 4 }}>
          <Text selectable style={{ color: colors.foreground, fontWeight: "900", fontSize: 20, textTransform: "uppercase", letterSpacing: -0.5 }}>
            Collections
          </Text>
          <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 13, opacity: 0.6 }}>
            Organize saved designs into folders.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Input value={newName} onChangeText={setNewName} placeholder="Collection name" />
          </View>
          <Button label="Create" onPress={handleCreate} />
        </View>
        <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 12, opacity: 0.4, textAlign: "center" }}>
          No collections yet. Create one to organize QR designs.
        </Text>
      </Panel>
    );
  }

  return (
    <Panel>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <View style={{ gap: 4 }}>
          <Text selectable style={{ color: colors.foreground, fontWeight: "900", fontSize: 20, textTransform: "uppercase", letterSpacing: -0.5 }}>
            Collections
          </Text>
          <Text selectable style={{ color: colors.foreground, fontWeight: "700", fontSize: 13, opacity: 0.6 }}>
            {collections.length} collection{collections.length !== 1 ? "s" : ""}.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ width: 140 }}>
            <Input value={newName} onChangeText={setNewName} placeholder="New collection" />
          </View>
          <Button label="Create" onPress={handleCreate} />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        {collections.map((collection) => (
          <View key={collection.id} style={{ borderWidth: 3, borderColor: "#000", backgroundColor: colors.background }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10 }}>
              <Pressable
                onPress={() => setExpanded(expanded === collection.id ? null : collection.id)}
                style={{ width: 30, height: 30, borderWidth: 3, borderColor: "#000", backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}
              >
                <Text selectable style={{ color: "#000", fontWeight: "900", fontSize: 14 }}>
                  {expanded === collection.id ? "−" : "+"}
                </Text>
              </Pressable>
              {renaming === collection.id ? (
                <View style={{ flex: 1, flexDirection: "row", gap: 6, alignItems: "center" }}>
                  <View style={{ flex: 1 }}><Input value={renameValue} onChangeText={setRenameValue} /></View>
                  <Button label="Save" size="sm" onPress={() => handleRename(collection.id)} />
                </View>
              ) : (
                <Pressable onPress={() => { setRenaming(collection.id); setRenameValue(collection.name); }}>
                  <Text selectable style={{ color: "#000", fontWeight: "900", fontSize: 14, textTransform: "uppercase" }}>
                    {collection.name}
                  </Text>
                </Pressable>
              )}
              <Text selectable style={{ color: "#000", fontWeight: "700", fontSize: 10, opacity: 0.4, marginLeft: "auto" }}>
                {collection.entries.length} QR
              </Text>
              <Pressable onPress={() => handleDelete(collection.id)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, paddingHorizontal: 6 })}>
                <Text selectable style={{ color: colors.accent, fontWeight: "900", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>
                  Del
                </Text>
              </Pressable>
            </View>

            {expanded === collection.id && collection.entries.length > 0 ? (
              <View style={{ borderTopWidth: 3, borderColor: "#000", padding: 10, gap: 8 }}>
                {collection.entries.map((entry) => (
                  <View key={entry.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ width: 28, height: 28, borderWidth: 2, borderColor: "#000", backgroundColor: entry.customization.foregroundColor, alignItems: "center", justifyContent: "center" }}>
                      <Text selectable style={{ color: "#fff", fontWeight: "900", fontSize: 10 }}>
                        {entry.formValues.kind.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text selectable style={{ color: "#000", fontWeight: "900", fontSize: 12, textTransform: "uppercase" }}>{entry.name}</Text>
                      <Text selectable style={{ color: "#000", fontWeight: "700", fontSize: 10, opacity: 0.4 }} numberOfLines={1}>
                        {entry.formValues.content.slice(0, 30)}
                      </Text>
                    </View>
                    <Pressable onPress={() => restoreFromHistory(entry)} style={({ pressed }) => ({ borderWidth: 2, borderColor: "#000", backgroundColor: colors.secondary, paddingHorizontal: 8, paddingVertical: 4, opacity: pressed ? 0.7 : 1 })}>
                      <Text selectable style={{ color: "#000", fontWeight: "900", fontSize: 9, letterSpacing: 1, textTransform: "uppercase" }}>
                        Open
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : expanded === collection.id ? (
              <View style={{ borderTopWidth: 3, borderColor: "#000", padding: 16 }}>
                <Text selectable style={{ color: "#000", fontWeight: "700", fontSize: 11, opacity: 0.4, textAlign: "center" }}>
                  Empty collection. Save a QR with this collection selected.
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </Panel>
  );
}
