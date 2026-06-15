"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

const Tiptap = ({ val }: { val: string }) => {
  const { setValue } = useFormContext();

  const editor = useEditor({
    extensions: [
        Placeholder.configure({
            placeholder: 'Add a longer description for your products',
          }),
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    editorProps: {
      attributes: {
        class:
          " min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      },
    },
    content: val,
  });

  useEffect(() => {
    if (editor?.isEmpty) editor.commands.setContent(val)
  }, [val])

  
  return (
    <div className="flex flex-col gap-2">
      <div className="border-input border  rounded-md">
        <Toggle
          size={"sm"}
          pressed={editor?.isActive("bold")}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Toggle>
        <Toggle
          size={"sm"}
          pressed={editor?.isActive("italic")}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Toggle>
        <Toggle
          size={"sm"}
          pressed={editor?.isActive("strike")}
          onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-4 h-4" />
        </Toggle>
        <Toggle
          size={"sm"}
          pressed={editor?.isActive("orderedList")}
          onPressedChange={() =>
            editor?.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="w-4 h-4" />
        </Toggle>
        <Toggle
          size={"sm"}
          pressed={editor?.isActive("bulletList")}
          onPressedChange={() =>
            editor?.chain().focus().toggleBulletList().run()
          }
        >
          <List className="w-4 h-4" />
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
