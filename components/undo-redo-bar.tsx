import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { useQRStore } from "@/store/qr-store";

export function UndoRedoBar() {
  const undo = useQRStore((s) => s.undo);
  const redo = useQRStore((s) => s.redo);
  const undoStack = useQRStore((s) => s.undoStack);
  const redoStack = useQRStore((s) => s.redoStack);

  return (
    <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
      <UndoRedoButton
        label="Undo"
        disabled={undoStack.length === 0}
        onPress={undo}
      />
      <UndoRedoButton
        label="Redo"
        disabled={redoStack.length === 0}
        onPress={redo}
      />
    </View>
  );
}

function UndoRedoButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => ({
        minHeight: 32,
        paddingHorizontal: 10,
        borderWidth: 3,
        borderColor: "#000",
        backgroundColor: disabled ? colors.muted : colors.white,
        justifyContent: "center",
        opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        boxShadow: disabled ? undefined : "2px 2px 0px 0px #000",
        transform: pressed ? [{ translateX: 1 }, { translateY: 1 }] : [],
        transitionDuration: "100ms",
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
        {label}
      </Text>
    </Pressable>
  );
}
