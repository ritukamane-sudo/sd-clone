"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// --- Status Tab ---
export function StatusTab() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Status</span>
          <Badge className="bg-green-100 text-green-700">Signed</Badge>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Contract Kind</span>
          <span className="text-sm font-medium capitalize">New</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Execution Date</span>
          <span className="text-sm">2026-07-20</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Expiry Date</span>
          <span className="text-sm">2027-07-01</span>
        </div>
      </div>
    </Card>
  );
}

// --- Approvals Tab ---
export function ApprovalsTab({ contractId }: { contractId?: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!contractId) return;
    fetch(`/api/v2.1/public/contracts/${contractId}/approvals/`)
      .then((r) => r.json())
      .then((d) => setItems(d.results || []));
  }, [contractId]);

  return (
    <div className="space-y-3">
      {items.map((a: any) => (
        <Card key={a.id || a.approver_name} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{a.approver_name || a.approver}</p>
              {a.comment && <p className="text-sm text-muted-foreground">&ldquo;{a.comment}&rdquo;</p>}
              <p className="text-xs text-muted-foreground">
                {a.created_at || a.updated_at ? new Date(a.created_at || a.updated_at).toLocaleDateString() : ""}
              </p>
            </div>
            <Badge variant="secondary" className={a.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
              {a.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

// --- Comments Tab ---
export function CommentsTab({ contractId }: { contractId?: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = () => {
    if (!contractId) return;
    fetch(`/api/v2.1/public/contracts/${contractId}/comments/`)
      .then((r) => r.json())
      .then((d) => setItems(d.results || []));
  };

  useEffect(() => { fetchComments(); }, [contractId]);

  const handlePost = async () => {
    if (!newComment.trim() || !contractId) return;
    try {
      await fetch(`/api/v2.1/public/contracts/${contractId}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment, authorName: "Rituka Mane" }),
      });
      toast.success("Comment posted");
      setNewComment("");
      fetchComments();
    } catch {
      toast.error("Failed to post comment");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f7ff] text-xs font-medium text-[#1b91fb]">
          RM
        </div>
        <div className="flex-1 space-y-2">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm min-h-[80px] resize-none"
          />
          <Button size="sm" disabled={!newComment.trim()} onClick={handlePost}>Post Comment</Button>
        </div>
      </div>
      <Separator />
      {items.map((c: any) => (
        <div key={c.id} className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {c.authorName?.split(" ").map((n: string) => n[0]).join("") || "?"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{c.authorName}</span>
              <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Emails Tab ---
export function EmailsTab({ contractId }: { contractId?: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!contractId) return;
    fetch(`/api/v2.1/public/contracts/${contractId}/emails/`)
      .then((r) => r.json())
      .then((d) => setItems(d.results || []));
  }, [contractId]);

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">
          No emails for this contract.
        </div>
      )}
      {items.map((e: any) => (
        <Card key={e.id} className="cursor-pointer p-4 transition-colors hover:bg-muted/50">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{e.subject}</p>
              <p className="text-xs text-muted-foreground">From: {e.fromEmail}</p>
              {e.preview && <p className="text-sm text-muted-foreground line-clamp-1">{e.preview}</p>}
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{new Date(e.sentAt).toLocaleDateString()}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

// --- Versions Tab ---
export function VersionsTab({ contractId }: { contractId?: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!contractId) return;
    fetch(`/api/v2.1/public/contracts/${contractId}/versions/`)
      .then((r) => r.json())
      .then((d) => setItems(d.results || []));
  }, [contractId]);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button variant="outline" size="sm">Upload New Version</Button>
      </div>
      {items.map((v: any) => (
        <Card key={v.id} className={`p-4 ${v.version === items.length ? "border-[#1b91fb] ring-1 ring-[#1b91fb]/20" : ""}`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Version {v.version}</p>
              <p className="text-xs text-muted-foreground">
                By {v.authorName || "Unknown"} &middot; {new Date(v.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {v.version === items.length && <Badge className="bg-[#1b91fb] text-white text-xs">Current</Badge>}
              <Button variant="ghost" size="sm" className="text-xs">Preview</Button>
              <Button variant="ghost" size="sm" className="text-xs">Download</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// --- Reviews Tab ---
export function ReviewsTab() {
  const reviews = [
    { id: "rv-001", reviewer: "Legal Team", status: "completed", finding: "No issues found", date: "2026-07-15" },
    { id: "rv-002", reviewer: "Finance Team", status: "in_progress", finding: "", date: "2026-07-18" },
  ];

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <Card key={r.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{r.reviewer}</p>
              {r.finding && <p className="text-sm text-muted-foreground">{r.finding}</p>}
              <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</p>
            </div>
            <Badge variant="secondary" className={r.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
              {r.status.replace("_", " ")}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

// --- Activity Logs Tab ---
export function ActivityLogsTab({ contractId }: { contractId?: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!contractId) return;
    fetch(`/api/v2.1/public/contracts/${contractId}/activities/`)
      .then((r) => r.json())
      .then((d) => setItems(d.results || []));
  }, [contractId]);

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-0 h-full w-0.5 bg-border" />
      <div className="space-y-4">
        {items.map((a: any, i: number) => (
          <div key={a.id || i} className="relative pl-10">
            <div className="absolute left-2.5 top-1.5 h-2 w-2 rounded-full border-2 border-[#1b91fb] bg-white" />
            <div>
              <p className="text-sm">
                <span className="font-medium">{a.userName || "System"}</span> {a.action}
              </p>
              {a.description && <p className="text-xs text-muted-foreground">{a.description}</p>}
              <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
