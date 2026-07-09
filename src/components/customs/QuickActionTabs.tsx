"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { ActionTabConfig } from "@/lib/actionTabs";

/**
 * Renders a row of large tappable "Actions" tabs (Farms / Farmers / Products,
 * etc.) used at the top of hub pages, replacing what used to be expandable
 * sidebar sub-menus. Most tabs are a real link to their own route, so browser
 * back/forward, deep-linking, and page-level data fetching all keep working
 * exactly as before. A tab can also be given an `onClick` instead of an
 * `href` (e.g. the "Support" tab on the Help page, which opens a modal
 * rather than navigating anywhere) - see ActionTabConfig in lib/actionTabs.ts.
 */
export default function QuickActionTabs({ tabs }: { tabs: ActionTabConfig[] }) {
  const pathname = usePathname();

  if (tabs.length <= 1) return null;

  return (
    <div className="mb-8">
      <div className="font-bold text-xl text-black mb-4">Actions</div>
      {/*
        flex-wrap + a fixed width per tab (NOT CSS grid's `1fr`/`auto-fit`).
        `auto-fit` with `minmax(220px, 1fr)` collapses empty tracks and then
        stretches whatever tabs remain to fill the row - so 1-3 tabs balloon
        outward instead of staying compact. Giving each tab wrapper a fixed
        width keeps every tab the same size it would be in a full row,
        regardless of how many are actually rendered.
      */}
      <div className="flex flex-wrap items-stretch gap-4">
        {tabs.map((tab) => (
          <div key={tab.href ?? tab.label} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[220px]">
            <QuickActionTab tab={tab} pathname={pathname} />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionTab({ tab, pathname }: { tab: ActionTabConfig; pathname: string | null }) {
  const { hasAccess, loading } = useHasAccess(tab.permission as any);

  if (tab.permission && !loading && !hasAccess) return null;

  const isActive = !!tab.href && (pathname === tab.href || !!pathname?.startsWith(`${tab.href}/`));

  const className = `flex h-full w-full min-h-[92px] items-center rounded-2xl px-8 py-5 text-lg sm:text-xl font-bold leading-tight text-left transition-colors cursor-pointer ${
    isActive
      ? "bg-[#0B3D19] text-white"
      : "bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]"
  }`;

  if (tab.onClick) {
    return (
      <button type="button" onClick={tab.onClick} className={className}>
        {tab.label}
      </button>
    );
  }

  if (tab.external) {
    return (
      <a href={tab.href} target="_blank" rel="noopener noreferrer" className={className}>
        {tab.label}
      </a>
    );
  }

  return (
    <Link href={tab.href as string} className={className}>
      {tab.label}
    </Link>
  );
}