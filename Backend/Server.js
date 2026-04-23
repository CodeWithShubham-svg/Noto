import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import cloudinary from "./cloudinary.js";

const app = express();

// 🔐 ==============================
// 👉 ADD USERNAME & PASSWORD HERE
// 🔐 ==============================
const ADMIN_USER = "@Master";
const ADMIN_PASS = "@402";
// 🔐 ==============================

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });


// ==============================
// 🔐 LOGIN ROUTE
// ==============================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: "Invalid credentials" });
});


// ==============================
// 📥 GET ALL FILES
// ==============================
app.get("/files", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data.json"));
  res.json(data);
});


// ==============================
// 📤 UPLOAD PDF
// ==============================
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, subject } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "pdfs",
    });

    const newFile = {
      id: Date.now(),
      title,
      subject,
      url: result.secure_url,
      uploadedAt: new Date().toLocaleString(),
    };

    const data = JSON.parse(fs.readFileSync("./data.json"));
    data.unshift(newFile);

    fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// ❌ DELETE FILE
// ==============================
app.delete("/file/:id", (req, res) => {
  const id = Number(req.params.id);

  let data = JSON.parse(fs.readFileSync("./data.json"));
  data = data.filter((f) => f.id !== id);

  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

  res.json({ success: true });
});


// ==============================
// 🚀 START SERVER
// ==============================
app.listen(5000, () => {
  console.log("Server running on https://noto-notes.onrender.com");
});
