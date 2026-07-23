"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const webhooks = [
  { id: 1, url: "https://example.com/webhooks/contracts", events: ["contract.signed", "contract.created"], status: "active" },
  { id: 2, url: "https://api.company.com/hooks/spotdraft", events: ["approval.completed"], status: "active" },
];

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Webhooks</h1>
          <p className="text-sm text-muted-foreground">
            Receive HTTP notifications for contract events
          </p>
        </div>
        <Button size="sm">Create Webhook</Button>
      </div>
      <div className="space-y-3">
        {webhooks.map((wh) => (
          <Card key={wh.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{wh.url}</p>
                <div className="flex gap-2">
                  {wh.events.map((e) => (
                    <Badge key={e} variant="secondary" className="text-xs">
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">{wh.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
