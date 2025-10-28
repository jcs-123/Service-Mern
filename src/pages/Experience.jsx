import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Business,
  CalendarToday,
  CalendarMonth,
  WorkOutline,
  AssignmentTurnedIn,
  Badge,
  UploadFile,
  ArrowBack,
  ArrowForward,
  Description,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Experience = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Load from localStorage
  const [experiences, setExperiences] = useState(() => {
    const saved = localStorage.getItem("experiences");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    fromDate: "",
    toDate: "",
    designation: "",
    employmentNature: "",
    dutyNature: "",
    certificate: "",
  });

  useEffect(() => {
    localStorage.setItem("experiences", JSON.stringify(experiences));
  }, [experiences]);

  // Handlers
  const handleOpen = () => {
    setEditIndex(null);
    setFormData({
      title: "",
      organization: "",
      fromDate: "",
      toDate: "",
      designation: "",
      employmentNature: "",
      dutyNature: "",
      certificate: "",
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "certificate") {
      setFormData({ ...formData, certificate: files[0]?.name || "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = () => {
    const updated = [...experiences];
    if (editIndex !== null) updated[editIndex] = formData;
    else updated.push(formData);
    setExperiences(updated);
    setOpen(false);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(experiences[index]);
    setOpen(true);
  };

  const handleDelete = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
  };

  const handleBack = () => navigate("/qualification");
  const handleNext = () => navigate("/SubjectEngaged");

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
        borderRadius: 3,
        border: "2px solid #1565C0",
        boxShadow: "0 6px 20px rgba(25,118,210,0.2)",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* ===== Header Section ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <WorkOutline sx={{ fontSize: 34, color: "#1565C0" }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#0D47A1",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Experience
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          sx={{
            background: "linear-gradient(135deg, #1976D2, #1565C0)",
            border: "2px solid #0D47A1",
            borderRadius: "10px",
            fontWeight: 600,
            px: 3,
            py: 1,
            "&:hover": {
              background: "linear-gradient(135deg, #1E88E5, #1565C0)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 18px rgba(25,118,210,0.4)",
            },
          }}
        >
          Add Experience
        </Button>
      </Box>

      {/* ===== Table Section ===== */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: "2px solid #1565C0",
          boxShadow: "0 6px 18px rgba(25,118,210,0.15)",
          overflowX: "auto",
          mb: 3,
        }}
      >
        <Table>
          <TableHead sx={{ background: "linear-gradient(135deg, #42A5F5, #1976D2)" }}>
            <TableRow>
              {[
                "Sl. No",
                "Title",
                "Organization / Institution",
                "From Date",
                "To Date",
                "Designation",
                "Nature of Employment",
                "Nature of Duty",
                "Certificate",
                "Actions",
              ].map((head, i) => (
                <TableCell
                  key={i}
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    borderRight: "1px solid rgba(255,255,255,0.3)",
                    fontSize: "0.95rem",
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {experiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <WorkOutline sx={{ fontSize: 48, color: "grey.500" }} />
                  <Typography variant="h6" color="grey.600">
                    No experiences added yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              experiences.map((exp, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    "&:hover": {
                      background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{exp.title || "-"}</TableCell>
                  <TableCell>{exp.organization || "-"}</TableCell>
                  <TableCell>{exp.fromDate || "-"}</TableCell>
                  <TableCell>{exp.toDate || "-"}</TableCell>
                  <TableCell>{exp.designation || "-"}</TableCell>
                  <TableCell>{exp.employmentNature || "-"}</TableCell>
                  <TableCell>{exp.dutyNature || "-"}</TableCell>
                  <TableCell>
                    {exp.certificate ? (
                      <Chip
                        icon={<Description />}
                        label="File"
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(index)}
                          size="small"
                          sx={{
                            background: "linear-gradient(135deg, #42A5F5, #1976D2)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(135deg, #1E88E5, #1565C0)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(index)}
                          size="small"
                          sx={{
                            background: "linear-gradient(135deg, #E57373, #C62828)",
                            color: "white",
                            "&:hover": {
                              background: "linear-gradient(135deg, #EF5350, #B71C1C)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===== Navigation Buttons ===== */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            borderColor: "#1565C0",
            color: "#1565C0",
            "&:hover": { background: "#E3F2FD" },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleNext}
          sx={{
            background: "linear-gradient(135deg, #1976D2, #1565C0)",
            border: "2px solid #0D47A1",
            borderRadius: "10px",
            fontWeight: 600,
            px: 4,
            py: 1,
            "&:hover": {
              background: "linear-gradient(135deg, #1E88E5, #1565C0)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Next
        </Button>
      </Box>

      {/* ===== Add/Edit Modal ===== */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: "95%", sm: "80%", md: "70%" },
            maxWidth: 800,
            bgcolor: "white",
            borderRadius: 3,
            border: "2px solid #1565C0",
            boxShadow: "0 20px 60px rgba(25,118,210,0.3)",
            p: { xs: 2.5, sm: 4 },
            mx: "auto",
            mt: "5%",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1565C0", mb: 3 }}>
            {editIndex !== null ? "Edit Experience" : "Add New Experience"}
          </Typography>

          <Grid container spacing={2}>
            {[
              { name: "title", label: "Title", icon: <WorkOutline />, placeholder: "Teaching / Research / Industrial" },
              { name: "organization", label: "Organization / Institution", icon: <Business />, placeholder: "ABC Pvt. Ltd. / JEC" },
              { name: "fromDate", label: "From Date", icon: <CalendarToday />, type: "date" },
              { name: "toDate", label: "To Date", icon: <CalendarMonth />, type: "date" },
              { name: "designation", label: "Designation", icon: <Badge />, placeholder: "Assistant Professor" },
              { name: "employmentNature", label: "Nature of Employment", icon: <AssignmentTurnedIn />, placeholder: "Permanent / Contract" },
              { name: "dutyNature", label: "Nature of Duty", icon: <WorkOutline />, placeholder: "Teaching / Admin / Research" },
            ].map((f, i) => (
              <Grid item xs={12} sm={i < 2 ? 6 : 4} key={f.name}>
                <TextField
                  fullWidth
                  label={f.label}
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  type={f.type || "text"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">{f.icon}</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

            {/* Certificate Upload */}
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFile />}
                fullWidth
                sx={{
                  border: "2px dashed #1976D2",
                  color: "#1976D2",
                  py: 1.5,
                  "&:hover": { background: "#E3F2FD" },
                }}
              >
                Upload Certificate
                <input
                  type="file"
                  name="certificate"
                  hidden
                  onChange={handleChange}
                  accept=".pdf,.jpg,.png"
                />
              </Button>
              {formData.certificate && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  Selected: {formData.certificate}
                </Typography>
              )}
            </Grid>
          </Grid>

          {/* Save / Cancel Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
            <Button variant="outlined" onClick={handleClose} sx={{ borderColor: "#1565C0", color: "#1565C0" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                background: "linear-gradient(135deg, #1976D2, #1565C0)",
                border: "2px solid #0D47A1",
                px: 4,
                "&:hover": { background: "linear-gradient(135deg, #1E88E5, #1565C0)" },
              }}
            >
              {editIndex !== null ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Experience;
