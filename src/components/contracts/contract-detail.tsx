"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  StatusTab,
  ApprovalsTab,
  CommentsTab,
  EmailsTab,
  VersionsTab,
  ReviewsTab,
  ActivityLogsTab,
} from "@/components/contracts/contract-tabs";
import type { ApiContract } from "@/lib/api/data";

const tabs = [
  "Information",
  "Status",
  "Approvals",
  "Comments",
  "Emails",
  "Versions",
  "Reviews",
  "Activity Logs",
] as const;

type Tab = (typeof tabs)[number];

export function ContractDetail({ id }: { id: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Information");
  const [contract, setContract] = useState<ApiContract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v2.1/public/contracts/${id}/`)
      .then((r) => r.json())
      .then(setContract)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border p-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
          </div>
          <div className="space-y-3 rounded-lg border p-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="space-y-6">
        <Link href="/contracts" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to Contracts
        </Link>
        <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">
          Contract not found.
        </div>
      </div>
    );
  }

  const statusColor =
    contract.status === "signed" || contract.status === "executed"
      ? "bg-green-100 text-green-700"
      : contract.status === "pending_approval"
      ? "bg-yellow-100 text-yellow-700"
      : contract.status === "draft"
      ? "bg-gray-100 text-gray-700"
      : contract.status === "on_hold"
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700";

  const handleAction = useCallback(async (action: string) => {
    try {
      switch (action) {
        case "Send to Counterparty":
          await fetch(`/api/v2.1/public/contracts/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "sent" }),
          });
          toast.success("Contract sent to counterparty");
          break;
        case "Move back to redlining":
          await fetch(`/api/v2.1/public/contracts/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "draft" }),
          });
          toast.success("Moved back to redlining");
          break;
        case "Put contract on hold":
          await fetch(`/api/v2.1/public/contracts/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "on_hold" }),
          });
          toast.success("Contract put on hold");
          break;
        case "Void contract":
          if (!confirm("Are you sure you want to void this contract?")) return;
          await fetch(`/api/v2.1/public/contracts/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "void" }),
          });
          toast.success("Contract voided");
          break;
        case "Delete contract":
          if (!confirm("Are you sure you want to permanently delete this contract?")) return;
          await fetch(`/api/v2.1/public/contracts/${id}/`, { method: "DELETE" });
          toast.success("Contract deleted");
          return router.push("/contracts");
        default:
          toast.info(`Action: ${action} (not yet implemented)`);
          return;
      }
    } catch {
      toast.error("Something went wrong");
      return;
    }
    window.location.reload();
  }, [id, router]);

  const renderTab = () => {
    switch (activeTab) {
      case "Information":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-sm font-medium">Contract Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Counterparty</dt>
                  <dd className="font-medium">{contract.counterparty_name}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{contract.counterparty_email || "-"}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Contract Type</dt>
                  <dd>{contract.contract_type}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Value</dt>
                  <dd className="font-medium">
                    {contract.value ? `${contract.currency} ${Number(contract.value).toLocaleString()}` : "-"}
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Start Date</dt>
                  <dd>{contract.start_date || "-"}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">End Date</dt>
                  <dd>{contract.end_date || "-"}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Kind</dt>
                  <dd className="capitalize">{contract.kind}</dd>
                </div>
                {contract.tags.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Tags</dt>
                      <dd>{contract.tags.join(", ")}</dd>
                    </div>
                  </>
                )}
              </dl>
            </Card>
            <Card className="p-6">
              <h3 className="mb-4 text-sm font-medium">Timeline</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created By</dt>
                  <dd className="font-medium">{contract.created_by_name}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created At</dt>
                  <dd>{new Date(contract.created_at).toLocaleDateString()}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last Updated</dt>
                  <dd>{new Date(contract.updated_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </Card>
          </div>
        );
      case "Status":
        return <StatusTab />;
      case "Approvals":
        return <ApprovalsTab contractId={id} />;
      case "Comments":
        return <CommentsTab contractId={id} />;
      case "Emails":
        return <EmailsTab contractId={id} />;
      case "Versions":
        return <VersionsTab contractId={id} />;
      case "Activity Logs":
        return <ActivityLogsTab contractId={id} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/contracts" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to Contracts
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">{contract.title}</h1>
          {contract.description && (
            <p className="text-sm text-muted-foreground">{contract.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={statusColor}>
            {contract.status.replace("_", " ")}
          </Badge>
          <Link href={`/contracts/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-muted hover:text-foreground">
              More Actions
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {[
                { label: "Send to Counterparty" },
                { label: "Move back to redlining" },
                { label: "Download Contract" },
                { label: "Upload new version" },
                { label: "Compare versions" },
                { label: "View version history" },
                { label: "View contract tasks" },
                { label: "Invite team" },
                { label: "Copy contract email" },
                { label: "Contract link preferences" },
                null,
                { label: "Put contract on hold" },
                { label: "Void contract" },
                { label: "Delete contract", danger: true },
              ].map((item, i) =>
                item === null ? (
                  <DropdownMenuSeparator key={i} />
                ) : (
                  <DropdownMenuItem
                    key={item.label}
                    className={"danger" in item && item.danger ? "text-red-600" : ""}
                    onClick={() => handleAction(item.label)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-b">
        <nav className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
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

      {renderTab()}
    </div>
  );
}
