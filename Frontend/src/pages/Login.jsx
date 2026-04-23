import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userRef = useRef(null);
  const passRef = useRef(null);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      return alert("Enter username and password");
    }

    try {
      await axios.post("https://noto-notes.onrender.com/login", {
        username,
        password
      });

      onSuccess();
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh] bg-blue-50 px-4">

      {/* CARD */}
      <div className="
        bg-white 
        w-full 
        max-w-[380px] 
        sm:max-w-[420px]
        p-6 sm:p-10 
        rounded-2xl 
        shadow-lg 
        overflow-hidden
      ">

        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-8 text-center">
          Admin Login
        </h2>

        {/* Username */}
        <input
          ref={userRef}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") passRef.current.focus();
          }}
          className="
            w-full 
            bg-white 
            border border-gray-200 
            p-3 sm:p-4 
            mb-5 
            rounded-xl 
            text-base sm:text-lg
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-400
          "
        />

        {/* Password */}
        <input
          ref={passRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          className="
            w-full 
            bg-white 
            border border-gray-200 
            p-3 sm:p-4 
            mb-6 
            rounded-xl 
            text-base sm:text-lg
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-400
          "
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          className="
            w-full 
            bg-blue-600 
            text-white 
            py-3 sm:py-4 
            rounded-xl 
            text-base sm:text-lg 
            font-semibold
            hover:bg-blue-700 
            transition 
            active:scale-95
          "
        >
          Login
        </button>

      </div>
    </div>
  );
}