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
  const deleteFromHistory = useQRStore((s) => s.deleteFromHistory);
  const [name, setName] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [saveTarget, setSaveTarget] = useState<string | null>(null);

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  const handleCreate = () => {
    if (name.trim()) {
      createCollection(name.trim());
      setName("");
    }
  };

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
          Collections
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
          Organize designs into folders.
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Collection name"
          />
        </View>
        <Button label="Create" onPress={handleCreate} />
      </View>

      {collections.length === 0 ? (
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
          No collections yet. Create one to organize your designs.
        </Text>
      ) : (
        <View style={{ gap: 8 }}>
          {collections.map((collection) => (
            <View
              key={collection.id}
              style={{
                borderWidth: 3,
                borderColor: "#000",
                backgroundColor: colors.background,
                overflow: "hidden",
              }}
            >
              <Pressable
                onPress={() =>
                  setExpanded(expanded === collection.id ? null : collection.id)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text
                    selectable
                    style={{
                      color: colors.foreground,
                      fontWeight: "900",
                      fontSize: 11,
                      textTransform: "uppercase",
                    }}
                  >
                    {collection.name}
                  </Text>
                  <Text
                    selectable
                    style={{
                      color: colors.foreground,
                      fontWeight: "700",
                      fontSize: 10,
                      opacity: 0.4,
                    }}
                  >
                    {collection.entries.length}
                  </Text>
                </View>
                <Pressable
                  onPress={() => deleteCollection(collection.id)}
                  style={({ pressed }) => ({
                    borderWidth: 2,
                    borderColor: "#000",
                    backgroundColor: colors.white,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    selectable
                    style={{
                      color: colors.accent,
                      fontWeight: "900",
                      fontSize: 9,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Del
                  </Text>
                </Pressable>
              </Pressable>

              {expanded === collection.id ? (
                <View
                  style={{
                    borderTopWidth: 2,
                    borderTopColor: "#000",
                    padding: 10,
                    gap: 8,
                  }}
                >
                  {/* Save current to this collection */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Input
                        value={saveTarget === collection.id ? saveName : ""}
                        onChangeText={(v) => {
                          setSaveTarget(collection.id);
                          setSaveName(v);
                        }}
                        placeholder="Name this design"
                      />
                    </View>
                    <Button
                      label="Save here"
                      size="sm"
                      onPress={() => {
                        if (saveName.trim() && saveTarget === collection.id) {
                          saveToHistory(saveName.trim(), collection.id);
                          setSaveName("");
                          setSaveTarget(null);
                        }
                      }}
                    />
                  </View>

                  {collection.entries.length === 0 ? (
                    <Text
                      selectable
                      style={{
                        color: colors.foreground,
                        fontWeight: "700",
                        fontSize: 10,
                        opacity: 0.4,
                        textAlign: "center",
                      }}
                    >
                      Empty collection
                    </Text>
                  ) : (
                    collection.entries.map((entry) => (
                      <View
                        key={entry.id}
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
                            width: 24,
                            height: 24,
                            backgroundColor:
                              entry.customization.foregroundColor,
                            borderWidth: 2,
                            borderColor: "#000",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            selectable
                            style={{
                              color: "#fff",
                              fontWeight: "900",
                              fontSize: 9,
                            }}
                          >
                            {entry.formValues.kind.slice(0, 2).toUpperCase()}
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
                            {entry.name}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => restoreFromHistory(entry)}
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
                            Open
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => deleteFromHistory(entry.id)}
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
                    ))
                  )}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </Panel>
  );
}
