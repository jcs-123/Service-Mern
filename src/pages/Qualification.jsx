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

  const userEmail = localStorage.getItem("gmail") || "";

  // Qualification options
  const qualificationOptions = {
    "Post-Doctoral Fellowship (PDF)": [],
    "PhD": ["PhD", "PhD (Pursuing)"],
    "POST GRADUATION": ["M.Tech", "M.E", "M.A.", "M.Sc", "MBA", "MCA", "M.Com", "M.Phil","M.Lib.Sc.(Library Sciences)" ,"Other"],
    "GRADUATION": ["B.Tech", "B.E", "AMIE", "B.A", "B.Sc", "B.Com", "B.P.Ed",".Lib.Sc. (Library Sciences)","BCA"],
    "DIPLOMA": [],
    "HIGHER SECONDARY": ["Plus Two (State)", "Plus Two (CBSE)", "Plus Two (ICSE)"],
    "SECONDARY": ["SSLC (State)", "10th (CBSE)", "10th (ICSE)"],
    "OTHERS": []
  };

  // Form state
  const [formData, setFormData] = useState({
    qualification: "",
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
      // toast.error("Failed to load qualifications ❌");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "certificate") {
      setFormData({ ...formData, certificate: files[0] });
    } 
    else if (name === "qualification") {
      setFormData({
        ...formData,
        qualification: value,
        degree: "", // Reset degree when qualification changes
      });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Open modal for add/edit
  const handleOpen = () => {
    setEditItem(null);
    setFormData({
      qualification: "",
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

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
  };

  // Save qualification
const handleSave = async () => {
  if (!userEmail) {
    toast.error("User email not found ❌");
    return;
  }

 // Validations
if (!formData.qualification) {
  toast.warning("Please select Qualification");
  return;
}

if (!formData.discipline) {
  toast.warning("Please enter Discipline");
  return;
}

if (!formData.university) {
  toast.warning("Please enter University");
  return;
}

if (!formData.passingYear) {
  toast.warning("Please enter Year of Passing");
  return;
}

if (!editItem && !formData.certificate) {
  toast.warning("Please upload Certificate");
  return;
}


  try {
    const form = new FormData();

    // Debug: Log what we're sending
    console.log("=== DEBUG: Form Data ===");
    console.log("Email:", userEmail);
    console.log("Qualification:", formData.qualification);
    console.log("Degree:", formData.degree || "");
    console.log("Discipline:", formData.discipline || "");
    console.log("University:", formData.university);
    console.log("Percentage:", formData.percentage || "");
    console.log("Registration Year:", formData.registrationYear || "");
    console.log("Passing Year:", formData.passingYear || "");
    console.log("Remarks:", formData.remarks || "");
    console.log("Certificate:", formData.certificate ? "Yes" : "No");
    console.log("Edit Item:", editItem);
    console.log("========================");

    // Append all fields - degree can be empty
    form.append("email", userEmail);
    form.append("qualification", formData.qualification);
    form.append("degree", formData.degree || ""); // Allow empty string
    form.append("discipline", formData.discipline || "");
    form.append("university", formData.university);
    
    // Ensure numbers are properly formatted
    if (formData.percentage) {
      form.append("percentage", parseFloat(formData.percentage).toString());
    } else {
      form.append("percentage", "");
    }
    
    if (formData.registrationYear) {
      form.append("registrationYear", parseInt(formData.registrationYear).toString());
    } else {
      form.append("registrationYear", "");
    }
    
    if (formData.passingYear) {
      form.append("passingYear", parseInt(formData.passingYear).toString());
    } else {
      form.append("passingYear", "");
    }
    
    form.append("remarks", formData.remarks || "");

    if (formData.certificate) {
      form.append("certificate", formData.certificate);
    }

    // Log FormData entries
    console.log("=== DEBUG: FormData Entries ===");
    for (let pair of form.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }
    console.log("==============================");

    let url, method;
    if (editItem) {
      url = `https://service-book-backend.onrender.com/qualification/${editItem._id}`;
      method = "PUT";
      console.log(`Updating qualification ID: ${editItem._id}`);
    } else {
      url = "https://service-book-backend.onrender.com/qualification";
      method = "POST";
      console.log("Adding new qualification");
    }

    const response = await axios({
      method: method,
      url: url,
      data: form,
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000 // 30 seconds timeout
    });

    console.log("=== DEBUG: Response ===");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    console.log("======================");

    toast.success(editItem ? "Qualification updated successfully ✅" : "Qualification added successfully ✅");
    setOpen(false);
    fetchQualifications();

  } catch (err) {
    console.error("=== DEBUG: Save Error Details ===");
    console.error("Full Error:", err);
    
    if (err.response) {
      // Server responded with error
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", err.response.data);
      console.error("Response Headers:", err.response.headers);
      
      // Show specific error message from server
      const errorMessage = err.response.data?.message || 
                          err.response.data?.error || 
                          err.response.statusText;
      toast.error(`Server Error (${err.response.status}): ${errorMessage}`);
    } else if (err.request) {
      // Request made but no response
      console.error("No Response Received:", err.request);
      toast.error("No response from server. Check your connection.");
    } else {
      // Error in request setup
      console.error("Request Setup Error:", err.message);
      toast.error(`Error: ${err.message}`);
    }
    console.error("================================");
  }
};

  // Delete qualification with toast confirmation
  const handleDeleteClick = (id) => {
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
        axios.delete(
          `https://service-book-backend.onrender.com/qualification/${id}`
        ),
        {
          pending: "Deleting qualification...",
          success: "Deleted successfully ✅",
          error: "Failed to delete ❌",
        }
      );

      fetchQualifications();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Edit qualification
  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      qualification: item.qualification || "",
      degree: item.degree || "",
      discipline: item.discipline || "",
      university: item.university || "",
      percentage: item.percentage || "",
      registrationYear: item.registrationYear || "",
      passingYear: item.passingYear || "",
      remarks: item.remarks || "",
      certificate: null,
    });
    setOpen(true);
  };

  // Navigation
  const handleBack = () => navigate("/GeneralDetail");
  const handleNext = () => navigate("/experience");

  // Check if qualification has degree options
  const hasDegreeOptions = () => {
    if (!formData.qualification) return false;
    const options = qualificationOptions[formData.qualification];
    return options && options.length > 0;
  };

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
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Qualification</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Degree</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Discipline</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>University</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Percentage / CGPA</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Passing Year</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : qualifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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
                    <TableCell>{q.qualification}</TableCell>
                    <TableCell>{q.degree}</TableCell>
                    <TableCell>{q.discipline || "-"}</TableCell>
                    <TableCell>{q.university}</TableCell>
                    <TableCell>{q.percentage || "-"}</TableCell>
                    <TableCell>{q.passingYear || "-"}</TableCell>
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
                          onClick={() => handleDeleteClick(q._id)}
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
      <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    width: {
      xs: "98%",
      sm: "95%",
      md: "1000px",
      lg: "1150px",
    },

    maxHeight: "95vh",
    overflowY: "auto",

    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  }}
