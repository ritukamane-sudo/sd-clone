"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const integrations = [
  { name: "Google Drive", category: "Storage", status: "connected", color: "bg-green-100 text-green-700" },
  { name: "DocuSign", category: "E-Signature", status: "available", color: "bg-blue-100 text-blue-700" },
  { name: "Slack", category: "Communication", status: "available", color: "bg-purple-100 text-purple-700" },
  { name: "Salesforce", category: "CRM", status: "available", color: "bg-orange-100 text-orange-700" },
  { name: "QuickBooks", category: "Accounting", status: "available", color: "bg-teal-100 text-teal-700" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="text-sm text-muted-foreground">
          Connect your tools with SpotDraft
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((int) => (
          <Card key={int.name} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{int.name}</p>
                <p className="text-xs text-muted-foreground">{int.category}</p>
              </div>
              <Badge className={int.color}>
                {int.status}
              </Badge>
            </div>
            <Button
              variant={int.status === "connected" ? "outline" : "default"}
              size="sm"
              className="mt-3"
            >
              {int.status === "connected" ? "Configure" : "Connect"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
