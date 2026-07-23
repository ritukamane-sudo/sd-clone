import { Card } from "@/components/ui/card";

export default function InventoryStatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inventory Status</h1>
        <p className="text-sm text-muted-foreground">
          View your stamp inventory and usage
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Stamps</p>
          <p className="text-2xl font-semibold">0</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Used</p>
          <p className="text-2xl font-semibold">0</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Available</p>
          <p className="text-2xl font-semibold">0</p>
        </Card>
      </div>
    </div>
  );
}
