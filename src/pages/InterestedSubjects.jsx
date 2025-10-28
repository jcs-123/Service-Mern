import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { Add, Save } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function InterestedSubjects() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([
    { title: "Data Structures and Algorithms" },
    { title: "Wireless Sensor Networks" },
    { title: "Machine Learning and AI" },
  ]);

  const [newSubject, setNewSubject] = useState("");

  // ✅ Auto edit
  const handleChange = (index, value) => {
    const updated = [...subjects];
    updated[index].title = value;
    setSubjects(updated);
  };

  // ✅ Add new subject
  const handleAdd = () => {
    if (!newSubject.trim()) return;
    setSubjects([...subjects, { title: newSubject }]);
    setNewSubject("");
  };

  const handlePrevious = () => navigate("/Achievements");
  const handleNext = () => navigate("/ActivityLog");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f7faff 0%,#e6eeff 100%)",
        py: 6,
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
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
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: "#fff",
            border: "1px solid #cbd9ff",
            boxShadow: "0 8px 25px rgba(25,118,210,0.1)",
          }}
        >
          {/* ===== Header ===== */}
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#0b3d91",
              textTransform: "uppercase",
              mb: 1,
              letterSpacing: 0.8,
            }}
          >
            Interested Subjects
          </Typography>
          <Box
            sx={{
              width: 230,
              height: 3,
              mx: "auto",
              mb: 4,
              backgroundColor: "#1565c0",
              borderRadius: 2,
            }}
          />

          {/* ===== Subject List ===== */}
          {subjects.map((sub, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                border: "1px solid #d3e3ff",
                borderRadius: 2,
                p: 3,
                mb: 3,
                background: "linear-gradient(180deg,#f9fbff 0%,#f5f8ff 100%)",
                boxShadow: "0 4px 10px rgba(25,118,210,0.08)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#1565c0",
                  fontWeight: "bold",
                  mb: 2,
                }}
              >
                #{index + 1} Subject
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Subject Name / Topic"
                    fullWidth
                    size="small"
                    value={sub.title}
                    onChange={(e) => handleChange(index, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: "#fff",
                        "& fieldset": { borderColor: "#bcd2ff" },
                        "&:hover fieldset": { borderColor: "#1565c0" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1565c0",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* ===== Add New Subject ===== */}
          <Divider sx={{ my: 4 }} />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "#0b3d91", mb: 2 }}
          >
            ➕ Add New Subject
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Enter Subject / Topic"
                fullWidth
                size="small"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "#fff",
                    "& fieldset": { borderColor: "#bcd2ff" },
                    "&:hover fieldset": { borderColor: "#1565c0" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1565c0",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={handleAdd}
                sx={{
                  background: "linear-gradient(135deg,#1565c0,#42a5f5)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  py: 1,
                  "&:hover": { backgroundColor: "#0b3d91" },
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          {/* ===== Navigation Buttons ===== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 5,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePrevious}
              sx={{
                color: "#1565c0",
                borderColor: "#1565c0",
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
                "&:hover": { background: "rgba(21,101,192,0.1)" },
              }}
            >
              ← Back
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                sx={{
                  background: "linear-gradient(135deg,#1565c0,#42a5f5)",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                  "&:hover": { background: "#0b3d91" },
                }}
              >
                Save
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  background: "linear-gradient(135deg,#2e7d32,#66bb6a)",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                  "&:hover": { background: "#1b5e20" },
                }}
              >
                Next →
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default InterestedSubjects;
