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
  Chip,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  UploadFile,
  School,
  Book,
  LocationOn,
  Percent,
  CalendarToday,
  CalendarMonth,
  Attachment,
  ArrowForward,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Qualification = () => {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // 👈 custom confirm toast control
  const navigate = useNavigate();

  /* ======================================================
     🧠 LOAD USER EMAIL FROM LOCALSTORAGE
  ====================================================== */
  useEffect(() => {
    const gmail = localStorage.getItem("gmail");
    if (gmail) {
      setUserEmail(gmail);
      console.log("📧 Logged-in Gmail:", gmail);
    } else {
      toast.error("⚠️ No Gmail found. Please log in again.");
    }
  }, []);

  /* ======================================================
     📥 FETCH QUALIFICATIONS BY EMAIL
  ====================================================== */
  const fetchQualifications = async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:4000/qualification/${encodeURIComponent(userEmail)}`
      );
      setQualifications(res.data.data || []);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchQualifications();
  }, [userEmail]);

  /* ======================================================
     🧾 FORM DATA
  ====================================================== */
  const [formData, setFormData] = useState({
    degree: "",
    discipline: "",
    university: "",
    percentage: "",
    registrationYear: "",
    passingYear: "",
    remarks: "",
    certificate: null,
  });

  const handleOpen = () => {
    setEditItem(null);
    setFormData({
      degree: "",
      discipline: "",
      university: "",
      percentage: "",
      registrationYear: "",
      passingYear: "",
      remarks: "",
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

  /* ======================================================
     🟢 ADD / UPDATE QUALIFICATION
  ====================================================== */
  const handleSave = async () => {
    if (!userEmail) {
      toast.error("User Gmail not found ❌");
      return;
    }

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) form.append(key, val);
      });
      form.append("email", userEmail);

      if (editItem) {
        await axios.put(
          `http://localhost:4000/qualification/${editItem._id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Qualification updated ✅");
      } else {
        await axios.post("http://localhost:4000/qualification", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Qualification added ✅");
      }

      setOpen(false);
      await fetchQualifications();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save qualification ❌");
    }
  };

  /* ======================================================
     🗑️ DELETE QUALIFICATION WITH TOAST CONFIRMATION
  ====================================================== */
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    toast.info(
      <div style={{ textAlign: "center" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Delete this qualification?
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

  const confirmDelete = async (id) => {
    toast.dismiss();
    try {
      await toast.promise(
        axios.delete(`http://localhost:4000/qualification/${id}`),
        {
          pending: "Deleting qualification...",
          success: "Deleted successfully ✅",
          error: "Failed to delete ❌",
        }
      );
      fetchQualifications();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  /* ======================================================
     ✏️ EDIT QUALIFICATION
  ====================================================== */
  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      degree: item.degree,
      discipline: item.discipline,
      university: item.university,
      percentage: item.percentage,
      registrationYear: item.registrationYear,
      passingYear: item.passingYear,
      remarks: item.remarks,
      certificate: null,
    });
    setOpen(true);
  };

  /* ======================================================
     🔙 NAVIGATION
  ====================================================== */
  const handleBack = () => navigate("/GeneralDetail");
  const handleNext = () => navigate("/experience");

  /* ======================================================
     🖼️ UI SECTION
  ====================================================== */
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 3 },
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
        borderRadius: 3,
        border: "2px solid #1565C0",
        boxShadow: "0 6px 24px rgba(33,150,243,0.2)",
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <School sx={{ fontSize: 32, color: "#1565C0" }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.6rem", sm: "1.9rem" },
              background: "linear-gradient(135deg, #1565C0, #1976D2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Qualifications
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
          }}
        >
          Add Qualification
        </Button>
      </Box>

      {/* ===== Table ===== */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "linear-gradient(135deg, #42A5F5, #1976D2)" }}>
            <TableRow>
              {[
                "No",
                "Degree",
                "Discipline",
                "University",
                "Percentage",
                "Reg. Year",
                "Passing Year",
                "Remarks",
                "Certificate",
                "Actions",
              ].map((h) => (
                <TableCell key={h} sx={{ color: "white", fontWeight: "bold" }}>
                  {h}
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
            ) : qualifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No qualifications found
                </TableCell>
              </TableRow>
            ) : (
              qualifications.map((q, i) => (
                <TableRow key={q._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{q.degree}</TableCell>
                  <TableCell>{q.discipline}</TableCell>
                  <TableCell>{q.university}</TableCell>
                  <TableCell>{q.percentage}</TableCell>
                  <TableCell>{q.registrationYear}</TableCell>
                  <TableCell>{q.passingYear}</TableCell>
                  <TableCell>{q.remarks}</TableCell>
                  <TableCell>
                    {q.certificate ? (
                      <a
                        href={`http://localhost:4000/uploads/${q.certificate}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Chip
                          icon={<Attachment />}
                          label="View File"
                          color="info"
                          size="small"
                        />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(q)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteClick(q._id)}>
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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
            width: { xs: "95%", sm: "85%", md: "70%" },
            maxWidth: 800,
            bgcolor: "white",
            borderRadius: 3,
            border: "2px solid #1976D2",
            p: { xs: 2.5, sm: 4 },
            mx: "auto",
            mt: "5%",
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1565C0", mb: 3 }}>
            {editItem ? "Edit Qualification" : "Add Qualification"}
          </Typography>

          <Grid container spacing={2}>
            {[
              { name: "degree", label: "Degree", icon: <School /> },
              { name: "discipline", label: "Discipline / Stream", icon: <Book /> },
              { name: "university", label: "University / Institution", icon: <LocationOn /> },
              { name: "percentage", label: "Percentage / CGPA", icon: <Percent /> },
              { name: "registrationYear", label: "Year of Registration", icon: <CalendarToday /> },
              { name: "passingYear", label: "Year of Passing", icon: <CalendarMonth /> },
            ].map((f) => (
              <Grid item xs={12} sm={6} key={f.name}>
                <TextField
                  label={f.label}
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">{f.icon}</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

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

export default Qualification;
