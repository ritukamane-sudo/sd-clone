"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";

interface Obligation {
  id: string;
  contract_title: string;
  title: string;
  status: string;
  priority: string;
  assignee_name?: string;
  due_date?: string;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-50 text-red-600",
  medium: "bg-yellow-50 text-yellow-600",
  low: "bg-blue-50 text-blue-600",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

export default function ObligationsPage() {
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchObligations = () => {
    setLoading(true);
    let url = "/api/v2.1/public/obligations";
    if (statusFilter !== "all") url += `?status=${statusFilter}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => setObligations(data.results || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchObligations();
  }, [statusFilter]);

  const toggleStatus = async (ob: Obligation) => {
    const newStatus = ob.status === "completed" ? "pending" : "completed";
    try {
      await fetch(`/api/v2.1/public/obligations/${ob.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(newStatus === "completed" ? "Obligation completed" : "Obligation reopened");
      fetchObligations();
    } catch {
      toast.error("Failed to update obligation");
    }
  };

  const filtered = obligations.filter((o) => {
    if (!o.title.toLowerCase().includes(search.toLowerCase()) &&
        !o.contract_title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Obligations</h1>
          <p className="text-sm text-muted-foreground">Track and manage contract obligations</p>
        </div>
        <Button size="sm">Add Obligation</Button>
      </div>

      <div className="flex items-center gap-4">
        <input
          placeholder="Search obligations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
        />
        <div className="flex gap-1 rounded-lg border p-0.5">
          {["all", "pending", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-[#1b91fb] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : (
          filtered.map((ob) => (
            <Card key={ob.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleStatus(ob)} className="mt-0.5 shrink-0">
                    {ob.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-[#1b91fb]" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 ${ob.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                      <p className="font-medium">{ob.title}</p>
                      <Badge className={priorityColors[ob.priority] || priorityColors.medium}>
                        {ob.priority}
                      </Badge>
                    </div>
                    {ob.contract_title && (
                      <p className="text-sm text-muted-foreground">{ob.contract_title}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {ob.assignee_name && <span>Assignee: {ob.assignee_name}</span>}
                      {ob.due_date && <span>Due: {new Date(ob.due_date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
                <Badge className={statusColors[ob.status] || statusColors.pending}>
                  {ob.status}
                </Badge>
              </div>
            </Card>
          ))
        )}
        {!loading && filtered.length === 0 && (
          <EmptyState
            icon="check"
            title="No obligations found"
            description={search || statusFilter !== "all" ? "Try adjusting your search or filter." : "No obligations have been created yet. They appear here once added to contracts."}
          />
        )}
      </div>
    </div>
  );
}
