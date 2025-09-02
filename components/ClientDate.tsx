"use client";
import React from "react";

export function ClientDate({ date }: { date: string | number | Date }) {
  // Deterministic ISO (YYYY-MM-DD) to prevent hydration mismatch across locales.
  const d = new Date(date)
  const formatted = isNaN(d.getTime())
    ? ""
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  return <span suppressHydrationWarning>{formatted}</span>
}
