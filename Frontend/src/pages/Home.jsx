import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState({});

  // 📥 load files + saved state
  useEffect(() => {
    axios.get("https://noto-notes.onrender.com/files")
      .then(res => setFiles(res.data))
      .catch(() => alert("Failed to load files"));

    const saved = localStorage.getItem("completedFiles");
    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  // 💾 toggle + save
  const toggleComplete = (id) => {
    const updated = {
      ...completed,
      [id]: !completed[id]
    };

    setCompleted(updated);
    localStorage.setItem("completedFiles", JSON.stringify(updated));
  };

  // 📥 download
  const handleDownload = async (url, title) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.pdf`;
      link.click();
    } catch {
      alert("Download failed");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const filteredFiles = files.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 pb-20">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-700">
          📚 Study Materials
        </h2>
        <p className="text-gray-500 text-sm">
          Browse and download your notes and Resources.
        </p>
      </div>

      {/* Search */}
     <div className="mb-6 relative w-full max-w-md">
  {/* Search Icon */}
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </span>

  <input
    type="text"
    placeholder="Search by title or subject..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

        {filteredFiles.map((file) => {
          const isChecked = !!completed[file.id];

          return (
            <div
              key={file.id}
              className="relative bg-white/80 backdrop-blur-md p-5 rounded-xl border shadow hover:scale-105 transition"
            >

              {/* ✅ CHECKBOX */}
              <button
                onClick={() => toggleComplete(file.id)}
                className={`absolute top-3 right-3 w-7 h-7 rounded-md border-2 flex items-center justify-center transition
                  ${isChecked
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-blue-600 text-blue-600"
                  }`}
              >
                {isChecked ? "✔" : "✔"}
              </button>

              {/* Title */}
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {file.title}
              </h3>

              {/* Subject */}
              <p className="text-sm text-blue-600 mb-2">
                {file.subject}
              </p>

              {/* Date */}
              <p className="text-[11px] text-black rounded px-2 py-1 border-blue-300 border bg-blue-100 w-fit ml-auto mb-3">
                {formatDate(file.uploadedAt)}
              </p>

              {/* Download */}
              <button
                onClick={() => handleDownload(file.url, file.title)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Download PDF
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}