>

          <Typography variant="h5" gutterBottom fontWeight="bold">
            {editItem ? "Edit Qualification" : "Add New Qualification"}
          </Typography>
<Grid container spacing={3}>
  {/* Qualification Dropdown */}
  <Grid item xs={12} md={4}>
    <FormControl fullWidth required variant="outlined">
      <InputLabel id="qualification-label" shrink>
        Qualification
      </InputLabel>
      <Select
        labelId="qualification-label"
        id="qualification"
        name="qualification"
        value={formData.qualification || ""}
        onChange={handleChange}
        label="Qualification"
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Qualification
        </MenuItem>
        {Object.keys(qualificationOptions).map((q) => (
          <MenuItem key={q} value={q}>
            {q}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  {/* Degree Field - ONLY DROPDOWN, NO TEXT FIELD */}
  <Grid item xs={12} md={4}>
    {hasDegreeOptions() ? (
      // Dropdown for qualifications with predefined options
      <FormControl fullWidth variant="outlined">
        <InputLabel id="degree-label" shrink={formData.degree ? true : undefined}>
          Degree
        </InputLabel>
        <Select
          labelId="degree-label"
          id="degree"
          name="degree"
          value={formData.degree || ""}
          onChange={handleChange}
          label="Degree"
          displayEmpty
        >
          <MenuItem value="">
            <em>Select Degree (Optional)</em>
          </MenuItem>
          {qualificationOptions[formData.qualification]?.map((deg) => (
            <MenuItem key={deg} value={deg}>
              {deg}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ) : (
      // Empty space or disabled field for qualifications without options
      <TextField
        label="Degree"
        value=""
        fullWidth
        disabled
        InputLabelProps={{ shrink: true }}
        placeholder="No degree options for this qualification"
        sx={{
          '& .MuiInputBase-input': {
            color: 'text.disabled',
          }
        }}
      />
    )}
  </Grid>

  {/* Discipline */}
  <Grid item xs={12} md={4}>
    <TextField
      label="Discipline"
      name="discipline"
      required
      value={formData.discipline}
      onChange={handleChange}
      fullWidth
      InputLabelProps={{ shrink: true }}
      placeholder="Eg: Computer Science, Mechanical Engineering"
    />
  </Grid>

  {/* University */}
  <Grid item xs={12} md={6}>
    <TextField
      label="University"
      name="university"
      value={formData.university}
      onChange={handleChange}
      fullWidth
      required
      InputLabelProps={{ shrink: true }}
    />
  </Grid>

  {/* Percentage */}
  <Grid item xs={12} md={6}>
    <TextField
      label="Percentage / CGPA"
      name="percentage"
      value={formData.percentage}
      onChange={handleChange}
      required
      fullWidth
      type="number"
      InputLabelProps={{ shrink: true }}
      inputProps={{ min: "0", max: "100", step: "0.01" }}
    />
  </Grid>

  {/* Registration Year */}
  <Grid item xs={12} md={6}>
    <TextField
      label="Year of Registration"
      name="registrationYear"
      value={formData.registrationYear}
      onChange={handleChange}
      fullWidth
      type="number"
      required
      InputLabelProps={{ shrink: true }}
    />
  </Grid>

  {/* Passing Year */}
  <Grid item xs={12} md={6}>
    <TextField
      label="Year of Passing"
      name="passingYear"
      value={formData.passingYear}
      onChange={handleChange}
      fullWidth
      type="number"
      required
      InputLabelProps={{ shrink: true }}
    />
  </Grid>

  {/* Remarks */}
  <Grid item xs={12}>
    <TextField
      label="Class / Distinction"
      name="remarks"
      value={formData.remarks}
      onChange={handleChange}
      fullWidth
      multiline
      rows={2}
      InputLabelProps={{ shrink: true }}
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
    {editItem?.certificate && !formData.certificate && (
      <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
        Current: {editItem.certificate}
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
    </Box>
  );
};

export default Qualification;