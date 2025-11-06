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
    }, 4000);
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
      const res = await axios.post("http://localhost:4000/login", form);
      const { success, user, token, message } = res.data;

      if (success && user) {
        // ✅ Save full user info & token
        localStorage.setItem("token", token || "dummy-token");
        localStorage.setItem("user", JSON.stringify(user));

        toast.success(`Welcome ${user.username}! 👋`);

        // ✅ Redirect based on role
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/adminpanel");
          } else if (user.role === "department") {
            navigate("/departmentpanel");
          } else {
            navigate("/GeneralDetail");
          }
        }, 1000);
      } else {
        toast.error(message || "❌ Invalid username or password");
      }
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

        <div className="text-center mt-3">
          <Link
            to="/forgotpassword"
            className="text-decoration-none fw-semibold"
            style={{ color: "#0d6efd" }}
          >
            Forgot Password?
          </Link>
        </div>
      </motion.div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Login;
