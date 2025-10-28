import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  IconButton,
  Fade,
} from "@mui/material";
import { Add, Save, Delete, ArrowBack, ArrowForward } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Achievements() {
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "First Ph.D. in Computer Science and Engineering, College of Engineering, Trivandrum – in 2000",
      academicYear: "2000-2001",
      remarks: "Pioneering research in computer science",
    },
  ]);

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    academicYear: "",
    remarks: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Handle field update
  const handleChange = (id, field, value) => {
    const updated = achievements.map(ach =>
      ach.id === id ? { ...ach, [field]: value } : ach
    );
    setAchievements(updated);
  };

  // ✅ Add new record
  const handleAdd = () => {
    if (!newAchievement.title.trim()) return;
    const newAch = {
      id: Date.now(),
      ...newAchievement,
    };
    setAchievements([...achievements, newAch]);
    setNewAchievement({ title: "", academicYear: "", remarks: "" });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // ✅ Delete achievement
  const handleDelete = (id) => {
    setAchievements(achievements.filter(ach => ach.id !== id));
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handlePrevious = () => navigate("/ResearchInterests");
  const handleNext = () => navigate("/InterestedSubjects");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7faff 0%, #e6eeff 100%)",
        py: 6,
        px: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "300px",
          background: "linear-gradient(135deg, rgba(21,101,192,0.1) 0%, rgba(66,165,245,0.05) 100%)",
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "950px", position: "relative", zIndex: 1 }}
      >
        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Box
                sx={{
                  background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                  color: "white",
                  p: 2,
                  borderRadius: 2,
                  textAlign: "center",
                  mb: 3,
                  boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  ✅ Achievements Saved Successfully!
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: "#fff",
            boxShadow: "0 20px 40px rgba(25,118,210,0.15)",
            border: "1px solid #e3f2fd",
            background: "linear-gradient(180deg, #ffffff 0%, #fafcff 100%)",
          }}
        >
          {/* ===== Header ===== */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(135deg, #0b3d91, #1565c0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 2,
              }}
            >
              Achievements
            </Typography>
            <Box
              sx={{
                width: 120,
                height: 4,
                mx: "auto",
                background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                borderRadius: 2,
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{ color: "#666", mt: 2, fontStyle: "italic" }}
            >
              Record your academic and professional accomplishments
            </Typography>
          </Box>

          {/* ===== Achievements List ===== */}
          <AnimatePresence>
            {achievements.map((ach, index) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Box
                  sx={{
                    border: "2px solid #e3f2fd",
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    background: "linear-gradient(135deg, #f9fbff 0%, #f5f8ff 100%)",
                    boxShadow: "0 4px 16px rgba(25,118,210,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#bbdefb",
                      boxShadow: "0 6px 20px rgba(25,118,210,0.12)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#1565c0",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </Box>
                      Achievement #{index + 1}
                    </Typography>
                    
                    <IconButton
                      onClick={() => handleDelete(ach.id)}
                      sx={{
                        color: "#f44336",
                        background: "rgba(244,67,54,0.1)",
                        "&:hover": {
                          background: "rgba(244,67,54,0.2)",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Title / Description"
                        fullWidth
                        multiline
                        minRows={2}
                        value={ach.title}
                        onChange={(e) => handleChange(ach.id, "title", e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            transition: "all 0.3s ease",
                            "& fieldset": {
                              borderColor: "#e3f2fd",
                              borderWidth: 2,
                            },
                            "&:hover fieldset": {
                              borderColor: "#bbdefb",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1565c0",
                              borderWidth: 2,
                              boxShadow: "0 0 0 4px rgba(21,101,192,0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#1565c0",
                            fontWeight: "500",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="During Academic Year"
                        fullWidth
                        value={ach.academicYear}
                        onChange={(e) => handleChange(ach.id, "academicYear", e.target.value)}
                        placeholder="e.g., 2000-2001"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            "& fieldset": {
                              borderColor: "#e3f2fd",
                              borderWidth: 2,
                            },
                            "&:hover fieldset": {
                              borderColor: "#bbdefb",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1565c0",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#1565c0",
                            fontWeight: "500",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Remarks"
                        fullWidth
                        value={ach.remarks}
                        onChange={(e) => handleChange(ach.id, "remarks", e.target.value)}
                        placeholder="Additional notes or context"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            "& fieldset": {
                              borderColor: "#e3f2fd",
                              borderWidth: 2,
                            },
                            "&:hover fieldset": {
                              borderColor: "#bbdefb",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1565c0",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#1565c0",
                            fontWeight: "500",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* ===== Add New Section ===== */}
          <Fade in timeout={800}>
            <Box>
              <Divider 
                sx={{ 
                  my: 4,
                  "&::before, &::after": {
                    borderColor: "#e3f2fd",
                  },
                }}
              >
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
                  ADD NEW ACHIEVEMENT
                </Box>
              </Divider>

              <Box
                sx={{
                  border: "2px dashed #bbdefb",
                  borderRadius: 3,
                  p: 4,
                  background: "linear-gradient(135deg, rgba(21,101,192,0.02) 0%, rgba(66,165,245,0.02) 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#64b5f6",
                    background: "linear-gradient(135deg, rgba(21,101,192,0.05) 0%, rgba(66,165,245,0.05) 100%)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#0b3d91",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Add sx={{ fontSize: 28 }} />
                  Add New Achievement
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title / Description"
                      fullWidth
                      multiline
                      minRows={2}
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                      placeholder="Describe your achievement in detail..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderColor: "#e3f2fd",
                            borderWidth: 2,
                          },
                          "&:hover fieldset": {
                            borderColor: "#bbdefb",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1565c0",
                            borderWidth: 2,
                            boxShadow: "0 0 0 4px rgba(21,101,192,0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#1565c0",
                          fontWeight: "500",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="During Academic Year"
                      fullWidth
                      value={newAchievement.academicYear}
                      onChange={(e) => setNewAchievement({ ...newAchievement, academicYear: e.target.value })}
                      placeholder="e.g., 2000-2001"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderColor: "#e3f2fd",
                            borderWidth: 2,
                          },
                          "&:hover fieldset": {
                            borderColor: "#bbdefb",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1565c0",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#1565c0",
                          fontWeight: "500",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Remarks"
                      fullWidth
                      value={newAchievement.remarks}
                      onChange={(e) => setNewAchievement({ ...newAchievement, remarks: e.target.value })}
                      placeholder="Additional notes or context"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderColor: "#e3f2fd",
                            borderWidth: 2,
                          },
                          "&:hover fieldset": {
                            borderColor: "#bbdefb",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1565c0",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#1565c0",
                          fontWeight: "500",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAdd}
                      disabled={!newAchievement.title.trim()}
                      sx={{
                        background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        textTransform: "none",
                        px: 4,
                        py: 1.5,
                        fontSize: "16px",
                        boxShadow: "0 4px 12px rgba(21,101,192,0.3)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #0b3d91, #1565c0)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(21,101,192,0.4)",
                        },
                        "&:disabled": {
                          background: "#e0e0e0",
                          color: "#9e9e9e",
                          transform: "none",
                          boxShadow: "none",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Add Achievement
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Fade>

          {/* ===== Navigation Buttons ===== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 6,
              pt: 4,
              borderTop: "2px solid #e3f2fd",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handlePrevious}
              sx={{
                borderColor: "#1565c0",
                color: "#1565c0",
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "rgba(21,101,192,0.08)",
                  borderColor: "#0b3d91",
                  transform: "translateX(-4px)",
                },
                transition: "all 0.3s ease",
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
                  background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  fontSize: "16px",
                  boxShadow: "0 4px 12px rgba(21,101,192,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0b3d91, #1565c0)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(21,101,192,0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Save
              </Button>

              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNext}
                sx={{
                  background: "linear-gradient(135deg, #2e7d32, #4caf50)",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  fontSize: "16px",
                  boxShadow: "0 4px 12px rgba(46,125,50,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1b5e20, #2e7d32)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(46,125,50,0.4)",
                  },
                  transition: "all 0.3s ease",
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

export default Achievements;