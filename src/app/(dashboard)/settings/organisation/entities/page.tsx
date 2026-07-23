"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const entities = [
  { name: "Duroflex Limited", jurisdiction: "India", type: "Private Company", gstin: "27AABCD1234E1Z5" },
  { name: "Duroflex International Pte Ltd", jurisdiction: "Singapore", type: "Private Limited", uen: "202012345W" },
];

export default function EntitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organization Entities</h1>
          <p className="text-sm text-muted-foreground">
            Manage legal entities within your organization
          </p>
        </div>
        <Button size="sm">Add Entity</Button>
      </div>
      <div className="space-y-3">
        {entities.map((e) => (
          <Card key={e.name} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{e.name}</p>
                <p className="text-sm text-muted-foreground">
                  {e.jurisdiction} &middot; {e.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {e.gstin || e.uen}
                </p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
