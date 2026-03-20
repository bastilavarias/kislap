"use client";

import type React from "react";

export async function trackProjectThenNavigate(
  event: React.MouseEvent<HTMLElement>,
  url: string | undefined,
  track?: () => Promise<unknown> | void,
) {
  if (!url || url === "#") return;

  try {
    void track?.();
  } catch {
    // Tracking should not block navigation.
  }
}
