import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      
      {/* ✅ Toast should be outside fragment, directly inside router */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="light"
        style={{ fontFamily: "Outfit, sans-serif" }}
      />

      {/* Top Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Footer */}
      <Footer />

    </BrowserRouter>
  );
}