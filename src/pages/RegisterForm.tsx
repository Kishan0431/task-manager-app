import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { register } from "../features/auth/authSlice";

export const RegisterForm = ({
  setIsLogin,
}: {
  setIsLogin: (val: boolean) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register({ username, email, password })).unwrap();
      alert("Registration successful!");
      setIsLogin(true); // Switch to login form
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Registration failed:", err.message);
      } else {
        console.error("Registration failed:", err);
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-3/4 max-w-sm">
      <h3 className="text-4xl font-bold mb-4 text-center text-black">
        Register
      </h3>

      <div className="mb-4 relative">
        <FaUser className="absolute top-3 left-3 text-orange-500" />
        <input
          type="text"
          autoComplete="username"
          placeholder="Username"
          className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="mb-4 relative">
        <FaEnvelope className="absolute top-3 left-3 text-orange-500" />
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-6 relative">
        <FaLock className="absolute top-3 left-3 text-orange-500" />
        <input
          type={showPassword ? "text" : "password"} // 👁️ Toggle logic
          autoComplete="new-password"
          placeholder="Password"
          className="w-full pl-10 pr-10 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-3 right-3 text-gray-600 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition cursor-pointer"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};
