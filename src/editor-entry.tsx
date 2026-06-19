import { createRoot } from "react-dom/client";
import type { JSONContent } from "@tiptap/react";
import TipTapEditor from "./components/TipTapEditor/TipTapEditor";
import { setApiAccessToken } from "./api/api";

interface MountOptions {
  editable?: boolean;
  initialContent?: JSONContent | string | null;
  outputInputId?: string;
  accessToken?: string;
  ctxType?: string;
  ctxId?: string;
  imageUrlResolver?: (fileId: number) => string;
}

function mount(containerId: string, options: MountOptions = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`TipTapEditor: #${containerId} not found`);
    return;
  }

  if (options.accessToken) {
    setApiAccessToken(options.accessToken);
  }

  let initialContent: JSONContent | undefined;
  if (typeof options.initialContent === "string" && options.initialContent) {
    try {
      initialContent = JSON.parse(options.initialContent);
    } catch {
      initialContent = undefined;
    }
  } else if (options.initialContent && typeof options.initialContent === "object") {
    initialContent = options.initialContent;
  }

  const root = createRoot(container);
  root.render(
    <TipTapEditor
      editable={options.editable ?? true}
      initialContent={initialContent}
      ctxType={options.ctxType}
      ctxId={options.ctxId}
      imageUrlResolver={options.imageUrlResolver}
      onChange={(content) => {
        if (options.outputInputId) {
          const input = document.getElementById(options.outputInputId) as HTMLInputElement | null;
          if (input) input.value = JSON.stringify(content);
        }
      }}
    />
  );
}

(window as any).TipTapEditor = { mount };
