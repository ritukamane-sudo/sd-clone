"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";

const notifications = [
  { id: "contract_signed", label: "Contract Signed", description: "When a contract is signed by all parties" },
  { id: "approval_needed", label: "Approval Needed", description: "When your approval is requested on a contract" },
  { id: "approval_completed", label: "Approval Completed", description: "When an approval request is resolved" },
  { id: "comment_added", label: "Comment Added", description: "When someone comments on a contract" },
  { id: "obligation_due", label: "Obligation Due", description: "When an obligation is approaching its due date" },
  { id: "contract_expiring", label: "Contract Expiring", description: "When a contract is near its end date" },
];

export default function NotificationPreferencesPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    contract_signed: true,
    approval_needed: true,
    approval_completed: false,
    comment_added: true,
    obligation_due: true,
    contract_expiring: true,
  });

  const toggle = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notification Preferences</h1>
        <p className="text-sm text-muted-foreground">
          Choose which notifications you receive
        </p>
      </div>
      <Card className="max-w-lg divide-y">
        {notifications.map((n) => (
          <label
            key={n.id}
            className="flex items-center justify-between p-4 cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.description}</p>
            </div>
            <input
              type="checkbox"
              checked={prefs[n.id]}
              onChange={() => toggle(n.id)}
              className="h-4 w-4 accent-[#1b91fb]"
            />
          </label>
        ))}
      </Card>
    </div>
  );
}
