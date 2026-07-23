import { Mark } from "@tiptap/core";

export const CommentMark = Mark.create({
  name: "comment",

  addAttributes() {
    return {
      commentId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-comment-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", { "data-comment-id": HTMLAttributes.commentId, class: "bg-yellow-200/60 rounded cursor-pointer hover:bg-yellow-300/60" }, 0];
  },
});
