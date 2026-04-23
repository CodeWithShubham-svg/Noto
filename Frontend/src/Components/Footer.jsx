import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-1.5 flex justify-between items-center">
      
      {/* Copyright on the left */}
      <span className="text-[10px] text-gray-500 font-medium">
        &copy; {new Date().getFullYear()} Noto Notes. All Rights Reserved | STGPIAN @LAKHAN
      </span>

      {/* Admin/Home Toggle on the right */}
      {isAdminPage ? (
        <Link
          to="/"
          className="rounded border border-gray-300 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-600 px-2 py-1 transition hover:bg-gray-100"
        >
          Home
        </Link>
      ) : (
        <Link
          to="/admin"
          className="rounded border border-gray-300 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-600 px-2 py-1 transition hover:bg-gray-100"
        >
          Admin
        </Link>
      )}

    </footer>
  );
}
