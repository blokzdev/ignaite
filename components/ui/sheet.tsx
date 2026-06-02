"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-[state=closed]:opacity-0",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type Side = "left" | "right" | "top" | "bottom";

const sideClasses: Record<Side, string> = {
  right:
    "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-white/[0.06] data-[state=closed]:translate-x-full",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-white/[0.06] data-[state=closed]:-translate-x-full",
  top: "inset-x-0 top-0 w-full border-b border-white/[0.06] data-[state=closed]:-translate-y-full",
  bottom:
    "inset-x-0 bottom-0 w-full border-t border-white/[0.06] data-[state=closed]:translate-y-full",
};

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: Side;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 bg-[var(--color-surface)] p-6 shadow-2xl ring-1 ring-white/[0.08] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        sideClasses[side],
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute top-4 right-4 rounded-full p-1 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-base font-medium text-[var(--color-ink)]", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--color-ink-dim)]", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
