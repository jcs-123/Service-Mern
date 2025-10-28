import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function PositionsHeld() {
  const navigate = useNavigate();

  const [positions, setPositions] = useState([
    {
      position:
        "Member, EXECUTIVE COUNCIL, K-DISC - KOTTAYAM DISTRICT LEVEL COMMITTEE",
      academicYear: "2018-2019",
      period: "Currently in Charge in this college",
      startDate: "2018-03-30",
      endDate: "2022-08-20",
    },
  ]);

  // ✅ Auto-save on change
  const handleChange = (index, field, value) => {
    const updated = [...positions];
    updated[index][field] = value;
    setPositions(updated);
    console.log("Auto-saved:", updated[index]);
  };

  // ✅ Add New Row
  const handleAddRow = () => {
    setPositions([
      ...positions,
      {
        position: "",
        academicYear: "",
        period: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const handlePrevious = () => navigate("/InteractionsOutsideWorld");
  const handleNext = () => navigate("/ResearchInterests");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f0f6ff 0%,#e8f0ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 5,
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "950px" }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            border: "1px solid #b6d0ff",
            p: { xs: 3, md: 5 },
            background: "#ffffff",
            boxShadow: "0 6px 20px rgba(25,118,210,0.1)",
          }}
        >
          {/* ===== Header ===== */}
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            sx={{
              color: "#0b3d91",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 1,
            }}
          >
            Positions Held / Other Responsibilities
          </Typography>
          <Box
            sx={{
              height: "3px",
              width: "280px",
              backgroundColor: "#1565c0",
              mx: "auto",
              mb: 4,
              borderRadius: 2,
            }}
          />

          {/* ===== Records ===== */}
          {positions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  border: "1px solid #d3e0ff",
                  background: "linear-gradient(145deg,#fafcff,#f6f9ff)",
                  boxShadow: "0 3px 10px rgba(25,118,210,0.05)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ color: "#1565c0", mb: 2 }}
                >
                  #{index + 1} Position Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                      Name of the Position
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.position}
                      onChange={(e) =>
                        handleChange(index, "position", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                      During Academic Year
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.academicYear}
                      onChange={(e) =>
                        handleChange(index, "academicYear", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                      Period / Remarks
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.period}
                      onChange={(e) =>
                        handleChange(index, "period", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                      Start Date
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={item.startDate}
                      onChange={(e) =>
                        handleChange(index, "startDate", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#0b3d91" }}>
                      End Date
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={item.endDate}
                      onChange={(e) =>
                        handleChange(index, "endDate", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          ))}

          {/* ➕ Add New Position */}
          <Box sx={{ textAlign: "left", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleAddRow}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                color: "#1565c0",
                borderColor: "#1565c0",
                "&:hover": { background: "rgba(21,101,192,0.1)" },
              }}
            >
              + Add Position
            </Button>
          </Box>

          {/* ===== Navigation ===== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePrevious}
              sx={{
                color: "#0b3d91",
                borderColor: "#0b3d91",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              ← Back
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Save />}
                sx={{
                  backgroundColor: "#1565c0",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 3,
                  "&:hover": { backgroundColor: "#0b3d91" },
                }}
                onClick={() => alert("✅ Auto-saved all positions!")}
              >
                Save
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#2e7d32",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                  "&:hover": { backgroundColor: "#1b5e20" },
                }}
                onClick={handleNext}
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

export default PositionsHeld;
