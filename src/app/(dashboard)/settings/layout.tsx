"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsNav = [
  { label: "User Profile", href: "/settings/user" },
  {
    label: "Organization",
    href: "/settings/organisation/details",
    children: [
      { label: "Details", href: "/settings/organisation/details" },
      { label: "Entities", href: "/settings/organisation/entities" },
    ],
  },
  {
    label: "Access Control",
    href: "/settings/access-control/team-members",
    children: [
      { label: "Team Members", href: "/settings/access-control/team-members" },
      { label: "Contracts", href: "/settings/access-control/contracts" },
      { label: "Roles", href: "/settings/access-control/roles" },
    ],
  },
  { label: "Workflow Manager", href: "/settings/workflow-manager" },
  { label: "Contract Types", href: "/settings/contract-types" },
  { label: "Key Pointers", href: "/settings/key-pointers" },
  { label: "Stamps", href: "/settings/stamps" },
  {
    label: "Developer Settings",
    href: "/settings/developer-settings/api",
    children: [
      { label: "API", href: "/settings/developer-settings/api" },
      { label: "Webhooks", href: "/settings/developer-settings/webhooks" },
    ],
  },
  { label: "Integrations", href: "/settings/integrations" },
  { label: "Security & Identity", href: "/settings/security-and-identity" },
  { label: "Notification Preferences", href: "/settings/notification-preferences" },
  { label: "Pricing Analytics", href: "/settings/pricing-analytics" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-8">
      <aside className="w-56 shrink-0">
        <nav className="space-y-1">
          {settingsNav.map((item) => {
            const active =
              pathname === item.href ||
              (item.children?.some((c) => pathname === c.href));
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#f0f7ff] text-[#1b91fb]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
