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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  UploadFile,
  ArrowBack,
  ArrowForward,
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

  // Dropdown options
  const employmentNatureOptions = [
    "Permanent",
    "Contract",
    "Adjunct",
    "Ad hoc",
    "Temporary"
  ];

  const dutyNatureOptions = [
    "Teaching / Academic",
    "Administrative / Office Work",
    "Research",
    "Technical / Support Staff"
  ];

  // Navigation handlers
  const handleBack = () => navigate("/Qualification");
  const handleNext = () => navigate("/SubjectEngaged");

  // ======================================================
  // SORT EXPERIENCES BY LATEST YEAR (PRESENT FIRST)
  // ======================================================
  const sortedExperiences = [...experiences].sort((a, b) => {
    const getYear = (date) => {
      if (!date || date === "Present") return new Date().getFullYear();
      return new Date(date).getFullYear();
    };

    const aYear = getYear(a.toDate);
    const bYear = getYear(b.toDate);

    // Present always on top
    if (a.toDate === "Present" && b.toDate !== "Present") return -1;
    if (a.toDate !== "Present" && b.toDate === "Present") return 1;

    // Sort by To Date year (DESC)
    if (bYear !== aYear) return bYear - aYear;

    // If same To Year → sort by From Date
    return getYear(b.fromDate) - getYear(a.fromDate);
  });

  // ======================================================
  // LOAD USER EMAIL
  // ======================================================
  useEffect(() => {
    const gmail = localStorage.getItem("gmail") || localStorage.getItem("email");
    if (gmail) setUserEmail(gmail.trim().toLowerCase());
    else toast.error("Please login again. Email not found.");
  }, []);

  // ======================================================
  // FETCH EXPERIENCES
  // ======================================================
  const fetchExperiences = async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://service-book-backend.onrender.com/experience/${userEmail}`
      );
      setExperiences(res.data?.success ? res.data.data : []);
    } catch {
      // toast.error("Failed to load experience details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [userEmail]);

  // ======================================================
  // FORM DATA
  // ======================================================
  const [formData, setFormData] = useState({
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
  // EDIT EXPERIENCE
  // ======================================================
  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      organization: item.organization,
      fromDate: item.fromDate,
      toDate: item.toDate === "Present" ? "" : item.toDate,
      designation: item.designation,
      employmentNature: item.employmentNature,
      dutyNature: item.dutyNature,
      certificate: null,
    });
    setOpen(true);
  };

  // ======================================================
  // DELETE EXPERIENCE
  // ======================================================
  const handleDelete = async (id) => {
    toast.dismiss();
    await toast.promise(
      axios.delete(
        `https://service-book-backend.onrender.com/experience/${id}`
      ),
      {
        pending: "Deleting experience...",
        success: "Experience deleted successfully",
        error: "Failed to delete experience",
      }
    );
    fetchExperiences();
  };

  // ======================================================
  // SAVE EXPERIENCE (AUTO PRESENT)
  // ======================================================
  const handleSave = async () => {
    if (!userEmail) return toast.error("Email missing");

    const form = new FormData();

    // Add all form data
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "toDate") {
        form.append("toDate", val ? val : "Present");
      } else if (val) {
        form.append(key, val);
      }
    });

    form.append("email", userEmail);
    // Add empty title field to maintain backend compatibility
    form.append("title", "");

    try {
      if (editItem) {
        await axios.put(
          `https://service-book-backend.onrender.com/experience/${editItem._id}`,
          form
        );
        toast.success("Experience updated successfully");
      } else {
        await axios.post(
          "https://service-book-backend.onrender.com/experience",
          form
        );
        toast.success("Experience added successfully");
      }
      setOpen(false);
      fetchExperiences();
    } catch {
      toast.error("Failed to save experience");
    }
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={2500} />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Experience
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={handleOpen}>
          Add Experience
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              {[
                "Sl",
                "Organization",
                "From",
                "To",
                "Designation",
                "Nature of Employment",
                "Nature of Duty",
                "Certificate",
                "Action",
              ].map((h) => (
                <TableCell key={h} sx={{ color: "#fff", fontWeight: 600 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : experiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No experience records found
                </TableCell>
              </TableRow>
            ) : (
              sortedExperiences.map((e, i) => (
                <TableRow key={e._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{e.organization}</TableCell>
                  <TableCell>{e.fromDate}</TableCell>
                  <TableCell>
                    {e.toDate === "Present" ? (
                      <Chip label="Present" color="success" size="small" />
                    ) : (
                      e.toDate
                    )}
                  </TableCell>
                  <TableCell>{e.designation}</TableCell>
                  <TableCell>{e.employmentNature}</TableCell>
                  <TableCell>{e.dutyNature}</TableCell>
                  <TableCell>
                    {e.certificate && (
                      <a
                        href={`https://service-book-backend.onrender.com/uploads/${e.certificate}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Chip
                          icon={<Description />}
                          label="View"
                          size="small"
                          color="info"
                        />
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(e)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(e._id)}>
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

      {/* NAVIGATION BUTTONS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 4,
          pt: 3,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Back
        </Button>

        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>

      {/* MODAL */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ 
          p: 4, 
          bgcolor: "#fff", 
          maxWidth: 900, // Increased width
          mx: "auto", 
          mt: 5,
          borderRadius: 2,
          boxShadow: 24
        }}>
          <Typography variant="h6" fontWeight={700} mb={3}>
            {editItem ? "Edit Experience" : "Add Experience"}
          </Typography>

          <Grid container spacing={3}>
            {/* Organization */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organization / Institution *"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                size="medium"
              />
            </Grid>

            {/* Designation */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation / Role *"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                size="medium"
              />
            </Grid>

            {/* From Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="From Date *"
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                size="medium"
              />
            </Grid>

            {/* To Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="To Date (Leave empty for Present)"
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="medium"
              />
            </Grid>

            {/* Nature of Employment Dropdown - WITH SEPARATE VISIBLE LABEL */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#333' }}>
                Nature of Employment *
              </Typography>
              <FormControl fullWidth required>
                <Select
                  name="employmentNature"
                  value={formData.employmentNature}
                  onChange={handleChange}
                  displayEmpty
                  size="medium"
                  sx={{
                    height: '56px', // Match TextField height
                    backgroundColor: 'white'
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select Nature of Employment</em>
                  </MenuItem>
                  {employmentNatureOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Nature of Duty Dropdown - WITH SEPARATE VISIBLE LABEL */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#333' }}>
                Nature of Duty *
              </Typography>
              <FormControl fullWidth required>
                <Select
                  name="dutyNature"
                  value={formData.dutyNature}
                  onChange={handleChange}
                  displayEmpty
                  size="medium"
                  sx={{
                    height: '56px', // Match TextField height
                    backgroundColor: 'white'
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select Nature of Duty</em>
                  </MenuItem>
                  {dutyNatureOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Certificate Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#333' }}>
                Certificate Upload *
              </Typography>
              <Button 
                variant="outlined" 
                component="label" 
                fullWidth
                startIcon={<UploadFile />}
                sx={{
                  py: 2,
                  borderStyle: 'dashed',
                  borderWidth: '2px',
                  backgroundColor: '#f5f5f5'
                }}
              >
                {formData.certificate ? formData.certificate.name : "Click to Upload Certificate *"}
                <input 
                  hidden 
                  type="file" 
                  name="certificate" 
                  onChange={handleChange} 
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </Button>
              {formData.certificate && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Selected: {formData.certificate.name} (Size: {(formData.certificate.size / 1024).toFixed(2)} KB)
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={handleClose} size="large">
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              size="large"
              sx={{ minWidth: 120 }}
              disabled={!formData.organization || !formData.designation || !formData.fromDate || !formData.employmentNature || !formData.dutyNature || !formData.certificate}
            >
              {editItem ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

// Add missing imports at the top if needed
import { Description } from "@mui/icons-material";

export default Experience;