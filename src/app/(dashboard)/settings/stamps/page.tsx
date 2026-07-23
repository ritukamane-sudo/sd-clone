"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const stampTabs = [
  { label: "Stamp Settings", href: "/settings/stamps/stamp-settings" },
  { label: "Inventory Status", href: "/settings/stamps/inventory-status" },
];

export default function StampsPage() {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stamps</h1>
        <p className="text-sm text-muted-foreground">
          Manage stamp duty and inventory
        </p>
      </div>
      <div className="flex gap-4 border-b">
        {stampTabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "pb-3 text-sm font-medium transition-colors",
              pathname === tab.href
                ? "border-b-2 border-[#1b91fb] text-[#1b91fb]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">
        Select a tab above to manage stamp settings.
      </div>
    </div>
  );
}
