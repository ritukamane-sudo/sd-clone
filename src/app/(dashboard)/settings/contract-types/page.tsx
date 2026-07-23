"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const contractTypes = [
  { name: "NDA", count: 15, color: "bg-blue-100 text-blue-700" },
  { name: "Employment", count: 8, color: "bg-green-100 text-green-700" },
  { name: "Vendor", count: 12, color: "bg-purple-100 text-purple-700" },
  { name: "License", count: 5, color: "bg-orange-100 text-orange-700" },
  { name: "Services", count: 20, color: "bg-pink-100 text-pink-700" },
  { name: "Supply", count: 7, color: "bg-teal-100 text-teal-700" },
];

export default function ContractTypesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contract Types</h1>
          <p className="text-sm text-muted-foreground">
            Manage contract type categories
          </p>
        </div>
        <Button size="sm">Add Type</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contractTypes.map((ct) => (
          <Card key={ct.name} className="p-4">
            <div className="flex items-center justify-between">
              <Badge className={ct.color}>{ct.name}</Badge>
              <span className="text-sm text-muted-foreground">
                {ct.count} contracts
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
