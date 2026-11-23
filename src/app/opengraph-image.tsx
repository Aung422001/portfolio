import { ImageResponse } from "next/og";

export const alt = "Aung Kyaw Hein — Frontend & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#0b1120,#1b355d)", color: "#e8edf5" }}>
    <div style={{ display: "flex", fontSize: 24, color: "#9ec3ff", letterSpacing: 4 }}>PORTFOLIO · 2026</div>
    <div style={{ display: "flex", fontSize: 78, fontWeight: 700, marginTop: 28 }}>Aung Kyaw Hein</div>
    <div style={{ display: "flex", fontSize: 38, color: "#74a9ff", marginTop: 12 }}>Frontend & Full-Stack Developer</div>
    <div style={{ display: "flex", fontSize: 25, marginTop: 45, color: "#c6d4e8" }}>React · Next.js · TypeScript · REST APIs</div>
    <div style={{ display: "flex", fontSize: 22, marginTop: 24, color: "#a8b8cf" }}>Chiang Mai, Thailand · B.Tech CSE</div>
  </div>, size);
}
