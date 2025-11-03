import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Edit, Save, ArrowBack, ArrowForward } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResearchInterests() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [researchAreas, setResearchAreas] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch from backend
  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/research-interests/${gmail}`);
      if (res.data.success) setResearchAreas(res.data.data);
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
  };

  // ✅ Add / Update interest
  const handleAdd = async () => {
    if (!newInterest.trim()) return alert("Please enter a research interest");
    try {
      setLoading(true);
      if (editId) {
        await axios.put(`http://localhost:4000/api/research-interests/${editId}`, {
          gmail,
          title: newInterest,
        });
        alert("✅ Updated successfully");
      } else {
        await axios.post("http://localhost:4000/api/research-interests", {
          gmail,
          title: newInterest,
        });
        alert("✅ Added successfully");
      }
      setNewInterest("");
      setEditId(null);
      fetchInterests();
    } catch (error) {
      console.error("Error saving interest:", error);
      alert("❌ Error saving interest");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit
  const handleEdit = (item) => {
    setNewInterest(item.title);
    setEditId(item._id);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this interest?")) {
      await axios.delete(`http://localhost:4000/api/research-interests/${id}`);
      fetchInterests();
    }
  };

  // ✅ Save Button (optional global save)
  const handleSave = () => alert("✅ All data already synced to database!");

  const handlePrevious = () => navigate("/PositionsHeld");
  const handleNext = () => navigate("/Achievements");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        background: "linear-gradient(135deg,#f7faff 0%,#e8f0ff 100%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "900px" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            background: "linear-gradient(180deg,#ffffff 0%,#f9fbff 100%)",
            boxShadow: "0 10px 25px rgba(25,118,210,0.1)",
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
              mb: 2,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Research Interests
          </Typography>
          <Box
            sx={{
              width: 130,
              height: 4,
              mx: "auto",
              mb: 4,
              borderRadius: 2,
              background: "linear-gradient(135deg,#1565c0,#42a5f5)",
            }}
          />

          {/* Add / Edit Section */}
          <Box
            sx={{
              border: "2px dashed #bbdefb",
              borderRadius: 3,
              p: 4,
              mb: 4,
              background: "linear-gradient(135deg,#f7fbff 0%,#eef5ff 100%)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#0b3d91", mb: 2 }}
            >
              {editId ? "✏️ Edit Research Interest" : "➕ Add New Research Interest"}
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  placeholder="Enter research area or topic..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                      "& fieldset": { borderColor: "#e3f2fd" },
                      "&:hover fieldset": { borderColor: "#64b5f6" },
                      "&.Mui-focused fieldset": { borderColor: "#1565c0" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  disabled={loading}
                  onClick={handleAdd}
                  sx={{
                    background: "linear-gradient(135deg,#1565c0,#42a5f5)",
                    textTransform: "none",
                    fontWeight: "bold",
                    py: 1.3,
                    borderRadius: 2,
                    "&:hover": {
                      background: "linear-gradient(135deg,#0b3d91,#1565c0)",
                    },
                  }}
                >
                  {editId ? "Update" : "Add"}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* List of Interests */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#0b3d91", mb: 2 }}
          >
            Saved Research Interests
          </Typography>

          <AnimatePresence>
            {researchAreas.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid #d3e0ff",
                    background: "#f9fbff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 14px rgba(25,118,210,0.1)",
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "16px", color: "#0b3d91", fontWeight: 500 }}
                  >
                    {index + 1}. {item.title}
                  </Typography>

                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleEdit(item)}
                        sx={{
                          color: "#1565c0",
                          "&:hover": { backgroundColor: "rgba(21,101,192,0.1)" },
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
                          "&:hover": { backgroundColor: "rgba(244,67,54,0.1)" },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>

          <Divider sx={{ my: 4, borderColor: "#e3f2fd" }} />

          {/* Footer Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
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
              }}
            >
              Back
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{
                  background: "linear-gradient(135deg,#1565c0,#42a5f5)",
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              >
                Save
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
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default ResearchInterests;
