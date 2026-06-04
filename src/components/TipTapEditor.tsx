import {
  type ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/core";
import {
  Node,
  mergeAttributes,
  type Editor,
  type JSONContent,
} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  extractFileIds,
  getFileToken,
  getFilesToken,
  uploadFile,
} from "../api/fileApi";

const ImageTokenContext = createContext<Record<number, string> | null>(null);

// --- Types ---

type UploadStatus = "idle" | "uploading" | "done" | "error";

interface ImageNodeAttrs {
  src: string | null;
  fileId: number | null;
  alt: string | null;
  uploadStatus: UploadStatus;
}

export interface TipTapEditorProps {
  initialContent?: JSONContent;
  onChange?: (content: JSONContent, hasPendingUploads: boolean) => void;
  editable?: boolean;
  ctxType?: string;
  ctxId?: string;
  maxImages?: number;
  placeholder?: string;
  editorMaxHeight?: string;
}

// --- ImageNodeView ---

const ImageNodeView = ({ node }: NodeViewProps) => {
  const { src, fileId, uploadStatus, alt } = node.attrs as ImageNodeAttrs;
  const tokenMap = useContext(ImageTokenContext);

  const [fetchedSrc, setFetchedSrc] = useState<string | null>(null);

  const displaySrc = src?.startsWith("blob:")
    ? src
    : tokenMap !== null
      ? (tokenMap[fileId ?? -1] ?? fetchedSrc)
      : fetchedSrc;

  useEffect(() => {
    if (fileId == null || src?.startsWith("blob:")) return;
    if (tokenMap === null) return; // null은 배치 fetch 진행 중을 의미
    if (tokenMap[fileId]) return;

    getFileToken(fileId)
      .then(({ viewUrl }) => setFetchedSrc(viewUrl))
      .catch(() => {});
  }, [fileId, src, tokenMap]);

  if (uploadStatus === "error") {
    return (
      <NodeViewWrapper>
        <div className="my-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500">
          이미지 업로드에 실패했습니다.
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div className="relative my-2">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={alt ?? ""}
            className="max-w-full rounded"
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded bg-slate-100 text-sm text-slate-400">
            이미지 로딩 중...
          </div>
        )}
        {uploadStatus === "uploading" && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-white/60">
            <span className="text-sm text-slate-600">업로드 중...</span>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// --- Custom Image Node ---

const ImageNode = Node.create({
  name: "image",
  group: "block",
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      fileId: { default: null },
      alt: { default: null },
      uploadStatus: { default: "idle" as UploadStatus },
    };
  },

  parseHTML() {
    return [{ tag: "img[data-file-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

// --- Helpers ---

function countImageNodes(editor: Editor): number {
  let count = 0;
  editor.state.doc.descendants((node) => {
    if (node.type.name === "image") count++;
  });
  return count;
}

function updateImageNodeInEditor(
  editor: Editor,
  srcToFind: string,
  newAttrs: Partial<ImageNodeAttrs>,
) {
  const { state, dispatch } = editor.view;
  const { tr, doc } = state;
  let found = false;
  doc.descendants((node, pos) => {
    if (node.type.name === "image" && node.attrs.src === srcToFind && !found) {
      found = true;
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...newAttrs });
    }
  });
  if (found) dispatch(tr);
}

// --- Toolbar Components ---

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
      px-2.5 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer
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

// --- TipTapEditor ---

export default function TipTapEditor({
  initialContent,
  onChange,
  editable = true,
  ctxType = "POST",
  ctxId = "0",
  maxImages = 5,
  placeholder = "내용을 입력하세요...",
  editorMaxHeight = "480px",
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadsRef = useRef<Set<string>>(new Set());
  const [uploadingCount, setUploadingCount] = useState(0);
  const [imageTokens, setImageTokens] = useState<Record<number, string> | null>(
    () => {
      const fileIds = initialContent ? extractFileIds(initialContent) : [];
      return fileIds.length === 0 ? {} : null;
    },
  );

  useEffect(() => {
    const fileIds = initialContent ? extractFileIds(initialContent) : [];
    if (fileIds.length === 0) return;
    getFilesToken(fileIds)
      .then(setImageTokens)
      .catch(() => setImageTokens({}));
    // initialContent는 마운트 시 한 번만 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editor = useEditor({
    editable,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      ImageNode,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON(), pendingUploadsRef.current.size > 0);
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] px-4 py-3 text-sm text-slate-800 leading-relaxed focus:outline-none prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded prose-code:text-sm prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:text-slate-500",
      },
    },
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB를 초과할 수 없습니다.");
      return;
    }
    if (countImageNodes(editor) >= maxImages) {
      alert(`이미지는 최대 ${maxImages}장까지 업로드할 수 있습니다.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: {
          src: objectUrl,
          uploadStatus: "uploading",
          fileId: null,
          alt: file.name,
        },
      })

      .run();
    editor.commands.scrollIntoView();
    pendingUploadsRef.current.add(objectUrl);
    setUploadingCount((c) => c + 1);

    try {
      const fileId = await uploadFile(file, ctxType, ctxId);
      pendingUploadsRef.current.delete(objectUrl);
      setUploadingCount((c) => c - 1);
      updateImageNodeInEditor(editor, objectUrl, {
        fileId,
        uploadStatus: "done",
      });
    } catch {
      pendingUploadsRef.current.delete(objectUrl);
      setUploadingCount((c) => c - 1);
      updateImageNodeInEditor(editor, objectUrl, { uploadStatus: "error" });
    }
  };

  if (!editor) return null;

  return (
    <ImageTokenContext.Provider value={imageTokens}>
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {editable && (
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

            <Divider />

            {/* 정렬 */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="왼쪽 정렬"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              title="가운데 정렬"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="오른쪽 정렬"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
                />
              </svg>
            </ToolbarButton>

            <Divider />

            {/* 실행취소 / 다시실행 */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              isActive={false}
              title="실행취소 (Ctrl+Z)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              isActive={false}
              title="다시실행 (Ctrl+Y)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                />
              </svg>
            </ToolbarButton>

            <Divider />

            {/* 이미지 업로드 */}
            <ToolbarButton
              onClick={() => fileInputRef.current?.click()}
              isActive={false}
              title="이미지 업로드"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </ToolbarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        )}

        <EditorContent
          editor={editor}
          className={`max-h-[${editorMaxHeight}] overflow-y-auto`}
        />

        {editable && (
          <div className="flex justify-between px-4 py-1.5 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-amber-500">
              {uploadingCount > 0 && `이미지 업로드 중 ${uploadingCount}개...`}
            </span>
            <span className="text-xs text-slate-400">
              {editor.getText().length}자
            </span>
          </div>
        )}
      </div>
    </ImageTokenContext.Provider>
  );
}
