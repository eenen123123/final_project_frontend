import type { JSONContent } from "@tiptap/core";
import api from "./api";

export interface FileTokenResponse {
  viewUrl: string;
}

export async function uploadFile(
  file: File,
  ctxType: string,
  ctxId: string,
): Promise<number> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("ctxType", ctxType);
  formData.append("ctxId", ctxId);
  const res = await api.post<number>("/api/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getFileToken(
  fileServerId: number,
): Promise<FileTokenResponse> {
  const res = await api.post<FileTokenResponse>(
    `/api/files/${fileServerId}/token`,
  );
  return res.data;
}

export async function getFilesToken(
  fileServerIds: number[],
): Promise<Record<number, string>> {
  const res = await api.post<Record<number, string>>(
    `/api/files/tokens`,
    { ids: fileServerIds },
  );
  return res.data;
}

// TipTap JSON에서 fileId 목록 추출 (게시글 저장 시 백엔드 검증용)
export function extractFileIds(content: JSONContent): number[] {
  const ids: number[] = [];
  const traverse = (node: JSONContent) => {
    if (node.type === "image" && node.attrs?.fileId != null) {
      ids.push(Number(node.attrs.fileId));
    }
    node.content?.forEach(traverse);
  };
  traverse(content);
  return ids;
}

// 제출 직전 blob URL 제거 (에디터 내부 상태는 건드리지 않음)
export function stripBlobUrls(node: JSONContent): JSONContent {
  if (node.type === "image" && node.attrs?.src?.startsWith("blob:")) {
    return { ...node, attrs: { ...node.attrs, src: null } };
  }
  if (node.content) {
    return { ...node, content: node.content.map(stripBlobUrls) };
  }
  return node;
}
