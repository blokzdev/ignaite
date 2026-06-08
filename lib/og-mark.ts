// The Ignaite ember as a standalone SVG string for next/og (Satori) images —
// favicons + OG cards. Colours are hard-coded (Satori can't read CSS vars);
// keep them in sync with the --color-plum/accent/accent-hot/flame tokens in
// app/globals.css and the DOM mark in components/brand/brand-logo.tsx.
export const EMBER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -50 120 120"><defs><linearGradient id="o" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7c3aed"/><stop offset="0.5" stop-color="#08d9d6"/><stop offset="1" stop-color="#37f3ff"/></linearGradient><linearGradient id="c" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff6a1f"/><stop offset="1" stop-color="#ffce9a"/></linearGradient></defs><path d="M0,64 C-42,36 -34,-8 -2,-44 C-8,-20 10,-16 6,-40 C30,-10 40,34 0,64 Z" fill="url(#o)"/><path d="M0,58 C-22,40 -18,10 2,-14 C0,8 16,12 10,-8 C22,16 20,42 0,58 Z" fill="url(#c)"/></svg>`;

export const EMBER_DATA_URI = `data:image/svg+xml,${encodeURIComponent(EMBER_SVG)}`;
