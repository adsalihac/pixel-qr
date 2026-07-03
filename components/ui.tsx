import { ReactNode } from "react";
import { Platform, Pressable, Text, TextInput, View, ViewStyle } from "react-native";
import { colors, border, shadows } from "@/constants/theme";

export function SectionShell({
  children,
  id,
  style,
}: {
  children: ReactNode;
  id?: string;
  style?: ViewStyle;
}) {
  return (
    <View nativeID={id} style={[{ width: "100%", alignItems: "center" }, style]}>
      <View style={{ width: "100%", maxWidth: 1240, paddingHorizontal: 16 }}>
        {children}
      </View>
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const height = size === "sm" ? 40 : size === "lg" ? 56 : 46;
  const bg =
    variant === "primary"
      ? colors.accent
      : variant === "secondary"
        ? colors.secondary
        : colors.white;
  const borderStyle =
    variant === "ghost"
      ? { borderWidth: 2, borderColor: "transparent" as const }
      : border.default;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: height,
        paddingHorizontal: size === "sm" ? 14 : 22,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        backgroundColor: bg,
        ...borderStyle,
        boxShadow: `4px 4px 0px 0px #000`,
        transform: pressed
          ? [{ translateX: 2 }, { translateY: 2 }]
          : [{ translateX: 0 }, { translateY: 0 }],
        transitionDuration: "100ms",
        transitionProperty: "transform, box-shadow",
      })}
    >
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "900",
          fontSize: size === "sm" ? 11 : 13,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text
      selectable
      style={{
        color: colors.foreground,
        fontWeight: "700",
        fontSize: 12,
        letterSpacing: 2,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Text>
  );
}

export function Input({
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
      placeholderTextColor="rgba(0,0,0,0.4)"
      style={[
        {
          minHeight: multiline ? 100 : 52,
          borderWidth: 4,
          borderColor: "#000",
          backgroundColor: colors.white,
          borderRadius: 0,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: colors.foreground,
          fontSize: 16,
          fontWeight: "700",
          fontFamily: "Space Grotesk",
          textAlignVertical: multiline ? "top" : "center",
        },
        Platform.OS === "web" ? { outlineStyle: "none" as any } : {},
      ]}
    />
  );
}

export function Panel({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderWidth: 4,
          borderColor: "#000",
          borderRadius: 0,
          padding: 20,
          gap: 18,
          boxShadow: "8px 8px 0px 0px #000",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SelectPill<T extends string>({
  value,
  option,
  label,
  onSelect,
}: {
  value: T;
  option: T;
  label: string;
  onSelect: (value: T) => void;
}) {
  const active = value === option;
  return (
    <Pressable
      onPress={() => onSelect(option)}
      style={({ pressed }) => ({
        minHeight: 38,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#000",
        backgroundColor: active ? colors.secondary : colors.white,
        boxShadow: active ? "3px 3px 0px 0px #000" : undefined,
        transform: pressed
          ? [{ translateX: 1 }, { translateY: 1 }]
          : [{ translateX: 0 }, { translateY: 0 }],
        transitionDuration: "100ms",
        transitionProperty: "transform",
      })}
    >
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "700",
          fontSize: 12,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Badge({
  label,
  color = colors.accent,
  style,
}: {
  label: string;
  color?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: color,
          borderWidth: 3,
          borderColor: "#000",
          paddingHorizontal: 10,
          paddingVertical: 4,
          boxShadow: "3px 3px 0px 0px #000",
        },
        style,
      ]}
    >
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "900",
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function ToggleButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 3,
        borderColor: "#000",
        backgroundColor: active ? colors.muted : colors.white,
        paddingHorizontal: 12,
        minHeight: 40,
        boxShadow: active ? "3px 3px 0px 0px #000" : undefined,
        transform: pressed
          ? [{ translateX: 1 }, { translateY: 1 }]
          : [{ translateX: 0 }, { translateY: 0 }],
        transitionDuration: "100ms",
        transitionProperty: "transform",
      })}
    >
      <View
        style={{
          width: 14,
          height: 14,
          backgroundColor: active ? colors.foreground : colors.white,
          borderWidth: 3,
          borderColor: "#000",
        }}
      />
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "700",
          fontSize: 12,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
