import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true); // ⭐ NEW

  // 📥 load files + saved state
  useEffect(() => {
    setLoading(true);

    axios.get("https://noto-notes.onrender.com/files")
      .then(res => {
        setFiles(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load files");
        setLoading(false);
      });

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

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-700">
          📚 Study Materials
        </h2>
        <p className="text-gray-500 text-sm">
          Browse and download your notes and Resources.
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-6 relative w-full max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 🔥 SKELETON LOADER */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-5 rounded-xl shadow border"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (

        /* REAL CARDS */
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {filteredFiles.map((file) => {
            const isChecked = !!completed[file.id];

            return (
              <div
                key={file.id}
                className="relative bg-white/80 backdrop-blur-md p-5 rounded-xl border shadow hover:scale-105 transition"
              >

                {/* CHECKBOX */}
                <button
                  onClick={() => toggleComplete(file.id)}
                  className={`absolute top-3 right-3 w-7 h-7 rounded-md border-2 flex items-center justify-center transition
                    ${isChecked
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-blue-600 text-blue-600"
                    }`}
                >
                  ✔
                </button>

                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {file.title}
                </h3>

                <p className="text-sm text-blue-600 mb-2">
                  {file.subject}
                </p>

                <p className="text-[11px] text-black rounded px-2 py-1 border bg-blue-100 w-fit ml-auto mb-3">
                  {formatDate(file.uploadedAt)}
                </p>

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
      )}

    </div>
  );
}