import { Card } from "@/components/ui/card";

export default function PricingAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pricing Analytics</h1>
        <p className="text-sm text-muted-foreground">
          View usage analytics and pricing information
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Contracts</p>
          <p className="text-2xl font-semibold">24</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Users</p>
          <p className="text-2xl font-semibold">4</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Storage Used</p>
          <p className="text-2xl font-semibold">156 MB</p>
        </Card>
      </div>
      <Card className="p-6">
        <h3 className="mb-2 font-medium">Usage Over Time</h3>
        <div className="h-48 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
          Chart coming soon
        </div>
      </Card>
    </div>
  );
}
