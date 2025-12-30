import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Updated tab labels - removed Login Details
const tabLabels = [
  "General Details",
  "Personal Details",
  "Contact Details",
  "Bank Details",
];

// Dropdown options
const titleOptions = ["Dr.", "Sr.", "Prof.", "Mr.", "Mrs.", "Ms.", "Fr."];

const categoryOptions = [
  "Teaching Staff",
  "Non Teaching Staff", 
  "Technical Staff"
];

const genderOptions = ["Male", "Female", "Other"];

const religionOptions = ["Christian", "Hindu", "Muslim", "Other"];

const contractTypeOptions = ["Regular", "Adhoc", "Adjunct"];

const departmentOptions = [
  "Artificial Intelligence and Data Science",
  "Civil Engineering",
  "Computer Science & Engineering",
  "CSE(Cyber Security)",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Mechatronics Engineering",
  "Robotics and Automation",
  "Basic Science and Humanities",
  "Administrative Office",
  "Accounts Office",
  "Project Office",
  "TBI",
  "Library",
  "Computer Centre & PRD",
  "Store"
];

const maritalStatusOptions = ["Single", "Married", "Divorced"];

const bloodGroupOptions = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Others", "Unknown"
];

const districtOptions = [
  "Thrissur",
  "Palakkad",
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
  "Other"
];

const stateOptions = ["Kerala", "Tamil Nadu", "Other"];

