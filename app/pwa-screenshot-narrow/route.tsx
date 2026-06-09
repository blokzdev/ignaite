import { ImageResponse } from "next/og";
import { EMBER_DATA_URI } from "@/lib/og-mark";
import { brand } from "@/data/brand";

// 720×1280 "narrow" (phone) form-factor screenshot for the install dialog.
// Same branded promo treatment as the wide variant, portrait-stacked.
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
        padding: "72px",
        background: "linear-gradient(160deg, #0a0712 0%, #15101f 55%, #0a0712 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={EMBER_DATA_URI} width={48} height={48} alt="" />
        <p
          style={{
            margin: 0,
            fontSize: "22px",
            letterSpacing: "0.16em",
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
          fontSize: "68px",
          lineHeight: 1.06,
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
          fontSize: "68px",
          lineHeight: 1.06,
          letterSpacing: "-0.025em",
          color: "#08D9D6",
          fontWeight: 600,
        }}
      >
        managed by AI.
      </p>
      <p style={{ margin: "36px 0 0", fontSize: "26px", lineHeight: 1.4, color: "#8FA3BA" }}>
        {brand.tagline}
      </p>
    </div>,
    { width: 720, height: 1280 },
  );
}
