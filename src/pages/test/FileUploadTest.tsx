import { useState } from "react";

export default function FileUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
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
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border p-4 rounded">
        <input
          type="file"
          accept="image/*,video/*,application/pdf"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />

        {file && <p className="mt-3 text-sm">{file.name}</p>}

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
