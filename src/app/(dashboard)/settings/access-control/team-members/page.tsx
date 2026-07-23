"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const members = [
  { name: "Rituka Mane", email: "rituka@duroflex.com", role: "Admin", teams: "Legal" },
  { name: "Amit Sharma", email: "amit@duroflex.com", role: "Legal", teams: "Legal" },
  { name: "Priya Patel", email: "priya@duroflex.com", role: "Finance", teams: "Finance" },
  { name: "Raj Kumar", email: "raj@duroflex.com", role: "Viewer", teams: "Management" },
];

export default function TeamMembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Team Members</h1>
          <p className="text-sm text-muted-foreground">
            Manage who has access to your workspace
          </p>
        </div>
        <Button size="sm">Invite Users</Button>
      </div>
      <Card>
        <div className="divide-y">
          {members.map((m) => (
            <div
              key={m.email}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#f0f7ff] flex items-center justify-center text-sm font-medium text-[#1b91fb]">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{m.teams}</span>
                <Badge variant="secondary">{m.role}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
