"use client";
import { useEffect } from "react";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { isStandalone } from "@/hooks/use-install-prompt";

/**
 * Single client island that powers the PWA: registers the service worker (in
 * production only, after the page settles) and hosts the bottom install prompt.
 * Mounted once in the root layout.
 */
export function PwaProvider() {
  // Lock pinch-zoom ONLY when launched as an installed app — a browser tab keeps
  // zoom so WCAG 1.4.4 / Lighthouse a11y stay intact (Lighthouse runs in-tab).
  useEffect(() => {
    if (!isStandalone()) return;
    const meta = document.querySelector('meta[name="viewport"]');
    const content = meta?.getAttribute("content");
    if (meta && content && !content.includes("user-scalable")) {
      meta.setAttribute("content", `${content}, maximum-scale=1, user-scalable=no`);
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    // Register after load + idle so the SW never competes with first paint.
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration failures are non-fatal — the site works without it */
      });
    };
    const onIdle = () =>
      "requestIdleCallback" in window
        ? (window as Window).requestIdleCallback(register)
        : setTimeout(register, 1);

    if (document.readyState === "complete") onIdle();
    else window.addEventListener("load", onIdle, { once: true });

    return () => window.removeEventListener("load", onIdle);
  }, []);

  return <InstallPrompt />;
}
