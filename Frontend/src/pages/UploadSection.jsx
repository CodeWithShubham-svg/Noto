import { useState } from "react";
import axios from "axios";

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const upload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("subject", subject);

    await axios.post("https://noto-notes.onrender.com/upload", formData);

    alert("Uploaded successfully");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-md">
      
      <input
        placeholder="Title"
        className="w-full border p-2 mb-3 rounded"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Subject"
        className="w-full border p-2 mb-3 rounded"
        onChange={(e) => setSubject(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={upload}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Upload
      </button>
    </div>
  );
}