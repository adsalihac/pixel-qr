import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

const globalCSS = `
html, body { background-color: #FFFDF5; font-family: "Space Grotesk", sans-serif; }
.neo-halftone { background-image: radial-gradient(#000 1.5px, transparent 1.5px); background-size: 20px 20px; }
.neo-grid { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px); }
.neo-noise { position: relative; }
.neo-noise::after { content: ""; position: absolute; inset: 0; opacity: 0.035; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 200px 200px; }
.neo-radial { background-image: radial-gradient(circle, #000 1.5px, transparent 1.5px); background-size: 24px 24px; }
@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 10s linear infinite; }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
.animate-float { animation: float 3s ease-in-out infinite; }
@keyframes wobble { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
.animate-wobble { animation: wobble 2s ease-in-out infinite; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.animate-marquee { animation: marquee 20s linear infinite; }
@media (prefers-reduced-motion: reduce) { .animate-spin-slow, .animate-float, .animate-wobble, .animate-marquee { animation: none; } }
.neo-text-stroke { color: transparent; -webkit-text-stroke: 2px #000; text-stroke: 2px #000; }
*:focus-visible { outline: 3px solid #000; outline-offset: 2px; }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #FFFDF5; }
::-webkit-scrollbar-thumb { background: #000; border-radius: 0; }
`;

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&display=block";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      const style = document.createElement("style");
      style.textContent = globalCSS;
      document.head.appendChild(style);

      // Register service worker for PWA offline
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => {})
          .catch(() => {});
      }
    }
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
