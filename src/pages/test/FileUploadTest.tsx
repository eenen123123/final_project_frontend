import { type ChangeEvent, useState } from "react";
import api from "../../api/api";

// 파일 업로드 요청 보낼때 필요한 데이터 구조
interface FileUploadBody {
  file: File;
  ctxType: string;
  ctxId: string;
}

// 파일 URL 응답 데이터 구조
interface FileUrlResponse {
  viewUrl: string;
  downloadUrl: string;
}

export default function FileUploadTest() {
  const [isUploading, setIsUploading] = useState(false);
  const [fileServerId, setFileServerId] = useState<number>(147);
  const [fileUploadBody, setFileUploadBody] = useState<FileUploadBody>({
    file: new File([""], ""),
    ctxType: "MEMBER_ROLE",
    ctxId: "ROLE_USER",
  });

  const [fileUrl, setFileUrl] = useState<FileUrlResponse | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUploadBody((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };

  // 파일 업로드
  const uploadFile = async () => {
    if (!fileUploadBody.file) return;

    if (
      !fileUploadBody.file.type.startsWith("image/") &&
      !fileUploadBody.file.type.startsWith("application/pdf")
    ) {
      alert("이미지 또는 PDF 파일만 업로드할 수 있습니다.");
      return;
    }

    if (fileUploadBody.file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB를 초과할 수 없습니다.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", fileUploadBody.file);
      formData.append("ctxType", fileUploadBody.ctxType);
      formData.append("ctxId", fileUploadBody.ctxId);
      const res = await api.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedFileId = res.data;
      setFileServerId(uploadedFileId);
      console.log("파일 업로드 성공:", uploadedFileId);
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 파일의 접근 URL 얻기
  const getFileUrl = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!fileServerId) return;
    try {
      const res = await api.post(`/api/files/${fileServerId}/token`);
      setFileUrl(res.data);
      console.log("파일 접근 URL:", res.data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("403")) {
          alert("파일 접근 권한이 없습니다.");
        } else {
          alert(`파일 접근 URL 가져오기 실패: ${error.message}`);
        }
      } else {
        alert("파일 접근 URL 가져오기 실패");
      }
      console.error("파일 접근 URL 가져오기 실패:", error);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className="border p-4 rounded">
        <form action="" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="fileInput">파일 선택</label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="ctxTypeInput">Context Type</label>
            <input
              id="ctxTypeInput"
              type="text"
              value={fileUploadBody.ctxType}
              onChange={(e) =>
                setFileUploadBody((prev) => ({
                  ...prev,
                  ctxType: e.target.value,
                }))
              }
              placeholder="Context Type"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="ctxIdInput">Context ID</label>
            <input
              id="ctxIdInput"
              type="text"
              value={fileUploadBody.ctxId}
              onChange={(e) =>
                setFileUploadBody((prev) => ({
                  ...prev,
                  ctxId: e.target.value,
                }))
              }
              placeholder="Context ID"
              className="border p-2 rounded"
            />
          </div>
          <button
            type="button"
            onClick={uploadFile}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Upload File
          </button>
        </form>
        <div className="mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="fileServerIdInput">File Server ID</label>
            <input
              id="fileServerIdInput"
              type="number"
              value={fileServerId}
              onChange={(e) => setFileServerId(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>

          <button
            type="button"
            onClick={getFileUrl}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4"
          >
            파일 접근 주소 얻기
          </button>
          {fileUrl && (
            <div>
              <p>View URL: {fileUrl.viewUrl}</p>
              <p>Download URL: {fileUrl.downloadUrl}</p>
              <a
                href={fileUrl.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Open File
              </a>
            </div>
          )}
        </div>
      </div>
      {isUploading && <p className="text-blue-500 mt-4">Uploading...</p>}
    </div>
  );
}
