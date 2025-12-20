import React, { useState, useEffect } from "react";
import {
  Box, Grid, TextField, Button, Typography, Paper, Divider,
  IconButton, Fade, Tooltip,
  MenuItem
} from "@mui/material";
import { Add, Save, Delete, ArrowBack, ArrowForward, Edit } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Patent() {
  const navigate = useNavigate();
  const gmail = localStorage.getItem("gmail") || "jeswinjohn@jecc.ac.in";

  const [showSuccess, setShowSuccess] = useState(false);
  const [patents, setPatents] = useState([]);
  const [newPatent, setNewPatent] = useState({
    patentNo: "", inventors: "", year: "", status: "", sort: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPatents();
  }, []);
const generatePatentYearOptions = () => {
  const options = [];
  const currentYear = new Date().getFullYear();
  const startYear = 2018;

  for (let year = currentYear; year >= startYear; year--) {
    options.push(`${year}-${year + 1}`);
  }

  return options;
};

const PATENT_YEAR_OPTIONS = generatePatentYearOptions();

  // 🟢 Fetch from backend
  const fetchPatents = async () => {
    try {
      const res = await axios.get(`https://service-book-backend.onrender.com/api/patents/${gmail}`);
      if (res.data.success) setPatents(res.data.data);
    } catch (err) {
      console.error("Error fetching patents:", err);
    }
  };

  // 🟢 Add / Update Patent
  const handleAdd = async () => {
    if (!newPatent.patentNo.trim()) return alert("Please enter a Patent Number");
    try {
      if (editId) {
        await axios.put(`https://service-book-backend.onrender.com/api/patents/${editId}`, {
          ...newPatent, gmail,
        });
        alert("✅ Patent updated successfully!");
      } else {
        await axios.post("https://service-book-backend.onrender.com/api/patents", {
          ...newPatent, gmail,
        });
        alert("✅ Patent added successfully!");
      }
      setNewPatent({ patentNo: "", inventors: "", year: "", status: "", sort: "" });
      setEditId(null);
      fetchPatents();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Error saving patent:", err);
      alert("❌ Failed to save patent");
    }
  };

  // 🟢 Edit Patent
  const handleEdit = (item) => {
    setNewPatent({
      patentNo: item.patentNo,
      inventors: item.inventors,
      year: item.year,
      status: item.status,
      sort: item.sort,
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🟢 Delete Patent
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await axios.delete(`https://service-book-backend.onrender.com/api/patents/${id}`);
      fetchPatents();
    }
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#e3f2fd", borderWidth: 2 },
      "&:hover fieldset": { borderColor: "#bbdefb" },
      "&.Mui-focused fieldset": {
        borderColor: "#1565c0",
        borderWidth: 2,
        boxShadow: "0 0 0 4px rgba(21,101,192,0.1)",
      },
    },
    "& .MuiInputLabel-root": { color: "#1565c0", fontWeight: "500" },
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f7faff 0%, #e6eeff 100%)",
      py: 6,
      px: { xs: 2, md: 4 },
      display: "flex",
      justifyContent: "center",
      position: "relative",
    }}>
      <Box sx={{
        position: "absolute", top: 0, left: 0, right: 0, height: "300px",
        background:
          "linear-gradient(135deg, rgba(21,101,192,0.1) 0%, rgba(66,165,245,0.05) 100%)", zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "950px", position: "relative", zIndex: 1 }}
      >
        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Box sx={{
                background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                color: "white", p: 2, borderRadius: 2, textAlign: "center", mb: 3,
                boxShadow: "0 4px 12px rgba(76,175,80,0.3)"
              }}>
                <Typography variant="body1" fontWeight="bold">✅ Patent Details Saved!</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Paper elevation={12} sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          backgroundColor: "#fff",
          boxShadow: "0 20px 40px rgba(25,118,210,0.15)",
          border: "1px solid #e3f2fd",
        }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" sx={{
              fontWeight: "bold",
              background: "linear-gradient(135deg, #0b3d91, #1565c0)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 2,
            }}>
              Patent Details
            </Typography>
            <Box sx={{
              width: 120, height: 4, mx: "auto",
              background: "linear-gradient(135deg, #1565c0, #42a5f5)",
              borderRadius: 2,
            }} />
          </Box>

          {/* 🟩 Form Section (TOP) */}
    <Fade in timeout={800}>
  <Box>
    <Divider sx={{ my: 3, "&::before, &::after": { borderColor: "#e3f2fd" } }}>
      <Box
        sx={{
          px: 3,
          py: 1,
          background: "linear-gradient(135deg, #1565c0, #42a5f5)",
          color: "white",
          borderRadius: 20,
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {editId ? "EDIT PATENT" : "ADD NEW PATENT"}
      </Box>
    </Divider>

    <Grid container spacing={3}>
      {/* Patent Number */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Patent Number"
          fullWidth
          value={newPatent.patentNo}
          onChange={(e) =>
            setNewPatent({ ...newPatent, patentNo: e.target.value })
          }
          sx={textFieldStyles}
          required
        />
      </Grid>

      {/* Inventors */}
      <Grid item xs={12} md={6}>
        <TextField
          label="Inventor(s) Name"
          fullWidth
          value={newPatent.inventors}
          onChange={(e) =>
            setNewPatent({ ...newPatent, inventors: e.target.value })
          }
          sx={textFieldStyles}
        />
      </Grid>

      {/* Patent Year (DROPDOWN) */}
      <Grid item xs={12} md={4}>
        <TextField
          select
          label="Year of Patent"
          fullWidth
          value={newPatent.year}
          onChange={(e) =>
            setNewPatent({ ...newPatent, year: e.target.value })
          }
          sx={textFieldStyles}
          required
        >
          <MenuItem value="">
            <em>Select Year</em>
          </MenuItem>
          {PATENT_YEAR_OPTIONS.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Status */}
      <Grid item xs={12} md={4}>
        <TextField
          label="Status"
          fullWidth
          value={newPatent.status}
          onChange={(e) =>
            setNewPatent({ ...newPatent, status: e.target.value })
          }
          sx={textFieldStyles}
        />
      </Grid>

      {/* Type */}
      <Grid item xs={12} md={4}>
        <TextField
          label="Type"
          fullWidth
          value={newPatent.sort}
          onChange={(e) =>
            setNewPatent({ ...newPatent, sort: e.target.value })
          }
          sx={textFieldStyles}
        />
      </Grid>

      {/* Submit Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          disabled={!newPatent.patentNo.trim() || !newPatent.year}
          sx={{
            background: "linear-gradient(135deg, #1565c0, #42a5f5)",
            borderRadius: "12px",
            fontWeight: "bold",
            textTransform: "none",
            px: 4,
            py: 1.5,
          }}
        >
          {editId ? "Update Patent" : "Add Patent"}
        </Button>
      </Grid>
    </Grid>
  </Box>
</Fade>


          {/* 📜 Saved Data Section (BOTTOM) */}
          <Typography
            variant="h6"
            sx={{ mt: 6, mb: 2, color: "#0b3d91", fontWeight: "bold" }}
          >
            Saved Patents
          </Typography>

          <AnimatePresence>
            {patents.map((pat, index) => (
              <motion.div key={pat._id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.1 }}>
                <Box sx={{
                  border: "2px solid #e3f2fd",
                  borderRadius: 3,
                  p: 3, mb: 3,
                  background: "linear-gradient(135deg, #f9fbff 0%, #f5f8ff 100%)",
                  boxShadow: "0 4px 16px rgba(25,118,210,0.08)",
                  "&:hover": {
                    borderColor: "#bbdefb",
                    boxShadow: "0 6px 20px rgba(25,118,210,0.12)",
                    transform: "translateY(-2px)",
                  },
                }}>
                  <Box sx={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", mb: 2
                  }}>
                    <Typography variant="h6" sx={{
                      fontWeight: "bold", color: "#1565c0",
                      display: "flex", alignItems: "center", gap: 1
                    }}>
                      <Box sx={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: "12px", fontWeight: "bold",
                      }}>
                        {index + 1}
                      </Box>
                      Patent #{index + 1}
                    </Typography>

                    <Box>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(pat)} sx={{ color: "#1565c0" }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(pat._id)} sx={{ color: "#f44336" }}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography><strong>Patent No:</strong> {pat.patentNo}</Typography>
                  <Typography><strong>Inventor(s):</strong> {pat.inventors}</Typography>
                  <Typography><strong>Year:</strong> {pat.year}</Typography>
                  <Typography><strong>Status:</strong> {pat.status}</Typography>
                  <Typography><strong>Type:</strong> {pat.sort}</Typography>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Navigation */}
          <Box sx={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", mt: 6, pt: 4, borderTop: "2px solid #e3f2fd"
          }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/Publications")}
              sx={{
                borderColor: "#1565c0", color: "#1565c0",
                textTransform: "none", fontWeight: "bold",
              }}>
              Back
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" startIcon={<Save />} onClick={handleSave}
                sx={{
                  background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                  textTransform: "none", fontWeight: "bold",
                }}>
                Save
              </Button>
              <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate("/ProgramsCoordinated")}
                sx={{
                  background: "linear-gradient(135deg, #2e7d32, #4caf50)",
                  textTransform: "none", fontWeight: "bold",
                }}>
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Patent;
