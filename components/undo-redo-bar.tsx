import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { useQRStore } from "@/store/qr-store";

export function UndoRedoBar() {
  const undoStack = useQRStore((s) => s.undoStack);
  const redoStack = useQRStore((s) => s.redoStack);
  const undo = useQRStore((s) => s.undo);
  const redo = useQRStore((s) => s.redo);

  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      <UndoRedoButton
        label="Undo"
        shortcut="⌘Z"
        disabled={undoStack.length === 0}
        onPress={undo}
      />
      <UndoRedoButton
        label="Redo"
        shortcut="⌘⇧Z"
        disabled={redoStack.length === 0}
        onPress={redo}
      />
    </View>
  );
}

function UndoRedoButton({
  label,
  shortcut,
  disabled,
  onPress,
}: {
  label: string;
  shortcut: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 3,
        borderColor: "#000",
        backgroundColor: disabled ? "#e5e5e5" : colors.white,
        paddingHorizontal: 10,
        paddingVertical: 6,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
    >
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "900",
          fontSize: 11,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {label}
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
        {shortcut}
      </Text>
    </Pressable>
  );
}
