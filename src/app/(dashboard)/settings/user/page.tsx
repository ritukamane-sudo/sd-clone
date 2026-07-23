import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">User Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal account settings
        </p>
      </div>
      <Card className="max-w-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted" />
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input defaultValue="Rituka Mane" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue="rituka@duroflex.com" disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <Input defaultValue="Legal Executive" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Teams</label>
            <Input defaultValue="Legal" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
