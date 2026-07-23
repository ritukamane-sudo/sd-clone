"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const workflows = [
  { id: "11395", name: "Standard Contract Review", status: "active", steps: 4 },
  { id: "11051", name: "NDA Approval Flow", status: "active", steps: 2 },
  { id: "11572", name: "High Value Contract Review", status: "active", steps: 5 },
  { id: "7513", name: "Procurement Workflow", status: "inactive", steps: 3 },
];

export default function WorkflowManagerPage() {
  const [search, setSearch] = useState("");

  const filtered = workflows.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workflow Manager</h1>
          <p className="text-sm text-muted-foreground">
            Manage approval workflows and conditions
          </p>
        </div>
        <Button size="sm">Create Workflow</Button>
      </div>

      <div className="rounded-lg border">
        <div className="border-b p-3">
          <input
            placeholder="Search workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
          />
        </div>
        <div className="divide-y">
          {filtered.map((wf) => (
            <Link key={wf.id} href={`/settings/workflow-manager/${wf.id}/details`}>
              <div className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
                <div>
                  <p className="font-medium">{wf.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {wf.steps} steps
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    wf.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {wf.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
