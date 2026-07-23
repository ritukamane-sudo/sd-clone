"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, MessageSquare } from "lucide-react";

export interface SidebarComment {
  id: string;
  highlightText: string;
  author: string;
  text: string;
  createdAt: Date;
  resolved: boolean;
  replies: { author: string; text: string; createdAt: Date }[];
}

export function CommentSidebar({
  open,
  onClose,
  comments,
  onAddComment,
  onResolveComment,
  activeId,
  onSelectComment,
}: {
  open: boolean;
  onClose: () => void;
  comments: SidebarComment[];
  onAddComment: (id: string, text: string) => void;
  onResolveComment: (id: string) => void;
  activeId: string | null;
  onSelectComment: (id: string) => void;
}) {
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  if (!open) return null;

  return (
    <div className="w-80 shrink-0 border-l border-border bg-background overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Comments</span>
          <span className="text-xs text-muted-foreground">({comments.length})</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 p-4">
        {comments.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-8">
            Select text in the document and click Comment to add one.
          </p>
        )}

        {comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${
              activeId === c.id ? "border-[#1b91fb] bg-[#f0f7ff]" : "border-border hover:border-muted-foreground/30"
            }`}
            onClick={() => onSelectComment(c.id)}
          >
            <div className="mb-2 text-xs italic text-muted-foreground bg-muted rounded px-2 py-1">
              &ldquo;{c.highlightText}&rdquo;
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">{c.author}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onResolveComment(c.id); }}
                className="text-[10px] text-muted-foreground hover:text-green-600"
              >
                {c.resolved ? "Resolved" : "Resolve"}
              </button>
            </div>
            <p className="text-sm">{c.text}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {c.createdAt.toLocaleDateString()} {c.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>

            {c.replies.length > 0 && (
              <div className="mt-2 space-y-2 border-l-2 border-muted pl-2">
                {c.replies.map((r, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">{r.author}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {r.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 flex gap-2">
              <input
                placeholder="Reply..."
                value={replyText[c.id] || ""}
                onChange={(e) => setReplyText((prev) => ({ ...prev, [c.id]: e.target.value }))}
                className="flex-1 rounded border border-input bg-background px-2 py-1 text-xs"
              />
              <Button
                size="sm"
                className="h-6 text-xs"
                disabled={!replyText[c.id]?.trim()}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddComment(c.id, replyText[c.id]);
                  setReplyText((prev) => ({ ...prev, [c.id]: "" }));
                }}
              >
                Reply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
