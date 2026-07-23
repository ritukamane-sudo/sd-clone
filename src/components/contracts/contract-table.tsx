"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ApiContract } from "@/lib/api/data";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_approval: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  sent: "bg-purple-100 text-purple-700",
  signed: "bg-green-100 text-green-700",
  executed: "bg-emerald-100 text-emerald-700",
  void: "bg-red-100 text-red-700",
  on_hold: "bg-orange-100 text-orange-700",
};

function SkeletonRow() {
  return (
    <TableRow>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <TableCell key={i}>
          <div className="h-4 animate-pulse rounded bg-muted" style={{ width: i === 1 ? 16 : `${40 + i * 8}%` }} />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function ContractTable() {
  const [search, setSearch] = useState("");
  const [contracts, setContracts] = useState<ApiContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const pageSize = 15;

  const fetchContracts = useCallback(async (p: number) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(p));
    params.set("page_size", String(pageSize));
    try {
      const res = await fetch(`/api/v2.1/public/contracts/?${params.toString()}`);
      const data = await res.json();
      setContracts(data.results || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Failed to load contracts");
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    setPage(1);
    fetchContracts(1);
  }, [fetchContracts]);

  useEffect(() => {
    fetchContracts(page);
  }, [page, fetchContracts]);

  const totalPages = Math.ceil(total / pageSize);

  const toggleAll = () => {
    if (selected.size === contracts.length) setSelected(new Set());
    else setSelected(new Set(contracts.map((c) => c.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const bulkAction = async (status: string, label: string) => {
    if (selected.size === 0) return;
    let count = 0;
    for (const id of selected) {
      await fetch(`/api/v2.1/public/contracts/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      count++;
    }
    toast.success(`${count} contracts ${label}`);
    setSelected(new Set());
    fetchContracts(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search contracts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {selected.size > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selected.size}</span> selected
            <Button variant="outline" size="sm" onClick={() => bulkAction("void", "voided")}>Void</Button>
            <Button variant="outline" size="sm" onClick={() => bulkAction("on_hold", "put on hold")}>Hold</Button>
            <Button variant="outline" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm">Filters</Button>
          <Button variant="outline" size="sm">Columns</Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">
                <input
                  type="checkbox"
                  className="accent-[#1b91fb]"
                  checked={contracts.length > 0 && selected.size === contracts.length}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Counterparty</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : contracts.map((contract) => (
                  <TableRow key={contract.id} className="cursor-pointer">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="accent-[#1b91fb]"
                        checked={selected.has(contract.id)}
                        onChange={() => toggleOne(contract.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="font-medium text-[#1b91fb] hover:underline"
                      >
                        {contract.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contract.counterparty_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contract.contract_type}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[contract.status] || "bg-gray-100 text-gray-700"}>
                        {contract.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contract.value ? `${contract.currency} ${Number(contract.value).toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contract.created_by_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(contract.updated_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
              ))}
          </TableBody>
        </Table>

        {!loading && contracts.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            {search ? "No contracts match your search." : "No contracts yet. Create your first one!"}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const p = i + 1;
              return (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  className="min-w-[32px]"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