const Generalsetting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    dateOfJoin: "",
    dateOfBirth: "",
    religion: "",
    staffId: "",
    gender: "",
    employeeId: "",
    bloodGroup: "",
    caste: "",
    department: "",
    designation: "",
    contractType: "",
    category: "",
    institutionLastWorked: "",
    ktuId: "",
    penNo: "",
    maritalStatus: "",
    motherName: "",
    fatherName: "",
    spouseName: "",
    nationality: "",
    
    // Present Address
    presentHouseName: "",
    presentStreet: "",
    presentPost: "",
    presentDistrict: "",
    presentPin: "",
    presentState: "",
    
    // Permanent Address
    permanentHouseName: "",
    permanentStreet: "",
    permanentPost: "",
    permanentDistrict: "",
    permanentPin: "",
    permanentState: "",
    sameAsPresent: false,
    
    phone: "",
    phoneRes: "",
    email: "",
    officeAddress: "",
    bankName: "",
    accountNo: "",
    bankBranch: "",
    ifsc: "",
    username: localStorage.getItem("username") || "",
    password: "",
  });

  const requiredFields = [
    "title",
    "name",
    "dateOfJoin",
    "dateOfBirth",
    "staffId",
    "department",
    "designation",
    "presentHouseName",
    "presentDistrict",
    "presentPin",
    "presentState",
    "bankName",
    "accountNo",
    "bankBranch",
    "ifsc",
  ];

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(true); // Set to true by default
  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [hasData, setHasData] = useState(false);

  // ✅ Fetch only logged-in user's records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const username = localStorage.getItem("username");
      
      if (!username) {
        toast.error("User not logged in");
        setLoading(false);
        return;
      }
      
      // Pass username as query parameter
      const res = await axios.get(`https://service-book-backend.onrender.com/api/general-details?username=${username}`);
      if (res.data && res.data.length > 0) {
        setRecords(res.data);
        setHasData(true);
        
        // If user has data, populate the form with first record for editing
        if (res.data[0]) {
          setFormData(res.data[0]);
        }
      } else {
        setHasData(false);
        setRecords([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ✅ Handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: checked 
      }));
      
      // If "same as present" is checked, copy present address to permanent
      if (name === 'sameAsPresent' && checked) {
        setFormData(prev => ({
          ...prev,
          sameAsPresent: true,
          permanentHouseName: prev.presentHouseName,
          permanentStreet: prev.presentStreet,
          permanentPost: prev.presentPost,
          permanentDistrict: prev.presentDistrict,
          permanentPin: prev.presentPin,
          permanentState: prev.presentState,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // If sameAsPresent is true and we're editing present address, update permanent too
      if (formData.sameAsPresent && name.startsWith('present')) {
        const permField = name.replace('present', 'permanent');
        setFormData((prev) => ({ ...prev, [permField]: value }));
      }
    }
    
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Copy Present to Permanent manually
  const handleCopyAddress = () => {
    setFormData(prev => ({
      ...prev,
      permanentHouseName: prev.presentHouseName,
      permanentStreet: prev.presentStreet,
      permanentPost: prev.presentPost,
      permanentDistrict: prev.presentDistrict,
      permanentPin: prev.presentPin,
      permanentState: prev.presentState,
    }));
    toast.info("Address copied to Permanent Address");
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "Required";
      }
    });
    
    // Validate PIN codes
    if (formData.presentPin && !/^\d{6}$/.test(formData.presentPin)) {
      newErrors.presentPin = "Invalid PIN (6 digits required)";
    }
    if (formData.permanentPin && !/^\d{6}$/.test(formData.permanentPin)) {
      newErrors.permanentPin = "Invalid PIN (6 digits required)";
    }
    
    // Validate email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    
    // Validate phone numbers
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Invalid phone number (10 digits required)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit new record
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);

      const username = localStorage.getItem("username");
      
      if (!username) {
        toast.error("User not logged in");
        setLoading(false);
        return;
      }
      
      // Create a clean copy of formData with username
      const sendData = { 
        ...formData,
        username,
      };

      const res = await axios.post(
        "https://service-book-backend.onrender.com/api/general-details",
        sendData
      );

      if (res.data.success) {
        toast.success("✅ Saved Successfully");
        // Reset form
        setFormData({
          title: "",
          name: "",
          dateOfJoin: "",
          dateOfBirth: "",
          religion: "",
          staffId: "",
          gender: "",
          employeeId: "",
          bloodGroup: "",
          caste: "",
          department: "",
          designation: "",
          contractType: "",
          category: "",
          institutionLastWorked: "",
          ktuId: "",
          penNo: "",
          maritalStatus: "",
          motherName: "",
          fatherName: "",
          spouseName: "",
          nationality: "",
          presentHouseName: "",
          presentStreet: "",
          presentPost: "",
          presentDistrict: "",
          presentPin: "",
          presentState: "",
          permanentHouseName: "",
          permanentStreet: "",
          permanentPost: "",
          permanentDistrict: "",
          permanentPin: "",
          permanentState: "",
          sameAsPresent: false,
          phone: "",
          phoneRes: "",
          email: "",
          officeAddress: "",
          bankName: "",
          accountNo: "",
          bankBranch: "",
          ifsc: "",
          username: username,
          password: "",
        });
        fetchRecords();
        setViewMode(true); // Switch to view mode after saving
      } else {
        toast.error("❌ Failed to save details!");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("❌ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update record
  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(
        `https://service-book-backend.onrender.com/api/general-details/${id}`,
        updatedData
      );
      toast.success("✅ Updated Successfully!");
      fetchRecords();
      setEditIndex(null);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Update Failed!");
    }
  };

  // ✅ Download Excel for Admin
  const handleDownloadExcel = async () => {
    try {
      const username = localStorage.getItem("username");
      const userRole = localStorage.getItem("role"); // assuming you store role
      
      if (userRole !== "admin") {
        toast.error("Access denied. Admin only feature.");
        return;
      }
      
      setLoading(true);
      const response = await axios.get(
        "https://service-book-backend.onrender.com/api/general/get",
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `General_Details_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("✅ Excel file downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("❌ Failed to download Excel file");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render dropdown field
  const renderDropdown = (label, name, options, required = false) => (
    <Grid item xs={12} sm={6} key={name}>
      <FormControl fullWidth size="small" error={!!errors[name]}>
        <InputLabel 
          id={`${name}-label`}
          sx={{
            fontSize: '0.9rem',
            backgroundColor: 'white',
            padding: '0 4px',
            transform: 'translate(14px, -9px) scale(0.75)',
            '&.Mui-focused': {
              color: '#1976d2',
            }
          }}
        >
          {label}{required ? " *" : ""}
        </InputLabel>
        <Select
          labelId={`${name}-label`}
          label={label}
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          required={required}
          displayEmpty
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            }
          }}
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: '#888' }}>Select {label}</span>;
            }
            return selected;
          }}
        >
          <MenuItem value="">
            <em style={{ color: '#888' }}>Select {label}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {errors[name] && (
          <Typography variant="caption" color="error" sx={{ ml: 2 }}>
            {errors[name]}
          </Typography>
        )}
      </FormControl>
    </Grid>
  );

  // ✅ Render text field
  const renderTextField = (label, name, type = "text", required = false) => (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label={label}
        name={name}
        type={type}
        value={formData[name] || ""}
        onChange={handleChange}
        size="small"
        error={!!errors[name]}
        helperText={errors[name]}
        required={required}
        InputLabelProps={type === "date" ? { shrink: true } : {}}
      />
    </Grid>
  );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f3f8ff 0%, #e5efff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflowY: "auto",
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "1200px" }}
      >
        <Paper
          elevation={5}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid #d3e0ff",
            boxShadow: "0 4px 20px rgba(30, 90, 180, 0.08)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#0b3d91" }}
            >
              Staff General Details
            </Typography>
            
            <Box display="flex" gap={2}>
              {viewMode && localStorage.getItem("role") === "admin" && (
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadExcel}
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                    borderRadius: 2,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  Download Excel
                </Button>
              )}
              
              <Button
                variant={viewMode ? "contained" : "outlined"}
                onClick={() => {
                  setViewMode(!viewMode);
                  if (viewMode && hasData) {
                    // When switching to edit mode, populate form with existing data
                    if (records.length > 0) {
                      setFormData(records[0]);
                    }
                  }
                }}
                startIcon={viewMode ? <EditNoteIcon /> : <VisibilityIcon />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  background: viewMode ? "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)" : "transparent",
                  color: viewMode ? "white" : "#1976d2",
                  borderColor: "#1976d2",
                  '&:hover': {
                    background: viewMode ? "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)" : "rgba(25, 118, 210, 0.04)",
                  }
                }}
              >
                {viewMode ? "Edit Details" : "View Details"}
              </Button>
            </Box>
          </Box>

          {/* Display current logged-in user */}
          <Alert severity="info" sx={{ mb: 2 }}>
            Logged in as: <strong>{localStorage.getItem("username") || "Not logged in"}</strong>
            {hasData && records.length > 0 && (
              <span> | Records found: {records.length}</span>
            )}
          </Alert>

          {/* ===== View Mode ===== */}
          {viewMode ? (
            loading ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading your data...</Typography>
              </Box>
            ) : !hasData ? (
              <Alert severity="warning" sx={{ mb: 3 }}>
                No profile data found. Click "Edit Details" to create your profile.
              </Alert>
            ) : (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Showing your profile details. Click "Edit Details" to make changes.
                </Alert>
                
                {records.map((record, index) => (
                  <Accordion key={record._id || index} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600, color: "#0b3d91" }}>
                        {record.name || "Unnamed"} – {record.department} – {record.staffId}
                        {editIndex === index && (
                          <span style={{ color: "#d32f2f", marginLeft: 8, fontSize: "0.875rem" }}>
                            (Editing...)
                          </span>
                        )}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* View/Edit mode for each record */}
                      {editIndex === index ? (
                        // Edit Form for this record
                        <>
                          <Tabs
                            value={activeTab}
                            onChange={(e, val) => setActiveTab(val)}
                            centered
                            variant="scrollable"
                            allowScrollButtonsMobile
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{
                              mb: 4,
                              "& .MuiTab-root": {
                                fontWeight: 600,
                                color: "#0b3d91",
                                textTransform: "none",
                                fontSize: "0.95rem",
                                borderRadius: "10px",
                                mx: 1,
                              },
                              "& .Mui-selected": {
                                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                color: "#fff !important",
                                boxShadow: "0 2px 6px rgba(25,118,210,0.3)",
                              },
                            }}
                          >
                            {tabLabels.map((label) => (
                              <Tab key={label} label={label} />
                            ))}
                          </Tabs>

                          {activeTab === 0 && (
                            <FormSection title="General Details">
                              <Grid container spacing={2}>
                                {renderDropdown("Title", "title", titleOptions, true)}
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={records[index].name || ""}
                                    onChange={(e) => {
                                      const updated = {
                                        ...records[index],
                                        name: e.target.value,
                                      };
                                      setRecords((prev) => {
                                        const copy = [...prev];
                                        copy[index] = updated;
                                        return copy;
                                      });
                                    }}
                                    size="small"
                                    required
                                  />
                                </Grid>
                                {renderTextField("Date of Join", "dateOfJoin", "date", true)}
                                {renderTextField("Date of Birth", "dateOfBirth", "date", true)}
                                {renderDropdown("Religion", "religion", religionOptions, true)}
                                {renderTextField("Staff ID", "staffId", "text", true)}
                                {renderDropdown("Gender", "gender", genderOptions, true)}
                                {renderTextField("Employee ID", "employeeId", "text")}
                                {renderDropdown("Blood Group", "bloodGroup", bloodGroupOptions)}
                                {renderTextField("Caste", "caste", "text")}
                                {renderDropdown("Department", "department", departmentOptions, true)}
                                {renderTextField("Designation", "designation", "text", true)}
                                {renderDropdown("Contract Type", "contractType", contractTypeOptions)}
                                {renderDropdown("Category", "category", categoryOptions)}
                                {renderTextField("Institution Last Worked", "institutionLastWorked", "text")}
                                {renderTextField("KTU ID", "ktuId", "text")}
                                {renderTextField("AICTE ID", "penNo", "text")}
                              </Grid>
                            </FormSection>
                          )}

                          {activeTab === 1 && (
                            <FormSection title="Personal Details">
                              <Grid container spacing={2}>
                                {renderDropdown("Marital Status", "maritalStatus", maritalStatusOptions)}
                                {renderTextField("Mother Name", "motherName", "text")}
                                {renderTextField("Father Name", "fatherName", "text")}
                                {renderTextField("Spouse Name", "spouseName", "text")}
                                {renderTextField("Nationality", "nationality", "text")}
                              </Grid>
                            </FormSection>
                          )}

                          {activeTab === 2 && (
                            <FormSection title="Contact Details">
                              <Alert severity="info" sx={{ mb: 3 }}>
                                Please fill in both Present and Permanent addresses. Check the box if they are the same.
                              </Alert>
                              
                              <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
                                Present Address
                              </Typography>
                              <Grid container spacing={2}>
                                {renderTextField("House Name", "presentHouseName", "text", true)}
                                {renderTextField("Street", "presentStreet", "text")}
                                {renderTextField("Post", "presentPost", "text")}
                                {renderDropdown("District", "presentDistrict", districtOptions, true)}
                                {renderTextField("PIN", "presentPin", "text", true)}
                                {renderDropdown("State", "presentState", stateOptions, true)}
                              </Grid>
                              
                              <Box sx={{ mt: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={records[index].sameAsPresent || false}
                                      onChange={(e) => {
                                        const updated = {
                                          ...records[index],
                                          sameAsPresent: e.target.checked,
                                        };
                                        setRecords((prev) => {
                                          const copy = [...prev];
                                          copy[index] = updated;
                                          return copy;
                                        });
                                      }}
                                    />
                                  }
                                  label="Permanent address same as present address"
                                />
                                
                                <Button
                                  variant="outlined"
                                  startIcon={<ContentCopyIcon />}
                                  onClick={() => {
                                    const updated = {
                                      ...records[index],
                                      permanentHouseName: records[index].presentHouseName,
                                      permanentStreet: records[index].presentStreet,
                                      permanentPost: records[index].presentPost,
                                      permanentDistrict: records[index].presentDistrict,
                                      permanentPin: records[index].presentPin,
                                      permanentState: records[index].presentState,
                                    };
                                    setRecords((prev) => {
                                      const copy = [...prev];
                                      copy[index] = updated;
                                      return copy;
                                    });
                                  }}
                                  sx={{ ml: 2 }}
                                >
                                  Copy to Permanent
                                </Button>
                              </Box>
                              
                              <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
                                Permanent Address
                              </Typography>
                              <Grid container spacing={2}>
                                {renderTextField("House Name", "permanentHouseName", "text")}
                                {renderTextField("Street", "permanentStreet", "text")}
                                {renderTextField("Post", "permanentPost", "text")}
                                {renderDropdown("District", "permanentDistrict", districtOptions)}
                                {renderTextField("PIN", "permanentPin", "text")}
                                {renderDropdown("State", "permanentState", stateOptions)}
                              </Grid>
                              
                              <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "#1976d2", fontWeight: 600 }}>
                                Contact Information
                              </Typography>
                              <Grid container spacing={2}>
                                {renderTextField("Phone", "phone", "tel")}
                                {renderTextField("Phone (RES)", "phoneRes", "tel")}
                                {renderTextField("Email", "email", "email")}
                                {renderTextField("Office Address", "officeAddress", "text")}
                              </Grid>
                            </FormSection>
                          )}

                          {activeTab === 3 && (
                            <FormSection title="Bank Details">
                              <Grid container spacing={2}>
                                {renderTextField("Bank Name", "bankName", "text", true)}
                                {renderTextField("Account No.", "accountNo", "text", true)}
                                {renderTextField("Bank Branch", "bankBranch", "text", true)}
                                {renderTextField("IFSC Code", "ifsc", "text", true)}
                              </Grid>
                            </FormSection>
                          )}

                          <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
                            <Button
                              disabled={activeTab === 0}
                              onClick={() => setActiveTab((prev) => prev - 1)}
                              variant="outlined"
                              sx={{
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                textTransform: "none",
                                color: "#1976d2",
                                borderColor: "#1976d2",
                                borderRadius: 2,
                              }}
                            >
                              ← Back
                            </Button>

                            {activeTab < tabLabels.length - 1 ? (
                              <Button
                                onClick={() => setActiveTab((prev) => prev + 1)}
                                variant="contained"
                                sx={{
                                  px: 4,
                                  py: 1,
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                }}
                              >
                                Next →
                              </Button>
                            ) : (
                              <Box display="flex" gap={2}>
                                <Button
                                  variant="outlined"
                                  onClick={() => setEditIndex(null)}
                                  sx={{
                                    color: "#d32f2f",
                                    borderColor: "#d32f2f",
                                    borderRadius: 2,
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => handleUpdate(record._id, records[index])}
                                  sx={{
                                    background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
                                    borderRadius: 2,
                                  }}
                                >
                                  Save Changes
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </>
                      ) : (
                        // View mode for this record
                        <>
                          <Grid container spacing={2}>
                            {/* General Information */}
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                                General Information
                              </Typography>
                            </Grid>
                            
                            {["title", "name", "dateOfJoin", "dateOfBirth", "religion", "staffId", "gender", "employeeId", "bloodGroup", "caste"].map(field => (
                              <Grid item xs={12} sm={6} md={4} key={field}>
                                <Box sx={{ p: 1.5, border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#fafafa" }}>
                                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </Typography>
                                  <Typography variant="body1">
                                    {record[field] || <span style={{ color: "#999", fontStyle: "italic" }}>Not provided</span>}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                            
                            <Grid item xs={12}>
                              <Divider sx={{ my: 2 }} />
                            </Grid>
                            
                            {/* Employment Details */}
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                                Employment Details
                              </Typography>
                            </Grid>
                            
                            {["department", "designation", "contractType", "category", "institutionLastWorked", "ktuId", "penNo"].map(field => (
                              <Grid item xs={12} sm={6} md={4} key={field}>
                                <Box sx={{ p: 1.5, border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#fafafa" }}>
                                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </Typography>
                                  <Typography variant="body1">
                                    {record[field] || <span style={{ color: "#999", fontStyle: "italic" }}>Not provided</span>}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                            
                            <Grid item xs={12}>
                              <Divider sx={{ my: 2 }} />
                            </Grid>
                            
                            {/* Personal Details */}
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                                Personal Details
                              </Typography>
                            </Grid>
                            
                            {["maritalStatus", "motherName", "fatherName", "spouseName", "nationality"].map(field => (
                              <Grid item xs={12} sm={6} md={4} key={field}>
                                <Box sx={{ p: 1.5, border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#fafafa" }}>
                                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </Typography>
                                  <Typography variant="body1">
                                    {record[field] || <span style={{ color: "#999", fontStyle: "italic" }}>Not provided</span>}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                            
                            <Grid item xs={12}>
                              <Divider sx={{ my: 2 }} />
                            </Grid>
                            
                            {/* Address & Contact Details */}
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                                Address & Contact Details
                              </Typography>
                            </Grid>
                            
                            {["presentHouseName", "presentDistrict", "presentPin", "presentState", "permanentHouseName", "permanentDistrict", "permanentPin", "permanentState", "phone", "email", "officeAddress", "bankName", "accountNo", "bankBranch", "ifsc"].map(field => (
                              <Grid item xs={12} sm={6} md={4} key={field}>
                                <Box sx={{ p: 1.5, border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#fafafa" }}>
                                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </Typography>
                                  <Typography variant="body1">
                                    {record[field] || <span style={{ color: "#999", fontStyle: "italic" }}>Not provided</span>}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                          
                          <Box textAlign="right" mt={2}>
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setEditIndex(index);
                                setActiveTab(0); // Reset to first tab when editing
                              }}
                              sx={{
                                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                color: "white",
                                '&:hover': {
                                  background: "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
                                }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </>
            )
          ) : (
            // ===== Edit/Add Mode =====
            <>
              {/* Tab navigation for editing */}
              <Tabs
                value={activeTab}
                onChange={(e, val) => setActiveTab(val)}
                centered
                variant="scrollable"
                allowScrollButtonsMobile
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  mb: 4,
                  "& .MuiTab-root": {
                    fontWeight: 600,
                    color: "#0b3d91",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    borderRadius: "10px",
                    mx: 1,
                  },
                  "& .Mui-selected": {
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                    color: "#fff !important",
                    boxShadow: "0 2px 6px rgba(25,118,210,0.3)",
                  },
                }}
              >
                {tabLabels.map((label) => (
                  <Tab key={label} label={label} />
                ))}
              </Tabs>

              {/* Tab content */}
              {activeTab === 0 && (
                <FormSection title="General Details">
                  <Grid container spacing={2}>
                    {renderDropdown("Title", "title", titleOptions, true)}
                    {renderTextField("Name", "name", "text", true)}
                    {renderTextField("Date of Join", "dateOfJoin", "date", true)}
                    {renderTextField("Date of Birth", "dateOfBirth", "date", true)}
                    {renderDropdown("Religion", "religion", religionOptions, true)}
                    {renderTextField("Staff ID", "staffId", "text", true)}
                    {renderDropdown("Gender", "gender", genderOptions, true)}
                    {renderTextField("Employee ID", "employeeId", "text")}
                    {renderDropdown("Blood Group", "bloodGroup", bloodGroupOptions)}
                    {renderTextField("Caste", "caste", "text")}
                    {renderDropdown("Department", "department", departmentOptions, true)}
                    {renderTextField("Designation", "designation", "text", true)}
                    {renderDropdown("Contract Type", "contractType", contractTypeOptions)}
                    {renderDropdown("Category", "category", categoryOptions)}
                    {renderTextField("Institution Last Worked", "institutionLastWorked", "text")}
                    {renderTextField("KTU ID", "ktuId", "text")}
                    {renderTextField("AICTE ID", "penNo", "text")}
                  </Grid>
                </FormSection>
              )}

              {activeTab === 1 && (
                <FormSection title="Personal Details">
                  <Grid container spacing={2}>
                    {renderDropdown("Marital Status", "maritalStatus", maritalStatusOptions)}
                    {renderTextField("Mother Name", "motherName", "text")}
                    {renderTextField("Father Name", "fatherName", "text")}
                    {renderTextField("Spouse Name", "spouseName", "text")}
                    {renderTextField("Nationality", "nationality", "text")}
                  </Grid>
                </FormSection>
              )}

              {activeTab === 2 && (
                <FormSection title="Contact Details">
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Please fill in both Present and Permanent addresses. Check the box if they are the same.
                  </Alert>
                  
                  <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
                    Present Address
                  </Typography>
                  <Grid container spacing={2}>
                    {renderTextField("House Name", "presentHouseName", "text", true)}
                    {renderTextField("Street", "presentStreet", "text")}
                    {renderTextField("Post", "presentPost", "text")}
                    {renderDropdown("District", "presentDistrict", districtOptions, true)}
                    {renderTextField("PIN", "presentPin", "text", true)}
                    {renderDropdown("State", "presentState", stateOptions, true)}
                  </Grid>
                  
                  <Box sx={{ mt: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.sameAsPresent}
                          onChange={handleChange}
                          name="sameAsPresent"
                          color="primary"
                        />
                      }
                      label="Permanent address same as present address"
                    />
                    
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopyAddress}
                      sx={{ ml: 2 }}
                    >
                      Copy to Permanent
                    </Button>
                  </Box>
                  
                  <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
                    Permanent Address
                  </Typography>
                  <Grid container spacing={2}>
                    {renderTextField("House Name", "permanentHouseName", "text")}
                    {renderTextField("Street", "permanentStreet", "text")}
                    {renderTextField("Post", "permanentPost", "text")}
                    {renderDropdown("District", "permanentDistrict", districtOptions)}
                    {renderTextField("PIN", "permanentPin", "text")}
                    {renderDropdown("State", "permanentState", stateOptions)}
                  </Grid>
                  
                  <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "#1976d2", fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    {renderTextField("Phone", "phone", "tel")}
                    {renderTextField("Phone (RES)", "phoneRes", "tel")}
                    {renderTextField("Email", "email", "email")}
                    {renderTextField("Office Address", "officeAddress", "text")}
                  </Grid>
                </FormSection>
              )}

              {activeTab === 3 && (
                <FormSection title="Bank Details">
                  <Grid container spacing={2}>
                    {renderTextField("Bank Name", "bankName", "text", true)}
                    {renderTextField("Account No.", "accountNo", "text", true)}
                    {renderTextField("Bank Branch", "bankBranch", "text", true)}
                    {renderTextField("IFSC Code", "ifsc", "text", true)}
                  </Grid>
                </FormSection>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
                <Button
                  disabled={activeTab === 0}
                  onClick={() => setActiveTab((prev) => prev - 1)}
                  variant="outlined"
                  sx={{
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    color: "#1976d2",
                    borderColor: "#1976d2",
                    borderRadius: 2,
                  }}
                >
                  ← Back
                </Button>

                {activeTab < tabLabels.length - 1 ? (
                  <Button
                    onClick={() => setActiveTab((prev) => prev + 1)}
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1,
                      fontWeight: 600,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                    }}
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1,
                      fontWeight: 600,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
                    }}
                  >
                    {loading ? "Saving..." : hasData ? "Update Profile" : "Save Profile"}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

// ===== Section Wrapper =====
const FormSection = ({ title, children }) => (
  <Box sx={{ mt: 2 }}>
    <Typography
      variant="h6"
      sx={{
        mb: 2,
        fontWeight: 700,
        color: "#0b3d91",
        borderLeft: "4px solid #1976d2",
        pl: 1.5,
        textTransform: "uppercase",
        background: "linear-gradient(to right, #eaf2ff 0%, #ffffff 100%)",
        py: 0.5,
        borderRadius: 1,
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

export default Generalsetting;