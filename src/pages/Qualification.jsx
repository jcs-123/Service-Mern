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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Visibility,
  School,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Qualification = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const userEmail = localStorage.getItem("gmail") || "";

  // Qualification options
  const qualificationOptions = {
    "Post-Doctoral Fellowship (PDF)": [],
    "Phd": ["Ph.D", "Ph.D (Pursuing)"],
    "POST GRADUATION": ["M.Tech", "M.E", "M.A.", "M.Sc", "MBA", "MCA", "M.Com", "Other"],
    "GRADUATION": ["B.Tech", "B.E", "AMIE", "B.A", "B.Sc", "B.Com", "B.P.Ed"],
    "DIPLOMA": [],
    "HIGHER SECONDARY": ["Plus Two (State)", "Plus Two (CBSE)", "Plus Two (ICSE)"],
    "SECONDARY": ["SSLC (State)", "10th (CBSE)", "10th (ICSE)"],
    "OTHERS": []
  };

  const degreeOptions = Object.keys(qualificationOptions);

  // Form state
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

  // Fetch qualifications
  useEffect(() => {
    fetchQualifications();
  }, []);

  const fetchQualifications = async () => {
    if (!userEmail) return;
    
    try {
      setLoading(true);
      const res = await axios.get(
        `https://service-book-backend.onrender.com/qualification/${encodeURIComponent(userEmail)}`
      );
      setQualifications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
      alert("Failed to fetch qualifications");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "certificate") {
      setFormData({ ...formData, certificate: files[0] });
    } else if (name === "degree") {
      setFormData({ 
        ...formData, 
        degree: value,
        discipline: ""
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Open modal for add/edit
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

  // Save qualification
  const handleSave = async () => {
    if (!userEmail) {
      alert("User email not found");
      return;
    }

    if (!formData.degree) {
      alert("Please select a Degree");
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
          `https://service-book-backend.onrender.com/qualification/${editItem._id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Qualification updated successfully!");
      } else {
        await axios.post("https://service-book-backend.onrender.com/qualification", form, {
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
        axios.delete(`https://service-book-backend.onrender.com/qualification/${id}`),
        {
          pending: "Deleting qualification...",
          success: "Deleted successfully ✅",
          error: "Failed to delete ❌",
        }
      );
      fetchQualifications();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save qualification");
    }
  };

  // Edit qualification
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

  // Delete qualification
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://service-book-backend.onrender.com/qualification/${id}`);
      alert("Qualification deleted successfully!");
      fetchQualifications();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete qualification");
    } finally {
      setDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  // Navigation
  const handleBack = () => navigate("/GeneralDetail");
  const handleNext = () => navigate("/experience");

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Academic Qualifications
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your educational background
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpen}
              sx={{ borderRadius: 2 }}
            >
              Add Qualification
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Qualifications Table */}
      <Paper sx={{ borderRadius: 2, boxShadow: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Degree</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Discipline</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>University</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Percentage</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Passing Year</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : qualifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <School sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      No qualifications found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Click "Add Qualification" to get started
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                qualifications.map((q, index) => (
                  <TableRow key={q._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{q.degree}</TableCell>
                    <TableCell>{q.discipline || "-"}</TableCell>
                    <TableCell>{q.university}</TableCell>
                    <TableCell>{q.percentage}%</TableCell>
                    <TableCell>{q.passingYear}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEdit(q)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => {
                            setItemToDelete(q._id);
                            setDeleteDialog(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                        {q.certificate && (
                          <IconButton 
                            size="small" 
                            color="info"
                            component="a"
                            href={`https://service-book-backend.onrender.com/uploads/${q.certificate}`}
                            target="_blank"
                          >
                            <Visibility />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Typography variant="body2" color="textSecondary" sx={{ alignSelf: "center" }}>
          {qualifications.length} qualification(s) added
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleNext}
        >
          Continue to Experience
        </Button>
      </Box>

      {/* Add/Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "90%", md: "700px" },
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {editItem ? "Edit Qualification" : "Add New Qualification"}
          </Typography>

          <Grid container spacing={3}>
            {/* Degree */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Degree</InputLabel>
                <Select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  label="Degree"
                >
                  {degreeOptions.map((degree) => (
                    <MenuItem key={degree} value={degree}>{degree}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Discipline */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={!formData.degree || qualificationOptions[formData.degree]?.length === 0}>
                <InputLabel>Discipline</InputLabel>
                <Select
                  name="discipline"
                  value={formData.discipline}
                  onChange={handleChange}
                  label="Discipline"
                >
                  <MenuItem value="">Select Discipline</MenuItem>
                  {qualificationOptions[formData.degree]?.map((disc) => (
                    <MenuItem key={disc} value={disc}>{disc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* University */}
            <Grid item xs={12} md={6}>
              <TextField
                label="University"
                name="university"
                value={formData.university}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Percentage */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Percentage"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                fullWidth
                type="number"
                inputProps={{ min: "0", max: "100", step: "0.01" }}
              />
            </Grid>

            {/* Registration Year */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Registration Year"
                name="registrationYear"
                value={formData.registrationYear}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            </Grid>

            {/* Passing Year */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Passing Year"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            </Grid>

            {/* Remarks */}
            <Grid item xs={12}>
              <TextField
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            {/* Certificate Upload */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ py: 2 }}
              >
                {formData.certificate ? "Change Certificate" : "Upload Certificate"}
                <input
                  type="file"
                  name="certificate"
                  hidden
                  onChange={handleChange}
                  accept=".pdf,.jpg,.png,.jpeg"
                />
              </Button>
              {formData.certificate && (
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  Selected: {formData.certificate.name}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              {editItem ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this qualification?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(itemToDelete)} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Qualification;