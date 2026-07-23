import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OrganisationDetailsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Organization Details</h1>
        <p className="text-sm text-muted-foreground">
          Manage your organization settings
        </p>
      </div>
      <Card className="max-w-lg p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Organization Name</label>
            <Input defaultValue="Duroflex Limited" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cluster</label>
            <Input defaultValue="India (IN)" disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace ID</label>
            <Input defaultValue="701855" disabled />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
