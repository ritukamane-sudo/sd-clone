"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const workflowTabs = ["Details", "Approvals", "Condition Library", "Email Settings", "Template"];

const workflow = {
  id: "11395",
  name: "Standard Contract Review",
  status: "active",
  steps: [
    { order: 1, name: "Submit Contract", assignee: "Creator", type: "Submission" },
    { order: 2, name: "Legal Review", assignee: "Legal Team", type: "Approval" },
    { order: 3, name: "Finance Review", assignee: "Finance Team", type: "Approval", condition: "Value > $50,000" },
    { order: 4, name: "Final Approval", assignee: "Admin", type: "Approval" },
  ],
};

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeTab, setActiveTab] = useState("Details");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/settings/workflow-manager"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Workflows
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{workflow.name}</h1>
            <Badge className="bg-green-100 text-green-700">{workflow.status}</Badge>
          </div>
          <Button size="sm">Edit Workflow</Button>
        </div>
      </div>

      <div className="border-b">
        <nav className="flex gap-6">
          {workflowTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#1b91fb] text-[#1b91fb]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "Details" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Workflow steps and their order of execution.
          </p>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
            <div className="space-y-6">
              {workflow.steps.map((step) => (
                <div key={step.order} className="relative pl-10">
                  <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-[#1b91fb] bg-white" />
                  <Card className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {step.order}. {step.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Assignee: {step.assignee}
                        </p>
                        {step.condition && (
                          <p className="mt-1 text-xs text-yellow-600">
                            Condition: {step.condition}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {step.type}
                      </Badge>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab !== "Details" && (
        <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">
          {activeTab} content coming soon.
        </div>
      )}
    </div>
  );
}
