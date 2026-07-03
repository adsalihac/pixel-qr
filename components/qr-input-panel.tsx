import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { FieldLabel, Input, Panel, SelectPill } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";
import { QRFormValues, QRKind } from "@/types/qr";
import { qrFormSchema } from "@/utils/qr-validation";

const kindOptions: { value: QRKind; label: string }[] = [
  { value: "url", label: "URL" },
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "vcard", label: "vCard" },
  { value: "upi", label: "UPI" },
  { value: "deeplink", label: "Deep link" },
];

export function QRInputPanel() {
  const formValues = useQRStore((state) => state.formValues);
  const setFormValues = useQRStore((state) => state.setFormValues);
  const {
    control,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<QRFormValues>({
    defaultValues: formValues,
    resolver: zodResolver(qrFormSchema),
    mode: "onChange",
  });
  const selectedTemplate = useQRStore((state) => state.selectedTemplate);

  useEffect(() => {
    const subscription = watch((value) =>
      setFormValues(value as Partial<QRFormValues>)
    );
    return () => subscription.unsubscribe();
  }, [watch, setFormValues]);

  useEffect(() => {
    if (
      selectedTemplate &&
      JSON.stringify(getValues()) !== JSON.stringify(formValues)
    ) {
      reset(formValues);
    }
  }, [formValues, getValues, reset, selectedTemplate]);

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
          QR Content
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
          Choose the QR destination and keep the payload direct for faster scans.
        </Text>
      </View>

      <Controller
        control={control}
        name="kind"
        render={({ field }) => (
          <View style={{ gap: 8 }}>
            <FieldLabel>QR type</FieldLabel>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {kindOptions.map((option) => (
                <SelectPill
                  key={option.value}
                  value={field.value}
                  option={option.value}
                  label={option.label}
                  onSelect={field.onChange}
                />
              ))}
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <View style={{ gap: 8 }}>
            <FieldLabel>Destination or message</FieldLabel>
            <Input
              value={field.value}
              onChangeText={field.onChange}
              placeholder="pixelqr.app"
              multiline={watch("kind") === "text"}
            />
            {errors.content ? (
              <Text
                selectable
                style={{ color: colors.accent, fontWeight: "700", fontSize: 12 }}
              >
                {errors.content.message}
              </Text>
            ) : null}
          </View>
        )}
      />

      {watch("kind") === "email" ? (
        <Controller
          control={control}
          name="emailSubject"
          render={({ field }) => (
            <View style={{ gap: 8 }}>
              <FieldLabel>Email subject</FieldLabel>
              <Input
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Let's talk"
              />
            </View>
          )}
        />
      ) : null}

      {watch("kind") === "phone" ? (
        <Controller
          control={control}
          name="phoneCountryCode"
          render={({ field }) => (
            <View style={{ gap: 8 }}>
              <FieldLabel>Country code</FieldLabel>
              <Input
                value={field.value}
                onChangeText={field.onChange}
                placeholder="+1"
              />
            </View>
          )}
        />
      ) : null}

      {watch("kind") === "wifi" ? (
        <View style={{ gap: 12 }}>
          <Controller
            control={control}
            name="wifiSsid"
            render={({ field }) => (
              <View style={{ gap: 8 }}>
                <FieldLabel>Network name</FieldLabel>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Guest Wi-Fi"
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="wifiPassword"
            render={({ field }) => (
              <View style={{ gap: 8 }}>
                <FieldLabel>Password</FieldLabel>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Password"
                />
              </View>
            )}
          />
        </View>
      ) : null}

      <View style={{ gap: 12 }}>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <View style={{ gap: 8 }}>
              <FieldLabel>Title below QR</FieldLabel>
              <Input
                value={field.value}
                onChangeText={field.onChange}
                placeholder="PixelQR"
              />
            </View>
          )}
        />
        <Controller
          control={control}
          name="subtitle"
          render={({ field }) => (
            <View style={{ gap: 8 }}>
              <FieldLabel>Subtitle below QR</FieldLabel>
              <Input
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Scan to open"
              />
            </View>
          )}
        />
      </View>
    </Panel>
  );
}
