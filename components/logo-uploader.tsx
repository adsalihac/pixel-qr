import { Image, Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/constants/theme";
import { Button } from "@/components/ui";

export function LogoUploader({ uri, onChange }: { uri?: string; onChange: (uri?: string) => void }) {
  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
      mediaTypes: ["images"]
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          minHeight: 86,
          borderRadius: 14,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: colors.borderStrong,
          backgroundColor: colors.surfaceMuted,
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
          gap: 8
        }}
      >
        {uri ? <Image source={{ uri }} style={{ width: 42, height: 42, borderRadius: 10 }} /> : null}
        <Text selectable style={{ color: colors.textMuted, fontSize: 13, textAlign: "center" }}>
          {uri ? "Logo ready for preview exports" : "Upload a square logo for branded QR codes"}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Button label="Upload logo" variant="secondary" onPress={pickLogo} />
        {uri ? (
          <Pressable onPress={() => onChange(undefined)} style={{ justifyContent: "center", paddingHorizontal: 10 }}>
            <Text selectable style={{ color: colors.danger, fontWeight: "700" }}>
              Remove
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
