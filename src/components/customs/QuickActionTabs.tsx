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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {tabs.map((tab) => (
          <QuickActionTab key={tab.href ?? tab.label} tab={tab} pathname={pathname} />
        ))}
      </div>
    </div>
  );
}

function QuickActionTab({ tab, pathname }: { tab: ActionTabConfig; pathname: string | null }) {
  const { hasAccess, loading } = useHasAccess(tab.permission as any);

  if (tab.permission && !loading && !hasAccess) return null;

  const isActive = !!tab.href && (pathname === tab.href || !!pathname?.startsWith(`${tab.href}/`));

  const className = `flex items-center rounded-2xl px-8 py-7 text-lg sm:text-xl font-bold text-left transition-colors cursor-pointer ${
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