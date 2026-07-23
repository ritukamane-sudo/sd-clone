import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StampSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stamp Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure stamp duty settings for your organization
        </p>
      </div>
      <Card className="max-w-lg p-6">
        <p className="mb-4 text-sm text-muted-foreground">
          No stamp configurations yet. Add your first stamp configuration.
        </p>
        <Button size="sm">Add Configuration</Button>
      </Card>
    </div>
  );
}
