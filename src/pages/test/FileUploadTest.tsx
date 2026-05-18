import { type ChangeEvent, useState } from "react";

export default function FileUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    setFile(selectedFile ?? null);
    setUploadedUrl(null);
  };

  const handleUploadClick = async () => {
    if (!file) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);

      const res = await fetch("/api/storage/files", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setUploadedUrl(data.viewUrl);
      console.log("업로드 성공:", data);
    } catch (e) {
      console.error("업로드 실패:", e);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border p-4 rounded">
        <input
          type="file"
          accept="image/*,video/*,application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />

        {file && <p className="mt-3 text-sm">{file.name}</p>}

        <button
          type="button"
          onClick={handleUploadClick}
          disabled={!file || isUploading}
          className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isUploading ? "업로드 중..." : "업로드"}
        </button>

        {uploadedUrl && (
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-blue-600 underline"
          >
            업로드 파일 보기
          </a>
        )}
      </div>
    </div>
  );
}
