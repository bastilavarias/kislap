import { Portfolio } from "@/types/portfolio";

export function getPortfolioAvatarUrl(portfolio: Portfolio | null | undefined) {
  return portfolio?.avatar_url || portfolio?.user?.image_url || null;
}
