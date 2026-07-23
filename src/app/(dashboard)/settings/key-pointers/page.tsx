"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const keyPointers = [
  { field: "Effective Date", type: "Date", required: true },
  { field: "Expiration Date", type: "Date", required: true },
  { field: "Contract Value", type: "Currency", required: false },
  { field: "Governing Law", type: "Text", required: true },
  { field: "Auto-Renewal", type: "Boolean", required: false },
  { field: "Notice Period", type: "Number", required: false },
];

export default function KeyPointersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Key Pointers</h1>
          <p className="text-sm text-muted-foreground">
            Define key data fields to extract from contracts
          </p>
        </div>
        <Button size="sm">Add Key Pointer</Button>
      </div>
      <Card>
        <div className="divide-y">
          {keyPointers.map((kp) => (
            <div key={kp.field} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{kp.field}</p>
                <p className="text-xs text-muted-foreground">{kp.type}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {kp.required ? "Required" : "Optional"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
