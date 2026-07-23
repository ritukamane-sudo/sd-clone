"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roles = [
  { name: "Admin", users: 1, permissions: ["Full access to all features"] },
  { name: "Legal", users: 2, permissions: ["Create & edit contracts", "Manage workflows"] },
  { name: "Finance", users: 1, permissions: ["View contracts", "Approve financial terms"] },
  { name: "Viewer", users: 1, permissions: ["Read-only access to contracts"] },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Roles</h1>
        <p className="text-sm text-muted-foreground">
          Manage roles and their permissions
        </p>
      </div>
      <div className="space-y-3">
        {roles.map((role) => (
          <Card key={role.name} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{role.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {role.users} user{role.users > 1 ? "s" : ""}
                  </Badge>
                </div>
                <ul className="mt-2 space-y-1">
                  {role.permissions.map((p) => (
                    <li key={p} className="text-sm text-muted-foreground">
                      &bull; {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
