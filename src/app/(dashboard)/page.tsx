"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CheckCircle2, Clock, TrendingUp, ArrowRight, Plus } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  icon: typeof FileText;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [recentContracts, setRecentContracts] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/v2.1/public/contracts").then((r) => r.json()),
      fetch("/api/v2.1/public/approvals?status=pending").then((r) => r.json()),
      fetch("/api/v2.1/public/obligations?status=pending").then((r) => r.json()),
    ]).then(([contractsData, approvalsData, obligationsData]) => {
      const allContracts = contractsData.results || [];
      const signedThisMonth = allContracts.filter((c: any) =>
        c.status === "signed" || c.status === "executed"
      );

      setStats([
        { label: "Total Contracts", value: allContracts.length, icon: FileText, color: "text-[#1b91fb]" },
        { label: "Pending Approvals", value: (approvalsData.results || []).length, icon: CheckCircle2, color: "text-yellow-600" },
        { label: "Upcoming Obligations", value: (obligationsData.results || []).length, icon: Clock, color: "text-orange-600" },
        { label: "Signed This Month", value: signedThisMonth.length, icon: TrendingUp, color: "text-green-600" },
      ]);

      setRecentContracts(allContracts.slice(0, 5));
      setPendingApprovals((approvalsData.results || []).slice(0, 4));
      setLoading(false);
    });
  }, []);

  const statusColor = (s: string) =>
    s === "signed" || s === "executed" ? "bg-green-100 text-green-700"
    : s === "pending_approval" ? "bg-yellow-100 text-yellow-700"
    : s === "draft" ? "bg-gray-100 text-gray-700"
    : s === "on_hold" ? "bg-orange-100 text-orange-700"
    : "bg-blue-100 text-blue-700";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Rituka</p>
        </div>
        <Link href="/contracts/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            New Contract
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats
          ? stats.map((s) => (
              <Card key={s.label} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-3xl font-semibold">{s.value}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent Contracts</h2>
            <Link href="/contracts" className="text-xs text-[#1b91fb] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentContracts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No contracts yet.</p>
          ) : (
            <div className="space-y-2">
              {recentContracts.map((c: any) => (
                <Link key={c.id} href={`/contracts/${c.id}`}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.counterparty_name}</p>
                  </div>
                  <Badge variant="secondary" className={`shrink-0 ml-3 ${statusColor(c.status)}`}>
                    {c.status.replace("_", " ")}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium">Pending Approvals</h2>
            <Link href="/approvals" className="text-xs text-[#1b91fb] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {pendingApprovals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No pending approvals.</p>
          ) : (
            <div className="space-y-2">
              {pendingApprovals.map((a: any) => (
                <Link key={a.id} href={`/contracts/${a.contract_id}`}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.contract_title || a.contract}</p>
                    <p className="text-xs text-muted-foreground">By {a.approver_name || a.approver}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 ml-3 bg-yellow-100 text-yellow-700">
                    Pending
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
