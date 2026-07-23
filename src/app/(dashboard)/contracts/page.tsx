import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ContractTable } from "@/components/contracts/contract-table";
import Link from "next/link";

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contracts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your contracts and agreements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Import</Button>
          <Link href="/contracts/new">
            <Button size="sm">New Contract</Button>
          </Link>
        </div>
      </div>
      <Suspense fallback={<div className="rounded-lg border bg-card p-12 text-center text-sm">Loading contracts...</div>}>
        <ContractTable />
      </Suspense>
    </div>
  );
}
