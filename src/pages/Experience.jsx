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
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Experience = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // ======================================================
  // 🧠 LOAD LOGGED-IN USER EMAIL
  // ======================================================
  useEffect(() => {
    const gmail = localStorage.getItem("gmail") || localStorage.getItem("email");
    if (gmail) {
      setUserEmail(gmail.trim().toLowerCase());
    } else {
      toast.error("⚠️ No Gmail found — please log in again.");
    }
  }, []);

  // ======================================================
  // 📥 FETCH EXPERIENCES BY EMAIL
  // ======================================================
  const fetchExperiences = async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/experience/${userEmail}`);
      if (res.data?.success) setExperiences(res.data.data || []);
      else setExperiences([]);
    } catch (err) {
      console.error("❌ Error fetching experiences:", err);
      toast.error("Error loading experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchExperiences();
  }, [userEmail]);

  // ======================================================
  // 🧾 FORM DATA
  // ======================================================
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    fromDate: "",
    toDate: "",
    designation: "",
    employmentNature: "",
    dutyNature: "",
    certificate: null,
  });

  const handleOpen = () => {
    setEditItem(null);
    setFormData({
      title: "",
      organization: "",
      fromDate: "",
      toDate: "",
      designation: "",
      employmentNature: "",
      dutyNature: "",
      certificate: null,
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "certificate") {
      setFormData({ ...formData, certificate: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ======================================================
  // ✏️ EDIT EXPERIENCE
  // ======================================================
  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title,
      organization: item.organization,
      fromDate: item.fromDate,
      toDate: item.toDate,
      designation: item.designation,
      employmentNature: item.employmentNature,
      dutyNature: item.dutyNature,
      certificate: null,
    });
    setOpen(true);
  };

  // ======================================================
  // 🗑️ DELETE EXPERIENCE — CONFIRMATION
  // ======================================================
  const confirmDelete = async (id) => {
    toast.dismiss();
    try {
      await toast.promise(axios.delete(`http://localhost:4000/experience/${id}`), {
        pending: "Deleting experience...",
        success: "🗑️ Experience deleted successfully ✅",
        error: "Failed to delete experience ❌",
      });
      fetchExperiences();
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const handleDeleteClick = (id) => {
    toast.info(
      <div style={{ textAlign: "center" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Delete this experience?
        </Typography>
        <div style={{ marginTop: 10 }}>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => confirmDelete(id)}
            sx={{ mr: 1 }}
          >
            Yes
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => toast.dismiss()}
          >
            No
          </Button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // ======================================================
  // 🟢 ADD / UPDATE EXPERIENCE
  // ======================================================
  const handleSave = async () => {
    if (!userEmail) {
      toast.error("⚠️ Gmail not found — please log in again.");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) form.append(key, val);
    });
    form.append("email", userEmail);

    try {
      if (editItem) {
        await axios.put(
          `http://localhost:4000/experience/${editItem._id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("✅ Experience updated successfully!");
      } else {
        await axios.post("http://localhost:4000/experience", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Experience added successfully!");
      }

      setOpen(false);
      fetchExperiences();
    } catch (err) {
      console.error("❌ Save error:", err);
      toast.error(err.response?.data?.message || "Error saving experience");
    }
  };

  // ======================================================
  // 🔙 NAVIGATION
  // ======================================================
  const handleBack = () => navigate("/qualification");
  const handleNext = () => navigate("/SubjectEngaged");

  // ======================================================
  // 🧩 UI SECTION
  // ======================================================
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
      <ToastContainer position="top-right" autoClose={2500} />

      {/* ===== Header ===== */}
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

      {/* ===== Table ===== */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 3 }}>
        <Table>
          <TableHead sx={{ background: "linear-gradient(135deg, #42A5F5, #1976D2)" }}>
            <TableRow>
              {[
                "Sl. No",
                "Title",
                "Organization",
                "From Date",
                "To Date",
                "Designation",
                "Nature of Employment",
                "Nature of Duty",
                "Certificate",
                "Actions",
              ].map((head) => (
                <TableCell key={head} sx={{ color: "white", fontWeight: "bold" }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : experiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No experiences found.
                </TableCell>
              </TableRow>
            ) : (
              experiences.map((exp, i) => (
                <TableRow key={exp._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{exp.title}</TableCell>
                  <TableCell>{exp.organization}</TableCell>
                  <TableCell>{exp.fromDate}</TableCell>
                  <TableCell>{exp.toDate}</TableCell>
                  <TableCell>{exp.designation}</TableCell>
                  <TableCell>{exp.employmentNature}</TableCell>
                  <TableCell>{exp.dutyNature}</TableCell>
                  <TableCell>
                    {exp.certificate ? (
                      <a
                        href={`http://localhost:4000/uploads/${exp.certificate}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Chip icon={<Description />} label="View File" color="info" size="small" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(exp)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteClick(exp._id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===== Navigation ===== */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext}>
          Next
        </Button>
      </Box>

      {/* ===== Modal ===== */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: "95%", sm: "80%", md: "70%" },
            maxWidth: 800,
            bgcolor: "white",
            borderRadius: 3,
            border: "2px solid #1565C0",
            p: { xs: 2.5, sm: 4 },
            mx: "auto",
            mt: "5%",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1565C0", mb: 3 }}>
            {editItem ? "Edit Experience" : "Add Experience"}
          </Typography>

          <Grid container spacing={2}>
            {[
              { name: "title", label: "Title", icon: <WorkOutline /> },
              { name: "organization", label: "Organization", icon: <Business /> },
              { name: "fromDate", label: "From Date", icon: <CalendarToday />, type: "date" },
              { name: "toDate", label: "To Date", icon: <CalendarMonth />, type: "date" },
              { name: "designation", label: "Designation", icon: <Badge /> },
              { name: "employmentNature", label: "Nature of Employment", icon: <AssignmentTurnedIn /> },
              { name: "dutyNature", label: "Nature of Duty", icon: <WorkOutline /> },
            ].map((f) => (
              <Grid item xs={12} sm={6} key={f.name}>
                <TextField
                  fullWidth
                  label={f.label}
                  name={f.name}
                  type={f.type || "text"}
                  value={formData[f.name]}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">{f.icon}</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button component="label" variant="outlined" startIcon={<UploadFile />} fullWidth>
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
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  Selected: {formData.certificate.name || formData.certificate}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              {editItem ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Experience;
