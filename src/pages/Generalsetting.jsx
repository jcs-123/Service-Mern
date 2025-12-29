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
  const [viewMode, setViewMode] = useState(false);
  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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
      setRecords(res.data || []);
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

  // ✅ Submit new record - UPDATED VERSION
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

      console.log("Sending data:", sendData);

      const res = await axios.post(
        "https://service-book-backend.onrender.com/api/general-details",
        sendData
      );

      console.log("Response from server:", res.data);

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
        // ✅ Navigate to Qualification page after success
        setTimeout(() => navigate("/Qualification"), 1200);
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

  // Render dropdown field for Add mode with full visible labels
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

  // Render dropdown for view/edit mode with full visible labels
  const renderViewDropdown = (label, name, options, record, index) => (
    <Grid item xs={12} sm={6} md={4} key={name}>
      <FormControl fullWidth size="small">
        <InputLabel 
          id={`${name}-view-label`}
          sx={{
            fontSize: '0.9rem',
            backgroundColor: editIndex === index ? 'white' : 'transparent',
            padding: '0 4px',
            transform: 'translate(14px, -9px) scale(0.75)',
          }}
        >
          {label}
        </InputLabel>
        <Select
          labelId={`${name}-view-label`}
          label={label}
          name={name}
          value={record[name] || ""}
          disabled={editIndex !== index}
          onChange={(e) => {
            const updated = {
              ...record,
              [name]: e.target.value,
            };
            setRecords((prev) => {
              const copy = [...prev];
              copy[index] = updated;
              return copy;
            });
          }}
          displayEmpty
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
      </FormControl>
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
                variant="outlined"
                onClick={() => {
                  setViewMode(!viewMode);
                  if (!viewMode) {
                    fetchRecords(); // Refresh data when switching to view mode
                  }
                }}
                sx={{
                  color: "#1976d2",
                  borderColor: "#1976d2",
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {viewMode ? "➕ Add New" : "📋 View / Edit Details"}
              </Button>
            </Box>
          </Box>

          {/* Display current logged-in user */}
          {/* <Alert severity="info" sx={{ mb: 2 }}>
            Logged in as: <strong>{localStorage.getItem("username") || "Not logged in"}</strong>
          </Alert> */}

          {/* ===== View/Edit Mode ===== */}
          {viewMode ? (
            loading ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
              </Box>
            ) : records.length === 0 ? (
              <Alert severity="info">
                No records found for your account. Click "Add New" to create your profile.
              </Alert>
            ) : (
              <>
                {/* <Alert severity="success" sx={{ mb: 2 }}>
                  Showing {records.length} record(s) for your account.
                </Alert> */}
                
                {records.map((record, index) => (
                  <Accordion key={record._id || index} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600, color: "#0b3d91" }}>
                        {record.name || "Unnamed"} – {record.department} – {record.staffId}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {/* General Information Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            General Information
                          </Typography>
                        </Grid>
                        
                        {/* Title Dropdown */}
                        {renderViewDropdown("Title", "title", titleOptions, record, index)}
                        
                        {/* Name Field */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Name"
                            fullWidth
                            size="small"
                            name="name"
                            value={record.name || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                name: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Date Fields */}
                        {["Date of Join", "Date of Birth"].map((label) => (
                          <Grid item xs={12} sm={6} md={4} key={label}>
                            <TextField
                              label={label}
                              fullWidth
                              size="small"
                              name={label === "Date of Join" ? "dateOfJoin" : "dateOfBirth"}
                              type="date"
                              value={record[label === "Date of Join" ? "dateOfJoin" : "dateOfBirth"] || ""}
                              disabled={editIndex !== index}
                              onChange={(e) => {
                                const name = label === "Date of Join" ? "dateOfJoin" : "dateOfBirth";
                                const updated = {
                                  ...record,
                                  [name]: e.target.value,
                                };
                                setRecords((prev) => {
                                  const copy = [...prev];
                                  copy[index] = updated;
                                  return copy;
                                });
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        ))}
                        
                        {/* Religion Dropdown */}
                        {renderViewDropdown("Religion", "religion", religionOptions, record, index)}
                        
                        {/* Staff ID */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Staff ID"
                            fullWidth
                            size="small"
                            name="staffId"
                            value={record.staffId || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                staffId: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Gender Dropdown */}
                        {renderViewDropdown("Gender", "gender", genderOptions, record, index)}
                        
                        {/* Employee ID (Optional) */}
                        {/* <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Employee ID"
                            fullWidth
                            size="small"
                            name="employeeId"
                            value={record.employeeId || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                employeeId: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                         */}
                        {/* Blood Group Dropdown */}
                        {renderViewDropdown("Blood Group", "bloodGroup", bloodGroupOptions, record, index)}
                        
                        {/* Caste Field */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Caste"
                            fullWidth
                            size="small"
                            name="caste"
                            value={record.caste || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                caste: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Department Dropdown */}
                        {renderViewDropdown("Department", "department", departmentOptions, record, index)}
                        
                        {/* Designation Field */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Designation"
                            fullWidth
                            size="small"
                            name="designation"
                            value={record.designation || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                designation: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Contract Type Dropdown */}
                        {renderViewDropdown("Contract Type", "contractType", contractTypeOptions, record, index)}
                        
                        {/* Category Dropdown */}
                        {renderViewDropdown("Category", "category", categoryOptions, record, index)}
                        
                        {/* Institution Last Worked */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Institution Last Worked"
                            fullWidth
                            size="small"
                            name="institutionLastWorked"
                            value={record.institutionLastWorked || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                institutionLastWorked: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* KTU ID */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="KTU ID"
                            fullWidth
                            size="small"
                            name="ktuId"
                            value={record.ktuId || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                ktuId: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* AICTE ID */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="AICTE ID"
                            fullWidth
                            size="small"
                            name="penNo"
                            value={record.penNo || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                penNo: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Personal Details Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Personal Details
                          </Typography>
                        </Grid>
                        
                        {/* Marital Status Dropdown */}
                        {renderViewDropdown("Marital Status", "maritalStatus", maritalStatusOptions, record, index)}
                        
                        {/* Mother Name */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Mother Name"
                            fullWidth
                            size="small"
                            name="motherName"
                            value={record.motherName || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                motherName: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Father Name */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Father Name"
                            fullWidth
                            size="small"
                            name="fatherName"
                            value={record.fatherName || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                fatherName: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Spouse Name */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Spouse Name"
                            fullWidth
                            size="small"
                            name="spouseName"
                            value={record.spouseName || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                spouseName: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Nationality */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Nationality"
                            fullWidth
                            size="small"
                            name="nationality"
                            value={record.nationality || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                nationality: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Present Address Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Present Address
                          </Typography>
                        </Grid>
                        
                        {/* House Name */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="House Name"
                            fullWidth
                            size="small"
                            name="presentHouseName"
                            value={record.presentHouseName || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                presentHouseName: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Street */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Street"
                            fullWidth
                            size="small"
                            name="presentStreet"
                            value={record.presentStreet || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                presentStreet: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Post */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Post"
                            fullWidth
                            size="small"
                            name="presentPost"
                            value={record.presentPost || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                presentPost: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* District Dropdown */}
                        {renderViewDropdown("District", "presentDistrict", districtOptions, record, index)}
                        
                        {/* PIN */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="PIN"
                            fullWidth
                            size="small"
                            name="presentPin"
                            value={record.presentPin || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                presentPin: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* State Dropdown */}
                        {renderViewDropdown("State", "presentState", stateOptions, record, index)}
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Permanent Address Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Permanent Address
                          </Typography>
                        </Grid>
                        
                        {/* Same as Present Checkbox */}
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={record.sameAsPresent || false}
                                onChange={(e) => {
                                  const updated = {
                                    ...record,
                                    sameAsPresent: e.target.checked,
                                  };
                                  setRecords((prev) => {
                                    const copy = [...prev];
                                    copy[index] = updated;
                                    return copy;
                                  });
                                }}
                                disabled={editIndex !== index}
                                color="primary"
                              />
                            }
                            label="Same as Present Address"
                          />
                        </Grid>
                        
                        {/* House Name */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="House Name"
                            fullWidth
                            size="small"
                            name="permanentHouseName"
                            value={record.permanentHouseName || ""}
                            disabled={editIndex !== index || (record.sameAsPresent || false)}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                permanentHouseName: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Street */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Street"
                            fullWidth
                            size="small"
                            name="permanentStreet"
                            value={record.permanentStreet || ""}
                            disabled={editIndex !== index || (record.sameAsPresent || false)}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                permanentStreet: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Post */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Post"
                            fullWidth
                            size="small"
                            name="permanentPost"
                            value={record.permanentPost || ""}
                            disabled={editIndex !== index || (record.sameAsPresent || false)}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                permanentPost: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* District Dropdown */}
                        {renderViewDropdown("District", "permanentDistrict", districtOptions, record, index)}
                        
                        {/* PIN */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="PIN"
                            fullWidth
                            size="small"
                            name="permanentPin"
                            value={record.permanentPin || ""}
                            disabled={editIndex !== index || (record.sameAsPresent || false)}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                permanentPin: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* State Dropdown */}
                        {renderViewDropdown("State", "permanentState", stateOptions, record, index)}
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Contact Information Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Contact Information
                          </Typography>
                        </Grid>
                        
                        {/* Phone */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Phone"
                            fullWidth
                            size="small"
                            name="phone"
                            value={record.phone || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                phone: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Phone (RES) */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Phone (RES)"
                            fullWidth
                            size="small"
                            name="phoneRes"
                            value={record.phoneRes || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                phoneRes: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Email */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Email"
                            fullWidth
                            size="small"
                            name="email"
                            value={record.email || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                email: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Office Address */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Office Address"
                            fullWidth
                            size="small"
                            name="officeAddress"
                            value={record.officeAddress || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                officeAddress: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Bank Details Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Bank Details
                          </Typography>
                        </Grid>
                        
                        {/* Bank Name */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Bank Name"
                            fullWidth
                            size="small"
                            name="bankName"
                            value={record.bankName || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                bankName: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Account No. */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Account No."
                            fullWidth
                            size="small"
                            name="accountNo"
                            value={record.accountNo || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                accountNo: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* Bank Branch */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Bank Branch"
                            fullWidth
                            size="small"
                            name="bankBranch"
                            value={record.bankBranch || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                bankBranch: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* IFSC Code */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="IFSC Code"
                            fullWidth
                            size="small"
                            name="ifsc"
                            value={record.ifsc || ""}
                            disabled={editIndex !== index}
                            onChange={(e) => {
                              const updated = {
                                ...record,
                                ifsc: e.target.value,
                              };
                              setRecords((prev) => {
                                const copy = [...prev];
                                copy[index] = updated;
                                return copy;
                              });
                            }}
                          />
                        </Grid>
                        
                        {/* User Info */}
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            label="Username"
                            fullWidth
                            size="small"
                            name="username"
                            value={record.username || ""}
                            disabled={true}
                          />
                        </Grid>
                      </Grid>
                      
                      <Box textAlign="right" mt={2}>
                        {editIndex === index ? (
                          <Box display="flex" gap={2} justifyContent="flex-end">
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
                              startIcon={<SaveIcon />}
                              onClick={() =>
                                handleUpdate(record._id, records[index])
                              }
                              sx={{
                                background:
                                  "linear-gradient(135deg,#2e7d32,#66bb6a)",
                                borderRadius: 2,
                              }}
                            >
                              Save Changes
                            </Button>
                          </Box>
                        ) : (
                          <IconButton
                            color="primary"
                            onClick={() => setEditIndex(index)}
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
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </>
            )
          ) : (
            <>
              {/* ===== Tab Form ===== */}
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
                    background:
                      "linear-gradient(135deg, #1976d2, #42a5f5)",
                    color: "#fff !important",
                    boxShadow: "0 2px 6px rgba(25,118,210,0.3)",
                  },
                }}
              >
                {tabLabels.map((label) => (
                  <Tab key={label} label={label} />
                ))}
              </Tabs>

              {/* ===== Tabs Content ===== */}
              {activeTab === 0 && (
                <FormSection title="General Details">
                  <Grid container spacing={2}>
                    {/* Title Dropdown */}
                    {renderDropdown("Title", "title", titleOptions, true)}
                    
                    {/* Name Field */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                      />
                    </Grid>
                    
                    {/* Date of Join */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Date of Join"
                        name="dateOfJoin"
                        value={formData.dateOfJoin || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.dateOfJoin}
                        helperText={errors.dateOfJoin}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    
                    {/* Date of Birth */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Date of Birth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    
                    {/* Religion Dropdown */}
                    {renderDropdown("Religion", "religion", religionOptions, true)}
                    
                    {/* Staff ID */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Staff ID"
                        name="staffId"
                        value={formData.staffId || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.staffId}
                        helperText={errors.staffId}
                        required
                      />
                    </Grid>
                    
                    {/* Gender Dropdown */}
                    {renderDropdown("Gender", "gender", genderOptions, true)}
                    
                    {/* Employee ID (Optional) */}
                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        name="employeeId"
                        value={formData.employeeId || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid> */}
                    
                    {/* Blood Group Dropdown */}
                    {renderDropdown("Blood Group", "bloodGroup", bloodGroupOptions)}
                    
                    {/* Caste */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Caste"
                        name="caste"
                        value={formData.caste || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* Department Dropdown */}
                    {renderDropdown("Department", "department", departmentOptions, true)}
                    
                    {/* Designation */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Designation"
                        name="designation"
                        value={formData.designation || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.designation}
                        helperText={errors.designation}
                        required
                      />
                    </Grid>
                    
                    {/* Contract Type Dropdown */}
                    {renderDropdown("Contract Type", "contractType", contractTypeOptions)}
                    
                    {/* Category Dropdown */}
                    {renderDropdown("Category or Type", "category", categoryOptions)}
                    
                    {/* Institution Last Worked */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Institution Last Worked"
                        name="institutionLastWorked"
                        value={formData.institutionLastWorked || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* KTU ID */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="KTU ID"
                        name="ktuId"
                        value={formData.ktuId || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* AICTE ID */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="AICTE ID"
                        name="penNo"
                        value={formData.penNo || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              )}

              {activeTab === 1 && (
                <FormSection title="Personal Details">
                  <Grid container spacing={2}>
                    {/* Marital Status Dropdown */}
                    {renderDropdown("Marital Status", "maritalStatus", maritalStatusOptions)}
                    
                    {/* Mother Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mother Name"
                        name="motherName"
                        value={formData.motherName || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* Father Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Father Name"
                        name="fatherName"
                        value={formData.fatherName || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* Spouse Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Spouse Name"
                        name="spouseName"
                        value={formData.spouseName || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* Nationality */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nationality"
                        name="nationality"
                        value={formData.nationality || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              )}

              {activeTab === 2 && (
                <FormSection title="Contact Details">
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Please fill in both Present and Permanent addresses. Check the box if they are the same.
                  </Alert>
                  
                  {/* Present Address Section */}
                  <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
                    Present Address
                  </Typography>
                  <Grid container spacing={2}>
                    {/* House Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="House Name"
                        name="presentHouseName"
                        value={formData.presentHouseName || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.presentHouseName}
                        helperText={errors.presentHouseName}
                        required
                      />
                    </Grid>
                    
                    {/* Street */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Street"
                        name="presentStreet"
                        value={formData.presentStreet || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* Post */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Post"
                        name="presentPost"
                        value={formData.presentPost || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* District Dropdown */}
                    {renderDropdown("District", "presentDistrict", districtOptions, true)}
                    
                    {/* PIN */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="PIN"
                        name="presentPin"
                        value={formData.presentPin || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.presentPin}
                        helperText={errors.presentPin}
                        required
                      />
                    </Grid>
                    
                    {/* State Dropdown */}
                    {renderDropdown("State", "presentState", stateOptions, true)}
                  </Grid>
                  
                  {/* Same as Present Checkbox and Copy Button */}
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
                  
                  {/* Permanent Address Section */}
                  <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
                    Permanent Address
                  </Typography>
                  <Grid container spacing={2}>
                    {/* House Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="House Name"
                        name="permanentHouseName"
                        value={formData.permanentHouseName || ""}
                        onChange={handleChange}
                        size="small"
                        disabled={formData.sameAsPresent}
                      />
                    </Grid>
                    
                    {/* Street */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Street"
                        name="permanentStreet"
                        value={formData.permanentStreet || ""}
                        onChange={handleChange}
                        size="small"
                        disabled={formData.sameAsPresent}
                      />
                    </Grid>
                    
                    {/* Post */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Post"
                        name="permanentPost"
                        value={formData.permanentPost || ""}
                        onChange={handleChange}
                        size="small"
                        disabled={formData.sameAsPresent}
                      />
                    </Grid>
                    
                    {/* District Dropdown */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel 
                          id="permanentDistrict-label"
                          sx={{
                            fontSize: '0.9rem',
                            backgroundColor: formData.sameAsPresent ? 'transparent' : 'white',
                            padding: '0 4px',
                            transform: 'translate(14px, -9px) scale(0.75)',
                          }}
                        >
                          District
                        </InputLabel>
                        <Select
                          labelId="permanentDistrict-label"
                          label="District"
                          name="permanentDistrict"
                          value={formData.permanentDistrict || ""}
                          onChange={handleChange}
                          disabled={formData.sameAsPresent}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#888' }}>Select District</span>;
                            }
                            return selected;
                          }}
                        >
                          <MenuItem value="">
                            <em style={{ color: '#888' }}>Select District</em>
                          </MenuItem>
                          {districtOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {/* PIN */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="PIN"
                        name="permanentPin"
                        value={formData.permanentPin || ""}
                        onChange={handleChange}
                        size="small"
                        disabled={formData.sameAsPresent}
                        error={!!errors.permanentPin}
                        helperText={errors.permanentPin}
                      />
                    </Grid>
                    
                    {/* State Dropdown */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel 
                          id="permanentState-label"
                          sx={{
                            fontSize: '0.9rem',
                            backgroundColor: formData.sameAsPresent ? 'transparent' : 'white',
                            padding: '0 4px',
                            transform: 'translate(14px, -9px) scale(0.75)',
                          }}
                        >
                          State
                        </InputLabel>
                        <Select
                          labelId="permanentState-label"
                          label="State"
                          name="permanentState"
                          value={formData.permanentState || ""}
                          onChange={handleChange}
                          disabled={formData.sameAsPresent}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#888' }}>Select State</span>;
                            }
                            return selected;
                          }}
                        >
                          <MenuItem value="">
                            <em style={{ color: '#888' }}>Select State</em>
                          </MenuItem>
                          {stateOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  {/* Contact Information */}
                  <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "#1976d2", fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    {/* Phone */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>
                    
                    {/* Phone (RES) */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone (RES)"
                        name="phoneRes"
                        value={formData.phoneRes || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                    
                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    
                    {/* Office Address */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Office Address"
                        name="officeAddress"
                        value={formData.officeAddress || ""}
                        onChange={handleChange}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              )}

              {activeTab === 3 && (
                <FormSection title="Bank Details">
                  <Grid container spacing={2}>
                    {/* Bank Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Bank Name"
                        name="bankName"
                        value={formData.bankName || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.bankName}
                        helperText={errors.bankName}
                        required
                      />
                    </Grid>
                    
                    {/* Account No. */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Account No."
                        name="accountNo"
                        value={formData.accountNo || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.accountNo}
                        helperText={errors.accountNo}
                        required
                      />
                    </Grid>
                    
                    {/* Bank Branch */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Bank Branch"
                        name="bankBranch"
                        value={formData.bankBranch || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.bankBranch}
                        helperText={errors.bankBranch}
                        required
                      />
                    </Grid>
                    
                    {/* IFSC Code */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="IFSC Code"
                        name="ifsc"
                        value={formData.ifsc || ""}
                        onChange={handleChange}
                        size="small"
                        error={!!errors.ifsc}
                        helperText={errors.ifsc}
                        required
                      />
                    </Grid>
                  </Grid>
                </FormSection>
              )}

              {/* ===== Navigation Buttons ===== */}
              <Box
                sx={{
                  mt: 5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
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
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
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
                      background:
                        "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
                    }}
                  >
                    {loading ? "Saving..." : "Save & Go to Qualifications →"}
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