import { ReactNode } from "react";
import { Pressable, Text, TextInput, View, ViewStyle } from "react-native";
import { colors, shadows } from "@/constants/theme";

export function SectionShell({ children, id, style }: { children: ReactNode; id?: string; style?: ViewStyle }) {
  return (
    <View nativeID={id} style={[{ width: "100%", alignItems: "center" }, style]}>
      <View style={{ width: "100%", maxWidth: 1180, paddingHorizontal: 24 }}>{children}</View>
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
        minHeight: 44,
        paddingHorizontal: 18,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isPrimary ? colors.primary : variant === "ghost" ? "transparent" : colors.surface,
        borderWidth: variant === "ghost" ? 0 : 1,
        borderColor: isPrimary ? colors.primary : colors.border,
        opacity: pressed ? 0.82 : 1
      })}
    >
      <Text selectable style={{ color: isPrimary ? "#ffffff" : colors.text, fontWeight: "700", fontSize: 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text selectable style={{ color: colors.text, fontWeight: "700", fontSize: 13 }}>
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
        minHeight: multiline ? 96 : 46,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: colors.text,
        fontSize: 15
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
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 18,
          padding: 18,
          gap: 16,
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
        minHeight: 38,
        paddingHorizontal: 13,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
        backgroundColor: active ? "#eff6ff" : colors.surface
      }}
    >
      <Text selectable style={{ color: active ? colors.primaryDark : colors.textMuted, fontWeight: "700", fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}
