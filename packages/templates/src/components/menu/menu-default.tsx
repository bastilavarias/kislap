"use client";

import React, { useMemo, useState } from "react";
import { Mode } from "@/contexts/settings-context";
import { usePageActivity } from "@/hooks/api/use-page-activity";
import { MenuDefaultCategorySections } from "./menu-default-category-sections";
import { MenuDefaultFeaturedSection } from "./menu-default-featured-section";
import { MenuDefaultGallerySection } from "./menu-default-gallery-section";
import { MenuDefaultHero } from "./menu-default-hero";
import { MenuDefaultItemDialog } from "./menu-default-item-dialog";
import { MENU_DEFAULT_SAMPLE_DATA } from "./menu-default-sample-data";
import { MenuCategory, MenuItem } from "./menu-types";

interface Props {
  menu?: any;
  themeMode: Mode;
  onSetThemeMode: React.Dispatch<React.SetStateAction<Mode>>;
}

export function MenuDefault({ menu, themeMode, onSetThemeMode }: Props) {
  const { trackPageLinkClick } = usePageActivity();
  const sortedCategories = useMemo(
    () =>
      [...(menu?.categories || [])].sort(
        (left, right) => (left.placement_order || 0) - (right.placement_order || 0)
      ),
    [menu?.categories]
  );
  const sortedItems = useMemo(
    () =>
      [...(menu?.items || [])].sort(
        (left, right) => (left.placement_order || 0) - (right.placement_order || 0)
      ),
    [menu?.items]
  );
  const displayMenu = useMemo(
    () => ({
      ...MENU_DEFAULT_SAMPLE_DATA,
      ...(menu || {}),
      business_hours:
        menu?.business_hours && menu.business_hours.length
          ? menu.business_hours
          : MENU_DEFAULT_SAMPLE_DATA.business_hours,
      social_links:
        menu?.social_links && menu.social_links.length
          ? menu.social_links
          : MENU_DEFAULT_SAMPLE_DATA.social_links,
      gallery_images:
        menu?.gallery_images && menu.gallery_images.length
          ? menu.gallery_images
          : MENU_DEFAULT_SAMPLE_DATA.gallery_images,
      categories:
        sortedCategories.length
          ? sortedCategories
          : MENU_DEFAULT_SAMPLE_DATA.categories,
      items:
        sortedItems.length ? sortedItems : MENU_DEFAULT_SAMPLE_DATA.items,
    }),
    [menu, sortedCategories, sortedItems]
  );
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(
    displayMenu.categories?.[0]?.id || null
  );
  const [activeItemID, setActiveItemID] = useState<number | null>(null);

  const visibleCategories = useMemo(
    () => (displayMenu.categories || []).filter((category) => category.is_visible !== false),
    [displayMenu.categories]
  );
  const socialLinks = useMemo(
    () => (displayMenu.social_links || []).filter((link) => link.url?.trim()),
    [displayMenu.social_links]
  );
  const businessHours = useMemo(
    () => (displayMenu.hours_enabled ? displayMenu.business_hours || [] : []),
    [displayMenu.business_hours, displayMenu.hours_enabled]
  );
  const featuredItems = useMemo(
    () =>
      (displayMenu.items || [])
        .filter((item) => item.is_featured && item.is_available !== false)
        .slice(0, 4),
    [displayMenu.items]
  );
  const activeItem = useMemo(
    () => (displayMenu.items || []).find((item) => item.id === activeItemID) || null,
    [activeItemID, displayMenu.items]
  );
  const activeItemCategory = useMemo(
    () =>
      activeItem
        ? visibleCategories.find((category) => category.id === activeItem.menu_category_id)
        : null,
    [activeItem, visibleCategories]
  );

  const filteredItems = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();
    return (displayMenu.items || []).filter((item) => {
      const belongsToCategory = !activeCategory || item.menu_category_id === activeCategory;
      const matchesQuery =
        !loweredQuery ||
        item.name.toLowerCase().includes(loweredQuery) ||
        (item.description || "").toLowerCase().includes(loweredQuery) ||
        (item.badge || "").toLowerCase().includes(loweredQuery);
      return belongsToCategory && matchesQuery;
    });
  }, [activeCategory, displayMenu.items, query]);

  const groupedItems = useMemo(
    () =>
      visibleCategories.map((category) => ({
        category,
        items: filteredItems.filter((item) => item.menu_category_id === category.id),
      })),
    [filteredItems, visibleCategories]
  );

  const hasVisibleItems = groupedItems.some(({ items }) => items.length > 0);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleCategoryClick = async (category: MenuCategory) => {
    setActiveCategory(category.id);
    if (displayMenu.project_id) {
      await trackPageLinkClick(displayMenu.project_id, `menu-category:${category.name}`);
    }
  };

  const handleItemClick = async (item: MenuItem) => {
    setActiveItemID(item.id);
    if (displayMenu.project_id) {
      await trackPageLinkClick(displayMenu.project_id, `menu-item:${item.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6">
        <MenuDefaultHero
          copied={copied}
          businessHours={businessHours}
          menu={displayMenu}
          query={query}
          socialLinks={socialLinks}
          themeMode={themeMode as "light" | "dark"}
          onQueryChange={setQuery}
          onShare={() => void handleShare()}
          onSetThemeMode={onSetThemeMode as React.Dispatch<React.SetStateAction<"light" | "dark">>}
        />

        <MenuDefaultFeaturedSection
          items={featuredItems}
          onItemClick={(item) => void handleItemClick(item)}
        />

        <MenuDefaultGallerySection images={displayMenu.gallery_images || []} />

        <MenuDefaultCategorySections
          activeCategory={activeCategory}
          groups={groupedItems}
          hasVisibleItems={hasVisibleItems}
          onCategoryClick={(category) => void handleCategoryClick(category)}
          onItemClick={(item) => void handleItemClick(item)}
        />
      </div>

      <MenuDefaultItemDialog
        item={activeItem}
        category={activeItemCategory}
        open={!!activeItem}
        onOpenChange={(open) => !open && setActiveItemID(null)}
      />
    </div>
  );
}
