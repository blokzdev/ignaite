import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";
import { EMBER_DATA_URI } from "@/lib/og-mark";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

const INK = "#E8F1F8";
const INK_DIM = "#8FA3BA";
const ACCENT = "#08D9D6";

// Brand fonts for the OG cards. Satori needs the raw font data (ttf/otf — not
// woff2), passed to ImageResponse; read once at module scope (SSG/build time).
const FONT_DIR = join(process.cwd(), "node_modules/geist/dist/fonts");
const fonts = [
  {
    name: "Geist",
    data: readFileSync(join(FONT_DIR, "geist-sans/Geist-Regular.ttf")),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Geist",
    data: readFileSync(join(FONT_DIR, "geist-sans/Geist-SemiBold.ttf")),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "Geist Mono",
    data: readFileSync(join(FONT_DIR, "geist-mono/GeistMono-Regular.ttf")),
    weight: 400 as const,
    style: "normal" as const,
  },
];

const SANS = "Geist";
const MONO = "Geist Mono";

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface OgConfig {
  /** Small mono uppercase tag above the title. */
  eyebrow: string;
  /** Ink-coloured first line. */
  titleA: string;
  /** Accent-coloured second line. */
  titleB: string;
  /** Optional mono stat line under the title (e.g. directory breadth). Omit for plain cards. */
  sub?: string;
}

export interface AppOgConfig {
  /** `// CATEGORY · VENDOR`. */
  eyebrow: string;
  name: string;
  tagline: string;
  /** Two-char monogram. */
  monogram: string;
  /** App accent (hex). */
  accent: string;
  /** Compact spec line, e.g. `FREE · PROPRIETARY · WEB · iOS`. */
  stats: string;
}

export interface RecipeOgConfig {
  /** Mono eyebrow, e.g. `// RECIPE · 5 STEPS`. */
  eyebrow: string;
  /** Recipe title (main line). */
  title: string;
  /** Mono app-chain sub-line, e.g. `Undermind → Elicit → ElevenLabs +2`. */
  sub: string;
}

// Shared chrome — background blooms, top brand mark, footer rule — wrapping a
// per-card body.
function Frame({ children }: { children: ReactNode }): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0a0712 0%, #15101f 55%, #0a0712 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "80px",
        position: "relative",
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-220px",
          right: "-220px",
          width: "640px",
          height: "640px",
          background:
            "radial-gradient(circle, rgba(255, 122, 51, 0.22) 0%, rgba(8, 217, 214, 0.18) 38%, rgba(8, 217, 214, 0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-160px",
          left: "-160px",
          width: "480px",
          height: "480px",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(124, 58, 237, 0) 70%)",
        }}
      />

      {/* Brand mark */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", color: INK }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={EMBER_DATA_URI} width={30} height={30} alt="" />
        <p
          style={{
            margin: 0,
            fontSize: "20px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: MONO,
          }}
        >
          ignaite.app
        </p>
      </div>

      {children}

      {/* Footer rule */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          color: INK_DIM,
          fontSize: "18px",
          fontFamily: MONO,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(8, 217, 214, 0), rgba(8, 217, 214, 0.5), rgba(8, 217, 214, 0))",
          }}
        />
        <span>ignaite.app</span>
      </div>
    </div>
  );
}

// Generic card (root / about / contact): eyebrow + two big title lines.
function OgTemplate({ eyebrow, titleA, titleB, sub }: OgConfig): ReactElement {
  return (
    <Frame>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          marginBottom: "auto",
          paddingTop: "32px",
        }}
      >
        <p
          style={{
            margin: "0 0 32px",
            color: ACCENT,
            fontSize: "22px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: MONO,
          }}
        >
          {eyebrow}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "108px",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            color: INK,
            fontWeight: 600,
          }}
        >
          {titleA}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "108px",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            color: ACCENT,
            fontWeight: 600,
          }}
        >
          {titleB}
        </p>
        {sub ? (
          <p
            style={{
              margin: "36px 0 0",
              color: INK_DIM,
              fontSize: "26px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: MONO,
            }}
          >
            {sub}
          </p>
        ) : null}
      </div>
    </Frame>
  );
}

// Enriched per-app card: monogram + eyebrow + name + tagline + spec line, in the
// brand fonts and the app's accent — mirrors the detail-page masthead/stat strip.
function AppOgTemplate({
  eyebrow,
  name,
  tagline,
  monogram,
  accent,
  stats,
}: AppOgConfig): ReactElement {
  return (
    <Frame>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          marginBottom: "auto",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              borderRadius: "28px",
              background: `linear-gradient(135deg, ${hexToRgba(accent, 0.55)}, ${hexToRgba(accent, 0)})`,
              boxShadow: `inset 0 0 0 1px ${hexToRgba(accent, 0.35)}`,
              color: accent,
              fontSize: "44px",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            {monogram}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                margin: "0 0 14px",
                color: accent,
                fontSize: "24px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: MONO,
              }}
            >
              {eyebrow}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "84px",
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                color: INK,
                fontWeight: 600,
              }}
            >
              {name}
            </p>
          </div>
        </div>

        <p
          style={{
            margin: "40px 0 0",
            fontSize: "34px",
            lineHeight: 1.3,
            color: INK_DIM,
            maxWidth: "900px",
          }}
        >
          {tagline}
        </p>

        <p
          style={{
            margin: "36px 0 0",
            fontSize: "24px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: MONO,
            color: INK,
          }}
        >
          {stats}
        </p>
      </div>
    </Frame>
  );
}

// Per-recipe card: eyebrow + the recipe title + a mono app-chain sub-line. Same
// Frame chrome; flexbox-only (Satori). Mirrors the generic OgTemplate rhythm.
function RecipeOgTemplate({ eyebrow, title, sub }: RecipeOgConfig): ReactElement {
  return (
    <Frame>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          marginBottom: "auto",
          paddingTop: "24px",
        }}
      >
        <p
          style={{
            margin: "0 0 28px",
            color: ACCENT,
            fontSize: "24px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: MONO,
          }}
        >
          {eyebrow}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "84px",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: INK,
            fontWeight: 600,
            maxWidth: "1000px",
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: "36px 0 0",
            fontSize: "30px",
            letterSpacing: "0.06em",
            color: INK_DIM,
            fontFamily: MONO,
            maxWidth: "1000px",
          }}
        >
          {sub}
        </p>
      </div>
    </Frame>
  );
}

export async function renderOgImage(config: OgConfig) {
  return new ImageResponse(<OgTemplate {...config} />, { ...OG_SIZE, fonts });
}

export async function renderAppOgImage(config: AppOgConfig) {
  return new ImageResponse(<AppOgTemplate {...config} />, { ...OG_SIZE, fonts });
}

export async function renderRecipeOgImage(config: RecipeOgConfig) {
  return new ImageResponse(<RecipeOgTemplate {...config} />, { ...OG_SIZE, fonts });
}
