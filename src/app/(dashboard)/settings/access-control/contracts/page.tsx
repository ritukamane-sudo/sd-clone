"use client";

import { Card } from "@/components/ui/card";

const accessRules = [
  { contractType: "NDA", teams: ["Legal", "Management"], visibility: "All" },
  { contractType: "Employment", teams: ["HR", "Legal"], visibility: "Restricted" },
  { contractType: "Vendor", teams: ["Procurement", "Finance"], visibility: "All" },
  { contractType: "Sales", teams: ["Sales", "Legal"], visibility: "Restricted" },
];

export default function ContractsAccessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Contract Access Control</h1>
        <p className="text-sm text-muted-foreground">
          Control which teams can access specific contract types
        </p>
      </div>
      <Card>
        <div className="divide-y">
          {accessRules.map((rule) => (
            <div
              key={rule.contractType}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="text-sm font-medium">{rule.contractType}</p>
                <p className="text-xs text-muted-foreground">
                  {rule.teams.join(", ")}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">
                {rule.visibility}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
