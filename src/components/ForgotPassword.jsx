import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ NEW

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const navigate = useNavigate(); // ✅ Initialize navigation

  // 1️⃣ SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.warning("⚠️ Please enter your Gmail");

    try {
      setLoading(true);
      await axios.post("https://service-book-backend.onrender.com/forgot-password", { gmail: email });
      toast.success("📧 OTP sent to your Gmail!");
      setShowOtpModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.warning("⚠️ Please enter OTP");

    try {
      setLoading(true);
      await axios.post("https://service-book-backend.onrender.com/verify-otp", { gmail: email, otp });
      toast.success("✅ OTP Verified Successfully!");
      setShowOtpModal(false);
      setShowResetModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirm) return toast.warning("⚠️ Please fill all fields");
    if (newPassword !== confirm) return toast.error("❌ Passwords do not match");

    try {
      setLoading(true);
      await axios.post("https://service-book-backend.onrender.com/reset-password", {
        gmail: email,
        otp,
        newPassword,
      });
      toast.success("✅ Password Reset Successfully! Redirecting to login...");

      // 🔁 Delay for smooth UX, then redirect
      setTimeout(() => {
        setShowResetModal(false);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirm("");
        navigate("/login"); // ✅ Redirect to Login
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🌈 Main Page */}
      <div
        className="forgot-container d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a97e9 0%, #81D4FA 40%, #4FC3F7 100%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Floating Circles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="position-absolute w-100 h-100"
        >
          <div
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              background: "rgba(255,255,255,0.4)",
              borderRadius: "50%",
              top: "10%",
              left: "10%",
              filter: "blur(60px)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              background: "rgba(255,255,255,0.3)",
              borderRadius: "50%",
              bottom: "15%",
              right: "10%",
              filter: "blur(80px)",
            }}
          ></div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="p-4 p-md-5 rounded-4 shadow-lg bg-white position-relative"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: "400px",
            width: "90%",
            zIndex: 2,
          }}
        >
          <div className="text-center mb-3">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
                alt="Lock"
                style={{ width: "70px", marginBottom: "10px" }}
              />
            </motion.div>
            <h4 className="fw-bold text-dark mb-1">Forgot Password</h4>
            <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
              Enter your Gmail ID to receive an OTP.
            </p>
          </div>

          <form onSubmit={handleSendOtp}>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              className="form-control mb-3 rounded-3 shadow-sm"
              placeholder="Enter your Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "10px 15px", fontSize: "1rem" }}
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="btn btn-primary w-100 fw-semibold rounded-5"
              style={{ padding: "10px 0", fontSize: "1rem" }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </motion.button>
          </form>

          <div className="text-center mt-3">
            <a
              href="/login"
              className="text-decoration-none"
              style={{ color: "#0d6efd", fontWeight: 600, fontSize: "0.9rem" }}
            >
              ← Back to Login
            </a>
          </div>
        </motion.div>
      </div>

      {/* 🔹 OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            className="modal-backdrop d-flex justify-content-center align-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: "rgba(0,0,0,0.6)",
              position: "fixed",
              inset: 0,
              zIndex: 1050,
            }}
          >
            <motion.div
              className="bg-white rounded-4 p-4 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: "90%", maxWidth: "380px" }}
            >
              <h5 className="fw-bold text-center mb-3">Enter OTP</h5>
              <Form onSubmit={handleVerifyOtp}>
                <Form.Control
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="text-center mb-3"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" className="w-100 rounded-5 fw-semibold">
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  variant="link"
                  className="w-100 mt-2 text-decoration-none"
                  onClick={() => setShowOtpModal(false)}
                >
                  Cancel
                </Button>
              </Form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Reset Password Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            className="modal-backdrop d-flex justify-content-center align-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: "rgba(0,0,0,0.6)",
              position: "fixed",
              inset: 0,
              zIndex: 1050,
            }}
          >
            <motion.div
              className="bg-white rounded-4 p-4 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: "90%", maxWidth: "380px" }}
            >
              <h5 className="fw-bold text-center mb-3">Reset Password</h5>
              <Form onSubmit={handleResetPassword}>
                <Form.Control
                  type="password"
                  placeholder="New Password"
                  className="mb-3"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  className="mb-3"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <Button type="submit" variant="success" className="w-100 rounded-5 fw-semibold">
                  {loading ? "Saving..." : "Reset Password"}
                </Button>
                <Button
                  variant="link"
                  className="w-100 mt-2 text-decoration-none"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </Button>
              </Form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={1000} />
    </>
  );
};

export default ForgotPassword;
