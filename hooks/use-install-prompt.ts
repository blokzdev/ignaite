"use client";
import { useCallback, useEffect, useState } from "react";

// The platform `beforeinstallprompt` event isn't in the DOM lib types yet.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type InstallMode = "install" | "ios" | null;

const DISMISS_KEY = "ignaite:pwa-dismissed";
const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000; // re-eligible after ~30 days

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari exposes standalone on navigator, not via display-mode.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS 13+ reports as Mac; disambiguate via touch points.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function recentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

/**
 * Owns all install-prompt state: captures `beforeinstallprompt` (suppressing the
 * native top infobar), detects iOS / already-installed, and persists dismissal.
 * The UI reads `mode` to decide whether — and how — to render the bottom banner.
 */
export function useInstallPrompt() {
  const [mode, setMode] = useState<InstallMode>(null);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    const onBeforeInstall = (event: Event) => {
      // Suppress Chrome's native mini-infobar so our bottom banner is the only
      // install affordance the user sees.
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setMode("install");
    };

    const onInstalled = () => {
      // Installed (via our prompt or the browser menu) — never nag again.
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        /* storage may be unavailable (private mode) — non-fatal */
      }
      setMode(null);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS has no beforeinstallprompt — offer manual A2HS guidance instead, but
    // only on Safari-like webkit (Chrome/Firefox on iOS can't install either).
    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIos()) {
      iosTimer = setTimeout(() => setMode((current) => current ?? "ios"), 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    // Whatever the outcome, the event is single-use — clear the banner.
    setDeferred(null);
    setMode(null);
  }, [deferred]);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* non-fatal */
    }
    setMode(null);
  }, []);

  return { mode, promptInstall, dismiss } as const;
}
