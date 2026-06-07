"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { brand } from "@/data/brand";
import { checkRateLimit } from "@/lib/rate-limit";

const TO = process.env.CONTACT_TO_EMAIL ?? brand.social.email;
const FROM = process.env.CONTACT_FROM_EMAIL ?? "Blokz <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactResult {
  ok: boolean;
  error?: string;
}

const PROJECT_LABELS: Record<string, string> = {
  compare: "Help choosing",
  "suggest-app": "App suggestion",
  "suggest-category": "Category suggestion",
  correction: "Directory correction",
  sponsorship: "Sponsorship inquiry",
  press: "Press / partnership",
  "oss-collab": "OSS collaboration",
  other: "Something else",
};

export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Honeypot — bots fill every field, real users don't see this one.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { ok: true };
  }

  // Identify the requester for rate-limiting; behind Vercel the first hop
  // in x-forwarded-for is the real client.
  const h = await headers();
  const ipHeader = h.get("x-forwarded-for") ?? h.get("x-real-ip");
  const ip = ipHeader?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return {
      ok: false,
      error: `Too many submissions. Try again in ${limit.retryAfter ?? 60}s.`,
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Optional, only present when the visitor arrived from an app-detail page's
  // "Submit a correction" deeplink (?subject=Update+for+<App>).
  const customSubject = String(formData.get("subject") ?? "")
    .trim()
    .slice(0, 200);
  // Only present from the "Help me choose between apps" flow: the category and
  // the listings the visitor is weighing.
  const compareCategory = String(formData.get("category") ?? "").trim();
  const candidates = formData
    .getAll("candidates")
    .map((c) => String(c).trim())
    .filter(Boolean);

  if (!name) return { ok: false, error: "What should we call you?" };
  if (!email) return { ok: false, error: "We need an email to write back." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "That email doesn't look right." };
  if (!message) return { ok: false, error: "Tell us a little about what you have in mind." };
  if (message.length > 1000) {
    return { ok: false, error: "Please keep it under 1,000 characters." };
  }
  // Mirror the client guard: a comparison needs at least two listings.
  if (compareCategory && candidates.length < 2) {
    return { ok: false, error: "Please select at least two apps to compare." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY is not set; cannot deliver submission");
    return {
      ok: false,
      error: `Email is offline. Please write to ${brand.social.email} directly.`,
    };
  }

  const projectLabel = PROJECT_LABELS[projectType] ?? "Unspecified";
  const subject = customSubject
    ? `[blokz.dev] ${customSubject} — ${name}`
    : `[blokz.dev] ${projectLabel} — ${name}`;
  const text = [
    `From: ${name} <${email}>`,
    `Project type: ${projectLabel}`,
    ...(compareCategory ? [`Category: ${compareCategory}`] : []),
    ...(candidates.length ? [`Comparing: ${candidates.join(", ")}`] : []),
    "",
    message,
    "",
    "—",
    `IP: ${ip}`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject,
      text,
    });
    return { ok: true };
  } catch (err) {
    console.error("[contact] Resend send failed", err);
    return {
      ok: false,
      error: `Couldn't send. Please write to ${brand.social.email} directly.`,
    };
  }
}
