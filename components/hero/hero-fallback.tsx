export function HeroFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 70%, rgba(8, 217, 214, 0.32) 0%, transparent 55%), radial-gradient(ellipse at 82% 18%, rgba(167, 139, 250, 0.18) 0%, transparent 45%), radial-gradient(ellipse at 18% 26%, rgba(55, 243, 255, 0.10) 0%, transparent 40%), #0a0712",
      }}
    />
  );
}
