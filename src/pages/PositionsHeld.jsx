import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { Edit, Delete, Save, Add, ArrowBack, ArrowForward } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PositionsHeld() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    position: "",
    academicYear: "",
    period: "",
    startDate: "",
    endDate: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🟢 Fetch positions
  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const res = await axios.get(`https://service-book-backend.onrender.com/api/positions/${gmail}`);
      if (res.data.success) setPositions(res.data.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  // 🟢 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Add / Update
  const handleSave = async () => {
    try {
      if (!formData.position) return alert("Please enter the position title");
      setLoading(true);

      if (editId) {
        await axios.put(`https://service-book-backend.onrender.com/api/positions/${editId}`, {
          ...formData,
          gmail,
        });
        alert("✅ Position updated successfully!");
      } else {
        await axios.post("https://service-book-backend.onrender.com/api/positions", {
          ...formData,
          gmail,
        });
        alert("✅ Position added successfully!");
      }

      setFormData({
        position: "",
        academicYear: "",
        period: "",
        startDate: "",
        endDate: "",
      });
      setEditId(null);
      fetchPositions();
    } catch (err) {
      console.error("Error saving:", err);
      alert("❌ Failed to save record");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      position: item.position,
      academicYear: item.academicYear,
      period: item.period,
      startDate: item.startDate,
      endDate: item.endDate,
    });
  };

  // 🟢 Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await axios.delete(`https://service-book-backend.onrender.com/api/positions/${id}`);
      fetchPositions();
    }
  };

  const handlePrevious = () => navigate("/InteractionsOutsideWorld");
  const handleNext = () => navigate("/ResearchInterests");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: 2,
        background: "linear-gradient(135deg,#f7faff 0%,#e8f0ff 100%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "950px" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            background: "linear-gradient(180deg,#ffffff 0%,#f9fbff 100%)",
            boxShadow: "0 15px 40px rgba(25,118,210,0.1)",
            border: "1px solid #e3f2fd",
          }}
        >
          {/* Header */}
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{
              color: "#0b3d91",
              mb: 1,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Positions Held / Other Responsibilities
          </Typography>
          <Box
            sx={{
              width: 200,
              height: 4,
              mx: "auto",
              mb: 4,
              borderRadius: 2,
              background: "linear-gradient(135deg,#1565c0,#42a5f5)",
            }}
          />

          {/* Add / Edit Form */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg,#f9fbff 0%,#eef5ff 100%)",
              border: "2px dashed #bbdefb",
              transition: "0.3s",
              "&:hover": { borderColor: "#64b5f6" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1565c0",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              {editId ? "✏️ Edit Position" : "➕ Add New Position"}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="position"
                  label="Name of the Position"
                  value={formData.position}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="academicYear"
                  label="Academic Year"
                  value={formData.academicYear}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="period"
                  label="Period / Remarks"
                  value={formData.period}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="startDate"
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="endDate"
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box sx={{ textAlign: "right", mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
                onClick={handleSave}
                sx={{
                  background: "linear-gradient(135deg,#1565c0,#42a5f5)",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                  "&:hover": {
                    background: "linear-gradient(135deg,#0b3d91,#1565c0)",
                  },
                }}
              >
                {editId ? "Update" : "Save"}
              </Button>
            </Box>
          </Paper>

          <Divider sx={{ mb: 3, borderColor: "#e3f2fd" }} />

          {/* Saved Records */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#0b3d91", mb: 3 }}
          >
            Saved Records
          </Typography>

          <AnimatePresence>
            {positions.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid #d3e0ff",
                    background: "linear-gradient(135deg,#f9fbff 0%,#f5f8ff 100%)",
                    boxShadow: "0 3px 12px rgba(25,118,210,0.05)",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 18px rgba(25,118,210,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "#1565c0", fontWeight: "bold" }}
                      >
                        #{index + 1}. {item.position}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        <strong>Academic Year:</strong> {item.academicYear || "—"} <br />
                        <strong>Period:</strong> {item.period || "—"} <br />
                        <strong>Start:</strong> {item.startDate || "—"} <br />
                        <strong>End:</strong> {item.endDate || "—"}
                      </Typography>
                    </Box>

                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEdit(item)}
                          sx={{
                            color: "#1565c0",
                            "&:hover": {
                              backgroundColor: "rgba(21,101,192,0.08)",
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(item._id)}
                          sx={{
                            color: "#f44336",
                            "&:hover": {
                              backgroundColor: "rgba(244,67,54,0.1)",
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 5,
              pt: 3,
              borderTop: "2px solid #e3f2fd",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handlePrevious}
              sx={{
                color: "#1565c0",
                borderColor: "#1565c0",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(21,101,192,0.05)" },
              }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleNext}
              sx={{
                background: "linear-gradient(135deg,#2e7d32,#4caf50)",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": {
                  background: "linear-gradient(135deg,#1b5e20,#2e7d32)",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default PositionsHeld;
