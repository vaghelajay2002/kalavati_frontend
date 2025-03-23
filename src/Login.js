import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "kalavati" && password === "kalavati@123") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/"); 
    } else {
      alert("Invalid credentials! Try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-opacity-30"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(0,0,255,0.3), rgba(255,0,255,0.3))",
            "linear-gradient(45deg, rgba(255,0,255,0.3), rgba(0,0,255,0.3))"
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Login Form Container */}
      <motion.div
        className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg shadow-lg p-8 rounded-xl w-96 text-center border border-white border-opacity-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">🔐 Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-white bg-opacity-20 text-white placeholder-white border border-white border-opacity-30 rounded-lg focus:ring focus:ring-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white bg-opacity-20 text-white placeholder-white border border-white border-opacity-30 rounded-lg focus:ring focus:ring-white"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
