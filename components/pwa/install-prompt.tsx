"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Share, X } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { brand } from "@/data/brand";

/**
 * Bespoke, on-brand install prompt anchored to the bottom of the viewport — the
 * deliberate replacement for Chrome's native top mini-infobar (suppressed in
 * useInstallPrompt). bottom-center on mobile, bottom-right on desktop. Renders
 * an "install" variant (Chromium) or an "ios" Add-to-Home-Screen guide.
 */
export function InstallPrompt() {
  const { mode, promptInstall, dismiss } = useInstallPrompt();
  const reduced = useReducedMotion();

  // Esc dismisses, matching the native banner's affordance.
  useEffect(() => {
    if (!mode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, dismiss]);

  // Reduced motion → appear/disappear with no transform (per CLAUDE.md §8).
  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 24 },
        transition: { type: "spring" as const, stiffness: 380, damping: 32 },
      };

  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          {...motionProps}
          role="dialog"
          aria-label={`Install ${brand.name}`}
          className="fixed bottom-0 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:max-w-md md:right-4 md:left-auto md:translate-x-0"
        >
          <div className="glass relative flex items-start gap-4 rounded-2xl p-4 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)]">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08]"
            >
              <BrandMark className="size-7" />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-[var(--color-ink)]">Install {brand.name}</p>
                {mode === "install" ? (
                  <p className="text-xs text-[var(--color-ink-soft)]">
                    Add the directory to your home screen — fast, full-screen, works offline.
                  </p>
                ) : (
                  <p className="flex flex-wrap items-center gap-1 text-xs text-[var(--color-ink-soft)]">
                    Tap
                    <Share
                      className="inline size-3.5 text-[var(--color-accent)]"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Share</span>
                    then <span className="text-[var(--color-ink)]">Add to Home Screen</span>.
                  </p>
                )}
              </div>

              {mode === "install" && (
                <div className="flex items-center gap-2 pt-0.5">
                  <Button size="sm" onClick={promptInstall}>
                    Install
                  </Button>
                  <Button size="sm" variant="ghost" onClick={dismiss}>
                    Not now
                  </Button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss install prompt"
              className="grid size-7 shrink-0 place-items-center rounded-full text-[var(--color-ink-dim)] transition-colors hover:bg-white/[0.06] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
