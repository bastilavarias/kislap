"use client";

import type React from "react";

export async function trackThenNavigate(
  event: React.MouseEvent<HTMLElement>,
  url: string,
  track?: (url: string) => Promise<unknown> | void,
) {
  if (!url) return;

  try {
    void track?.(url);
  } catch {
    // Tracking should not block navigation.
  }
}
