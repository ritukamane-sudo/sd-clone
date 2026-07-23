"use client";

import { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { CommentMark } from "./comment-extension";
import { CommentSidebar, type SidebarComment } from "./comment-sidebar";

let commentCounter = 0;
function nextCommentId() {
  commentCounter += 1;
  return `cmt-${Date.now()}-${commentCounter}`;
}

function EditorToolbar({ editor, onComment }: { editor: NonNullable<ReturnType<typeof useEditor>>; onComment: () => void }) {
  const tools = [
    { label: "Bold", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "Italic", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "Strike", action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
    { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { label: "Bullet", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "Ordered", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { label: "Quote", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { label: "Code", action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
      {tools.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={t.action}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            t.active ? "bg-[#1b91fb] text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {t.label}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={onComment}
          disabled={editor.state.selection.empty}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-[#1b91fb] hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Comment
        </button>
      </div>
    </div>
  );
}

export function ContractEditor({ content, onSave }: { content?: string; onSave?: (html: string) => void }) {
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false);
  const [comments, setComments] = useState<SidebarComment[]>([]);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: "Start drafting your contract here..." }),
      CommentMark,
    ],
    content: content || "<p></p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[500px] px-6 py-4",
      },
    },
  });

  const handleComment = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    if (!selectedText) return;

    const cid = nextCommentId();
    editor.chain().focus().setMark("comment", { commentId: cid }).run();

    const newComment: SidebarComment = {
      id: cid,
      highlightText: selectedText,
      author: "Rituka Mane",
      text: "",
      createdAt: new Date(),
      resolved: false,
      replies: [],
    };
    setComments((prev) => [...prev, newComment]);
    setActiveCommentId(cid);
    setCommentSidebarOpen(true);
  }, [editor]);

  const handleSave = useCallback(() => {
    if (editor && onSave) {
      onSave(editor.getHTML());
      toast.success("Contract saved");
    }
  }, [editor, onSave]);

  const handleAddComment = useCallback((parentId: string, text: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? { ...c, text: c.text || text, replies: [...c.replies, { author: "Rituka Mane", text, createdAt: new Date() }] }
          : c
      )
    );
  }, []);

  const handleResolveComment = useCallback((id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
  }, []);

  const handleSelectComment = useCallback(
    (id: string) => {
      setActiveCommentId(id);
      if (!editor) return;
      editor.state.doc.descendants((node, pos) => {
        if (node.marks) {
          const found = node.marks.find(
            (m) => m.type.name === "comment" && m.attrs.commentId === id
          );
          if (found) {
            const from = pos;
            const to = pos + node.nodeSize;
            editor.chain().focus().setTextSelection({ from, to }).run();
            return false;
          }
        }
      });
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <div className="flex rounded-lg border border-border bg-card">
      <div className="flex-1 flex flex-col min-w-0">
        <EditorToolbar editor={editor} onComment={handleComment} />
        <EditorContent editor={editor} />
        <div className="flex items-center justify-end gap-2 border-t border-border p-3">
          <Button variant="outline" size="sm" onClick={() => editor.commands.undo()}>Undo</Button>
          <Button variant="outline" size="sm" onClick={() => editor.commands.redo()}>Redo</Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCommentSidebarOpen(!commentSidebarOpen)}
            className={commentSidebarOpen ? "text-[#1b91fb]" : ""}
          >
            Comments ({comments.length})
          </Button>
          <Button size="sm" onClick={handleSave}>Save</Button>
        </div>
      </div>
      <CommentSidebar
        open={commentSidebarOpen}
        onClose={() => setCommentSidebarOpen(false)}
        comments={comments}
        onAddComment={handleAddComment}
        onResolveComment={handleResolveComment}
        activeId={activeCommentId}
        onSelectComment={handleSelectComment}
      />
    </div>
  );
}
