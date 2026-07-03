import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { Button, FieldLabel, Input } from "@/components/ui";
import { useQRStore } from "@/store/qr-store";

type ScanResult = { data: string } | null;

export function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const setFormValues = useQRStore((s) => s.setFormValues);
  const pushUndo = useQRStore((s) => s.pushUndo);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  }, []);

  const startScan = useCallback(async () => {
    setError("");
    setResult("");
    if (Platform.OS !== "web") {
      setError("Scanning is only available on web.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
      });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setScanning(true);
    } catch {
      setError("Camera access denied or unavailable.");
    }
  }, []);

  useEffect(() => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = async () => {
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const jsQR = (await import("jsqr")).default;
      const code: ScanResult = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setResult(code.data);
        stopCamera();
        return;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [scanning, stopCamera]);

  return (
    <View style={{ gap: 12 }}>
      <FieldLabel>Scan a QR code</FieldLabel>
      <Text
        selectable
        style={{
          color: colors.foreground,
          fontWeight: "700",
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        Point your camera at a QR code to decode it.
      </Text>

      {Platform.OS === "web" ? (
        <>
          <View
            style={{
              borderWidth: 4,
              borderColor: "#000",
              backgroundColor: "#000",
              overflow: "hidden",
              maxWidth: 400,
              aspectRatio: 1,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              display: scanning || result ? "flex" : "none",
            }}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: scanning && !result ? "block" : "none",
              }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {result ? (
              <View
                style={{
                  padding: 20,
                  backgroundColor: colors.white,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text
                  selectable
                  style={{
                    color: "#16a34a",
                    fontWeight: "900",
                    fontSize: 16,
                  }}
                >
                  Scanned!
                </Text>
                <Text
                  selectable
                  style={{
                    color: colors.foreground,
                    fontWeight: "700",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  {result.length > 100 ? result.slice(0, 100) + "…" : result}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {!scanning && !result ? (
              <Button label="Start Camera" onPress={startScan} />
            ) : null}
            {scanning ? (
              <Button label="Stop" variant="outline" onPress={stopCamera} />
            ) : null}
            {result ? (
              <Button
                label="Scan Again"
                variant="outline"
                onPress={() => {
                  setResult("");
                  startScan();
                }}
              />
            ) : null}
          </View>
        </>
      ) : (
        <View
          style={{
            borderWidth: 3,
            borderColor: "#000",
            padding: 16,
            backgroundColor: colors.muted,
          }}
        >
          <Text
            selectable
            style={{
              color: colors.foreground,
              fontWeight: "700",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            QR scanning is available on web browsers with camera access.
          </Text>
        </View>
      )}

      {result ? (
        <View style={{ gap: 8 }}>
          <FieldLabel>Decoded content</FieldLabel>
          <Input
            value={result}
            onChangeText={setResult}
            multiline
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              label="Use in Form"
              variant="primary"
              onPress={() => {
                pushUndo();
                setFormValues({ content: result });
                setResult("");
                stopCamera();
              }}
            />
            <Button
              label="Discard"
              variant="outline"
              onPress={() => {
                setResult("");
                stopCamera();
              }}
            />
          </View>
        </View>
      ) : null}

      {error ? (
        <Text
          selectable
          style={{
            color: "#dc2626",
            fontWeight: "700",
            fontSize: 12,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
