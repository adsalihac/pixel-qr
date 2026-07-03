import { ReactNode } from "react";
import { Pressable, Text, TextInput, View, ViewStyle } from "react-native";
import { colors, shadows } from "@/constants/theme";

export function SectionShell({ children, id, style }: { children: ReactNode; id?: string; style?: ViewStyle }) {
  return (
    <View nativeID={id} style={[{ width: "100%", alignItems: "center" }, style]}>
      <View style={{ width: "100%", maxWidth: 1240, paddingHorizontal: 24 }}>{children}</View>
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = "primary"
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 46,
        paddingHorizontal: 20,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isPrimary ? colors.primary : variant === "ghost" ? "transparent" : colors.surface,
        borderWidth: variant === "ghost" ? 0 : 1.25,
        borderColor: isPrimary ? colors.primaryDark : colors.border,
        opacity: pressed ? 0.9 : 1,
        transform: [{ translateY: pressed ? 1 : 0 }],
        boxShadow: isPrimary ? shadows.subtle : undefined
      })}
    >
      <Text selectable style={{ color: isPrimary ? "#ffffff" : colors.text, fontWeight: "800", fontSize: 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text selectable style={{ color: colors.text, fontWeight: "800", fontSize: 13 }}>
      {children}
    </Text>
  );
}

export function Input({
  value,
  onChangeText,
  placeholder,
  multiline
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
      placeholderTextColor="#98a2b3"
      style={{
        minHeight: multiline ? 102 : 48,
        borderWidth: 1.25,
        borderColor: colors.border,
        backgroundColor: "#fbfcfe",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: colors.text,
        fontSize: 15,
        boxShadow: shadows.subtle
      }}
    />
  );
}

export function Panel({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1.25,
          borderColor: colors.border,
          borderRadius: 22,
          padding: 20,
          gap: 18,
          boxShadow: shadows.panel,
          borderCurve: "continuous"
        },
        style
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
  onSelect
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
      style={{
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.25,
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? "#e9f0ff" : "#f8fafd"
      }}
    >
      <Text selectable style={{ color: active ? colors.primaryDark : colors.textMuted, fontWeight: "700", fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}
