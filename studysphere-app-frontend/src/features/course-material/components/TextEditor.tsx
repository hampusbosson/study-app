import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import { Editor } from "@tiptap/react";
import { useEffect } from "react";
import icons from "@/assets/icons/icons";
import React from "react";

/*
import {
  FaBold,
  FaHeading,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
} from "react-icons/fa";

*/

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center justify-center border-b border-border bg-slate-50 px-4 py-4">
      <div className="flex flex-row flex-wrap gap-3">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded-lg p-2 transition ${
            editor.isActive("heading", { level: 1 })
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.h1Icon(editor.isActive("heading", { level: 1 }))}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded-lg p-2 transition ${
            editor.isActive("heading", { level: 2 })
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.h2Icon(editor.isActive("heading", { level: 2 }))}
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded-lg p-2 transition ${
            editor.isActive("heading", { level: 3 })
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.h3Icon(editor.isActive("heading", { level: 3 }))}
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive("paragraph")
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.textIcon(editor.isActive("paragraph"))}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive("bold")
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.boldIcon(editor.isActive("bold"))}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive("italic")
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.italicIcon(editor.isActive("italic"))}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive("strike")
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.strikeIcon(editor.isActive("strike"))}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive("highlight")
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.highlightIcon(editor.isActive("highlight"))}
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive({ textAlign: "left" })
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.alignLeftIcon(editor.isActive({ textAlign: "left" }))}
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive({ textAlign: "center" })
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.alignCenterIcon(editor.isActive({ textAlign: "center" }))}
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive({ textAlign: "right" })
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.alignRightIcon(editor.isActive({ textAlign: "right" }))}
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive({ textAlign: "justify" })
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.alignJustifyIcon(
            editor.isActive({ textAlign: "justify" })
          )}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive("bulletList")
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          {icons.bulletListIcon(editor.isActive("bulletList"))}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-lg p-2 transition ${
            editor.isActive("orderedList")
              ? "is-active"
              : "text-slate-700 hover:bg-slate-200"
          }`}
          >
           {icons.orderedListIcon(editor.isActive("orderedList"))}
        </button>
      </div>
    </div>
  );
};

interface TipTapProps {
  content: string;
}

export const Tiptap: React.FC<TipTapProps> = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      BulletList,
      ListItem,
      Document,
      Paragraph,
      Text,
    ],
    content: content,
  });

  // useEffect to update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className="textEditor overflow-auto rounded-lg border border-border bg-white shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="px-6 py-6" />
    </div>
  );
};
