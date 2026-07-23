"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function APISettingsPage() {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">API Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your API keys and authentication
        </p>
      </div>
      <Card className="max-w-lg p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <div className="flex gap-2">
              <Input
                type={showKey ? "text" : "password"}
                value="sd_live_xxxxxxxxxxxxxxxxxxxx"
                readOnly
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Client ID</label>
            <Input value="client_xxxxxxxxxxxx" readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Base URL</label>
            <Input value="https://api.in.spotdraft.com" readOnly />
          </div>
          <Button variant="outline" size="sm">
            Regenerate API Key
          </Button>
        </div>
      </Card>
    </div>
  );
}
