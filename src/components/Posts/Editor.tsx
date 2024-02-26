/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { uploadImage } from "@/actions/uploadImage";
import "@blocknote/react/style.css";
import { cn } from "@/lib/utils";

interface EditorProps {
  onChange?: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { theme } = useTheme();

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      if (onChange) onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: uploadImageToStore,
    domAttributes: {
      // Adds a class to all `blockContainer` elements.
      blockContainer: {
        class: !editable ? "bg-background" : "",
      },
      editor: {
        class: !editable ? "bg-background" : "",
      },
    },
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={theme === "dark" ? "dark" : "light"}
        className={cn(
          "rounded-lg pt-4",
          editable
            ? "min-h-96 dark:border-0 border bg-[var(--bn-colors-editor-background)]"
            : "min-h-96"
        )}
      />
    </div>
  );
};

export default Editor;

const uploadImageToStore = async (file: File) => {
  const result = await uploadImage({ file });
  if (result.data) {
    return result.data;
  } else if (result.error) {
    toast.error(result.error);
  }
  return "";
};
