/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { uploadImage } from "@/actions/uploadImage";
import "@blocknote/react/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { theme } = useTheme();

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: uploadImageToStore,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={theme === "dark" ? "dark" : "light"}
        className='min-h-96 bg-[var(--bn-colors-editor-background)] rounded-lg pt-4 dark:border-0 border'
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
