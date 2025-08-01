import { useState } from "react";
import { motion } from "framer-motion";
import { LoginForm } from "./Login";
import { RegisterForm } from "./RegisterForm";
import { useNavigate } from "react-router-dom";

export const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative w-full max-w-4xl md:h-[500px] bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Forms Container */}
        <div className="relative flex-1 flex flex-col md:flex-row w-full h-full">
          
          {/* Register Form */}
          <motion.div
            className="w-full md:w-1/2 h-full flex items-center justify-center transition-all duration-1000"
            animate={{
              opacity: isLogin ? 0 : 1,
              zIndex: isLogin ? 0 : 10,
            }}
          >
            <RegisterForm setIsLogin={setIsLogin} />
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="w-full md:w-1/2 h-full flex items-center justify-center transition-all duration-1000"
            animate={{
              opacity: isLogin ? 1 : 0,
              zIndex: isLogin ? 10 : 0,
            }}
          >
            <LoginForm onSuccess={() => navigate("/dashboard")} />
          </motion.div>
        </div>

        {/* Sliding Panel — Only visible on desktop */}
        <motion.div
          className={`absolute hidden md:flex top-0 h-full w-1/2 text-white flex-col items-center justify-center text-center p-10 z-20 transition-all duration-700 ease-in-out ${
            isLogin
              ? "bg-gradient-to-br from-orange-400 to-pink-500 rounded-r-[130px] rounded-l-none"
              : "bg-gradient-to-br from-orange-400 to-pink-500 rounded-l-[130px] rounded-r-none"
          }`}
          animate={{ left: isLogin ? "0%" : "50%" }}
        >
          <h2 className="text-3xl font-bold mb-4">
            {isLogin ? "Welcome Back!" : "Hello, Welcome!"}
          </h2>
          <p className="mb-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            className="bg-white text-black font-semibold px-6 py-2 rounded-md shadow-md cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </motion.div>

        {/* Toggle Button for Mobile (only shown on small screens) */}
        <div className="md:hidden w-full flex justify-center py-4 bg-white shadow-inner">
          <button
            className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-md shadow-md"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register Instead" : "Login Instead"}
          </button>
        </div>
      </div>
    </div>
  );
};
