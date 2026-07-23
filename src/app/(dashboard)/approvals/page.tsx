"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";

interface Approval {
  id: string;
  contract_id: string;
  contract_title: string;
  approver_name: string;
  status: string;
  comment?: string;
  created_at: string;
}

export default function ApprovalsPage() {
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = () => {
    setLoading(true);
    const statusFilter = tab === "pending" ? "?status=pending" : "";
    fetch(`/api/v2.1/public/approvals${statusFilter}`)
      .then((r) => r.json())
      .then((data) => setApprovals(data.results || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApprovals();
  }, [tab]);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    const contractId = approvals.find((a) => a.id === id)?.contract_id;
    if (!contractId) return;

    try {
      await fetch(`/api/v2.1/public/contracts/${contractId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "approved" ? "approved" : "draft",
        }),
      });
      toast.success(action === "approved" ? "Contract approved" : "Contract rejected");
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Failed to update approval");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Approvals</h1>
        <p className="text-sm text-muted-foreground">Review and manage contract approvals</p>
      </div>

      <div className="flex gap-4 border-b">
        {(["pending", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-[#1b91fb] text-[#1b91fb]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "pending" ? "Pending" : "History"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : (
          approvals.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Link
                    href={`/contracts/${a.contract_id}`}
                    className="font-medium text-[#1b91fb] hover:underline"
                  >
                    {a.contract_title}
                  </Link>
                  <p className="text-sm text-muted-foreground">Approver: {a.approver_name}</p>
                  {a.comment && (
                    <p className="text-sm text-muted-foreground italic">&ldquo;{a.comment}&rdquo;</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      a.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {a.status}
                  </Badge>
                  {tab === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(a.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleAction(a.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
        {!loading && approvals.length === 0 && (
          <EmptyState
            icon="check"
            title={`No ${tab} approvals`}
            description={tab === "pending" ? "All caught up! No pending approvals require your attention." : "No approval history to show."}
            action={tab === "pending" ? { label: "View contracts", href: "/contracts" } : undefined}
          />
        )}
      </div>
    </div>
  );
}
