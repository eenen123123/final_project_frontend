import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton = ({
  onClick,
  isActive,
  title,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`
      px-2.5 py-1.5 rounded text-sm font-medium transition-colors
      ${
        isActive
          ? "bg-slate-800 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }
    `}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-slate-200 mx-1" />;

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "내용을 입력하세요...",
        // Placeholder 스타일은 globals.css 또는 index.css에 추가 필요 (아래 참고)
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] px-4 py-3 text-sm text-slate-800 leading-relaxed focus:outline-none prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded prose-code:text-sm prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:text-slate-500",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-slate-50">
        {/* 텍스트 스타일 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="굵게 (Ctrl+B)"
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="기울임 (Ctrl+I)"
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="밑줄 (Ctrl+U)"
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="취소선"
        >
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="인라인 코드"
        >
          {"</>"}
        </ToolbarButton>

        <Divider />

        {/* 헤딩 */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="제목 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="제목 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="제목 3"
        >
          H3
        </ToolbarButton>

        <Divider />

        {/* 리스트 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="글머리 기호 목록"
        >
          • 목록
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="번호 목록"
        >
          1. 목록
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="인용구"
        >
          "인용"
        </ToolbarButton>

        <Divider />

        {/* 정렬 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="왼쪽 정렬"
        >
          ≡←
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="가운데 정렬"
        >
          ≡
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="오른쪽 정렬"
        >
          ≡→
        </ToolbarButton>

        <Divider />

        {/* 실행취소 / 다시실행 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          title="실행취소 (Ctrl+Z)"
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          title="다시실행 (Ctrl+Y)"
        >
          ↪
        </ToolbarButton>
      </div>

      {/* 에디터 본체 */}
      <EditorContent editor={editor} />

      {/* 하단 글자수 표시 */}
      <div className="flex justify-end px-4 py-1.5 border-t border-slate-100 bg-slate-50">
        <span className="text-xs text-slate-400">
          {editor.storage.characterCount?.characters?.() ??
            editor.getText().length}
          자
        </span>
      </div>
    </div>
  );
}

/*
──────────────────────────────────────────────
  globals.css 또는 index.css에 아래 추가 필요
──────────────────────────────────────────────

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  @apply text-slate-400 float-left h-0 pointer-events-none;
}
*/
