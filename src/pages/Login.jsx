import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🧠 Eye tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 25;
      const y = (e.clientY / window.innerHeight - 0.5) * 25;
      setEyePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 😴 Blink every few seconds
  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 250);
    }, 5000);
    return () => clearInterval(blinkTimer);
  }, []);

  // 🔐 Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.warning("⚠️ Please fill username and password");
      return;
    }

    try {
      // 🌐 Backend login API
      const res = await axios.post("https://service-book-backend.onrender.com/login", form);
      const user = res.data.user;

      // ✅ Store in localStorage
      if (res.data.success) {
        const user = res.data.user;

        // 🔐 Save user info in localStorage
        localStorage.setItem("staffId", user.staffId);
        localStorage.setItem("username", user.username);
        localStorage.setItem("gmail", user.gmail);
        localStorage.setItem("role", user.role);

        toast.success("Login successful ✅");
        navigate("/GeneralDetail"); // go to general details page
      }


      toast.success(`Welcome ${user.username}! 👋`);

      // ⏳ Redirect with delay
      setTimeout(() => {
        if (user.role === "admin") navigate("/adminpanel");
        else if (user.role === "department") navigate("/departmentpanel");
        else navigate("/GeneralDetail");
      }, 1000);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message || "❌ Invalid username or password"
      );
    }
  };

  return (
    <div className="mimo-login-container d-flex align-items-center justify-content-center">
      <motion.div
        className="login-card glass p-4 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 🤖 Mimo Robot */}
        <div className="mimo text-center mb-4">
          <div
            className={`mimo-head ${isPasswordFocus ? "mimo-active" : ""
              } ${isBlinking ? "mimo-blink" : ""}`}
          >
            <div
              className="mimo-eye"
              style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}
            ></div>
            <div
              className="mimo-eye"
              style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }}
            ></div>
          </div>
          <div className="mimo-body"></div>
        </div>

        {/* 🔐 Login Form */}
        <h4 className="text-center mb-3 fw-bold text-dark">
          Service Book Login
        </h4>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <div className="position-relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control pe-5"
              placeholder="Password"
              onFocus={() => setIsPasswordFocus(true)}
              onBlur={() => setIsPasswordFocus(false)}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="btn btn-primary rounded-5 w-100 fw-semibold animated-login-btn">
            Login
          </button>
        </form>

        {/* 🔁 Forgot Password */}
        <div className="text-center mt-3">
          <Link to="/forgotpassword" className="text-decoration-none fw-semibold" style={{ color: "#0d6efd" }}>
            Forgot Password?
          </Link>
        </div>
      </motion.div>

      {/* Toast Notification Container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Login;
