import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Login from "./Login";
import { toast } from "react-toastify";

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const titleRef = useRef();
  const subjectRef = useRef();
  const fileRef = useRef();
  const uploadBtnRef = useRef();

  // 📅 FORMAT DATE
  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";

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

  // FETCH FILES
  const fetchFiles = () => {
    axios
      .get("https://noto-notes.onrender.com/files")
      .then((res) => setFiles(res.data))
      .catch(() => toast.error("Failed to fetch files"));
  };

  useEffect(() => {
    if (isAuth) fetchFiles();
  }, [isAuth]);

  // UPLOAD FILE
  const upload = async () => {
    if (!file) return toast.warn("Select a file");

    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("subject", subject);

      await axios.post("https://noto-notes.onrender.com/upload", formData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setUploading(false);
      setFile(null);
      setTitle("");
      setSubject("");

      // RESET FILE INPUT
      if (fileRef.current) fileRef.current.value = "";

      toast.success("File uploaded successfully 🎉");
      fetchFiles();
    } catch {
      setUploading(false);
      toast.error("Upload failed");
    }
  };

  // DELETE FILE
  const deleteFile = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this file?");
    if (!ok) return toast.info("Delete cancelled");

    await axios.delete(`https://noto-notes.onrender.com/file/${id}`);
    toast.success("File deleted successfully");
    fetchFiles();
  };

  // ENTER NAVIGATION
  const handleTitleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      subjectRef.current.focus();
    }
  };

  const handleSubjectEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fileRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    setTimeout(() => {
      uploadBtnRef.current.focus();
    }, 100);
  };

  const handleFileEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      uploadBtnRef.current.click();
    }
  };

  if (!isAuth) return <Login onSuccess={() => setIsAuth(true)} />;

  const filtered = files.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center p-3 sm:p-6">
      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin Panel
            </h2>
            <p className="text-sm text-gray-500">Teacher's Dashboard</p>
          </div>

         <div className="mb-6 relative w-full max-w-md"> <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" > <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg> </span> <input type="text" placeholder="Search by title or subject..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" /> </div> </div>

        {/* UPLOAD SECTION */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">

            <input
              ref={titleRef}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleEnter}
              className="border p-3 rounded-lg w-full"
            />

            <input
              ref={subjectRef}
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={handleSubjectEnter}
              className="border p-3 rounded-lg w-full"
            />

            <input
              ref={fileRef}
              type="file"
              onChange={handleFileChange}
              onKeyDown={handleFileEnter}
              className="border p-2 rounded-lg w-full"
            />

            <button
              ref={uploadBtnRef}
              onClick={upload}
              disabled={uploading}
              className="bg-blue-600 text-white font-semibold py-3 rounded-lg w-full hover:bg-blue-700"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

          </div>

          {/* PROGRESS */}
          {uploading && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs mt-1">{progress}%</p>
            </div>
          )}
        </div>



        {/* FILE LIST */}

        <h1 className="text-[25px] font-bold mb-3 pt-4 ml-1">Recents Uploads</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">

          {filtered.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              No files found
            </p>
          )}

          {filtered.map((f) => (
            <div key={f.id} className="bg-white p-4 rounded-xl shadow relative">

              {/* TIMESTAMP */}
              <p className="absolute top-3 right-3 text-[10px] text-gray-500 bg-blue-50 px-2 py-1 rounded border">
                {formatDate(f.uploadedAt)}
              </p>

              <h3 className="font-semibold text-gray-800 pr-20">
                {f.title}
              </h3>

              <p className="text-xs text-blue-600 mb-2 pr-20">
                {f.subject}
              </p>

              <button
                onClick={() => deleteFile(f.id)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
