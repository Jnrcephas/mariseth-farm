"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { ActionTabConfig } from "@/lib/actionTabs";

/**
 * Renders a row of tappable "Actions" tabs (Farms / Farmers / Products,
 * etc.) used at the top of hub pages, replacing what used to be expandable
 * sidebar sub-menus. Each tab is a real link to its own route, so browser
 * back/forward, deep-linking, and page-level data fetching all keep working
 * exactly as before — this is purely a navigation UI change.
 */
export default function QuickActionTabs({ tabs }: { tabs: ActionTabConfig[] }) {
  const pathname = usePathname();

  if (tabs.length <= 1) return null;

  return (
    <div className="mb-8">
      <div className="font-bold text-xl text-black mb-4">Actions</div>
      <div className="flex flex-wrap gap-4">
        {tabs.map((tab) => (
          <QuickActionTab key={tab.href} tab={tab} pathname={pathname} />
        ))}
      </div>
    </div>
  );
}

function QuickActionTab({ tab, pathname }: { tab: ActionTabConfig; pathname: string | null }) {
  const { hasAccess, loading } = useHasAccess(tab.permission as any);

  if (tab.permission && !loading && !hasAccess) return null;

  const isActive = pathname === tab.href || !!pathname?.startsWith(`${tab.href}/`);

  return (
    <Link
      href={tab.href}
      className={`flex items-center justify-center rounded-sm w-[220px] px-6 py-6 text-lg font-bold text-center transition-colors cursor-pointer ${
        isActive
          ? "bg-[#0B3D19] text-white"
          : "bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]"
      }`}
    >
      {tab.label}
    </Link>
  );
}