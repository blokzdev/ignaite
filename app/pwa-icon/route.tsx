import { ImageResponse } from "next/og";
import { EMBER_DATA_URI } from "@/lib/og-mark";

// 512×512 maskable PWA icon for Android add-to-home-screen / install. Full-bleed
// plum background so the launcher can mask it to any shape; the ember sits well
// inside the maskable safe zone (~60% of the canvas, centred).
export const contentType = "image/png";
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0712 0%, #15101f 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.32) 0%, rgba(255, 122, 51, 0.16) 45%, rgba(8, 217, 214, 0) 72%)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={EMBER_DATA_URI} width={300} height={300} alt="" />
    </div>,
    { width: 512, height: 512 },
  );
}
