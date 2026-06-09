import { ImageResponse } from "next/og";
import { EMBER_DATA_URI } from "@/lib/og-mark";
import { brand } from "@/data/brand";

// 1280×720 "wide" form-factor screenshot for the Android/desktop install
// dialog. Branded promo card (Satori can't screenshot the live DOM); colours
// mirror the --color tokens. Static so it's emitted at build time.
export const contentType = "image/png";
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "96px",
        background: "linear-gradient(135deg, #0a0712 0%, #15101f 55%, #0a0712 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "48px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={EMBER_DATA_URI} width={56} height={56} alt="" />
        <p
          style={{
            margin: 0,
            fontSize: "26px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "monospace",
            color: "#E8F1F8",
          }}
        >
          ignaite.app
        </p>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "84px",
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          color: "#E8F1F8",
          fontWeight: 600,
        }}
      >
        The AI apps directory,
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "84px",
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          color: "#08D9D6",
          fontWeight: 600,
        }}
      >
        managed by AI.
      </p>
      <p style={{ margin: "40px 0 0", fontSize: "28px", color: "#8FA3BA", maxWidth: "900px" }}>
        {brand.tagline}
      </p>
    </div>,
    { width: 1280, height: 720 },
  );
}
