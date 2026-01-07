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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
  const [expandedAccordion, setExpandedAccordion] = useState(true);

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

      const res = await axios.get(`https://service-book-backend.onrender.com/api/general-details?username=${username}`);
      if (res.data && res.data.length > 0) {
        setRecords(res.data);
        setHasData(true);

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

    if (formData.presentPin && !/^\d{6}$/.test(formData.presentPin)) {
      newErrors.presentPin = "Invalid PIN (6 digits required)";
    }
    if (formData.permanentPin && !/^\d{6}$/.test(formData.permanentPin)) {
      newErrors.permanentPin = "Invalid PIN (6 digits required)";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

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
        setViewMode(true);
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
      setExpandedAccordion(true);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("❌ Update Failed!");
    }
  };

  // ✅ Download Excel for Admin
  const handleDownloadExcel = async () => {
    try {
      const username = localStorage.getItem("username");
      const userRole = localStorage.getItem("role");

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

  // ✅ Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

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
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            background: "#ffffff",
            border: "1px solid #d3e0ff",
            boxShadow: "0 4px 20px rgba(30, 90, 180, 0.08)",
          }}
        >
          {/* Header Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0b3d91",
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
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
                    px: 3,
                    py: 1,
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
                  px: 3,
                  py: 1,
                  '&:hover': {
                    background: viewMode ? "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)" : "rgba(25, 118, 210, 0.04)",
                  }
                }}
              >
                {viewMode ? "Edit Details" : "View Details"}
              </Button>
            </Box>
          </Box>

          {/* ===== View Mode ===== */}
          {viewMode ? (
            loading ? (
              <Box textAlign="center" py={6}>
                <CircularProgress />
                <Typography sx={{ mt: 2, color: "#666" }}>Loading your data...</Typography>
              </Box>
            ) : !hasData ? (
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  fontSize: '1rem'
                }}
              >
                No profile data found. Click "Edit Details" to create your profile.
              </Alert>
            ) : (
              <>
                {records.map((record, index) => (
                  <Accordion
                    key={record._id || index}
                    expanded={expandedAccordion}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: '#f8fbff',
                        borderRadius: '8px 8px 0 0',
                        minHeight: '64px'
                      }}
                    >
                      <Typography sx={{
                        fontWeight: 600,
                        color: "#0b3d91",
                        fontSize: '1.1rem'
                      }}>
                        {record.name || "Unnamed"} – {record.department} – {record.staffId}
                        {editIndex === index && (
                          <Typography component="span" sx={{
                            ml: 2,
                            color: "#d32f2f",
                            fontSize: "0.875rem",
                            fontWeight: 500
                          }}>
                            (Editing...)
                          </Typography>
                        )}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
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
                                px: 3,
                                py: 1,
                                minHeight: '48px'
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

                          {/* Edit Form Content */}
                          <Box sx={{ mt: 2 }}>
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
                                <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
                                  Please fill in both Present and Permanent addresses. Check the box if they are the same.
                                </Alert>

                                {/* Present Address Section */}
                                <Box sx={{ mb: 4 }}>
                                  <SectionHeader icon="📍" title="Present Address" />
                                  <Grid container spacing={2}>
                                    {renderTextField("House Name", "presentHouseName", "text", true)}
                                    {renderTextField("Street", "presentStreet", "text")}
                                    {renderTextField("Post", "presentPost", "text")}
                                    {renderDropdown("District", "presentDistrict", districtOptions, true)}
                                    {renderTextField("PIN", "presentPin", "text", true)}
                                    {renderDropdown("State", "presentState", stateOptions, true)}
                                  </Grid>
                                </Box>

                                {/* Address Copy Section */}
                                <Box sx={{
                                  mb: 4,
                                  p: 3,
                                  border: '1px dashed #1976d2',
                                  borderRadius: 2,
                                  backgroundColor: '#f8fbff'
                                }}>
                                  <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item xs={12} md={6}>
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
                                            color="primary"
                                          />
                                        }
                                        label={
                                          <Typography sx={{ fontWeight: 500, color: '#1976d2' }}>
                                            Permanent address same as present address
                                          </Typography>
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
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
                                        sx={{
                                          borderColor: '#1976d2',
                                          color: '#1976d2',
                                          '&:hover': {
                                            borderColor: '#1565c0',
                                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                          }
                                        }}
                                      >
                                        Copy to Permanent
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </Box>

                                {/* Permanent Address Section */}
                                <Box sx={{ mb: 4 }}>
                                  <SectionHeader icon="🏠" title="Permanent Address" />
                                  <Grid container spacing={2}>
                                    {renderTextField("House Name", "permanentHouseName", "text")}
                                    {renderTextField("Street", "permanentStreet", "text")}
                                    {renderTextField("Post", "permanentPost", "text")}
                                    {renderDropdown("District", "permanentDistrict", districtOptions)}
                                    {renderTextField("PIN", "permanentPin", "text")}
                                    {renderDropdown("State", "permanentState", stateOptions)}
                                  </Grid>
                                </Box>

                                {/* Contact Information Section */}
                                <Box>
                                  <SectionHeader icon="📞" title="Contact Information" />
                                  <Grid container spacing={2}>
                                    {renderTextField("Phone", "phone", "tel")}
                                    {renderTextField("Phone (RES)", "phoneRes", "tel")}
                                    {renderTextField("Email", "email", "email")}
                                    {renderTextField("Office Address", "officeAddress", "text")}
                                  </Grid>
                                </Box>
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
                            <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between" }}>
                              <Button
                                disabled={activeTab === 0}
                                onClick={() => setActiveTab((prev) => prev - 1)}
                                variant="outlined"
                                sx={{
                                  px: 4,
                                  py: 1.5,
                                  fontWeight: 600,
                                  textTransform: "none",
                                  color: "#1976d2",
                                  borderColor: "#1976d2",
                                  borderRadius: 2,
                                  minWidth: '120px'
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
                                    py: 1.5,
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                    minWidth: '120px'
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
                                      px: 4,
                                      py: 1.5,
                                      fontWeight: 600,
                                      minWidth: '120px'
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
                                      px: 4,
                                      py: 1.5,
                                      fontWeight: 600,
                                      minWidth: '120px'
                                    }}
                                  >
                                    Save Changes
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </>
                      ) : (
                        // ===== VIEW MODE - PROPERLY ARRANGED =====
                        <>
                          {/* Personal & General Information Section */}
                          <SectionContainer title="👤 Personal & General Information" mb={4}>
                            <Grid container spacing={2}>
                              {/* Row 1 */}
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Title" value={record.title} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Full Name" value={record.name} highlight />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Staff ID" value={record.staffId} highlight />
                              </Grid>

                              {/* Row 2 */}
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Date of Birth" value={formatDate(record.dateOfBirth)} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Date of Join" value={formatDate(record.dateOfJoin)} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Gender" value={record.gender} />
                              </Grid>

                              {/* Row 3 */}
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Religion" value={record.religion} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Blood Group" value={record.bloodGroup} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Caste" value={record.caste} />
                              </Grid>

                              {/* Row 4 */}
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Employee ID" value={record.employeeId} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="KTU ID" value={record.ktuId} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="AICTE ID" value={record.penNo} />
                              </Grid>
                            </Grid>
                          </SectionContainer>

                          <Divider sx={{ my: 3 }} />

                          {/* Employment Details Section */}
                          <SectionContainer title="💼 Employment Details" mb={4}>
                            <Grid container spacing={2}>
                              {/* Row 1 */}
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Department" value={record.department} highlight />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Designation" value={record.designation} highlight />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Category" value={record.category} />
                              </Grid>

                              {/* Row 2 */}
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Contract Type" value={record.contractType} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Institution Last Worked" value={record.institutionLastWorked} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Nationality" value={record.nationality} />
                              </Grid>
                            </Grid>
                          </SectionContainer>

                          <Divider sx={{ my: 3 }} />

                          {/* Family Details Section */}
                          <SectionContainer title="👨‍👩‍👧‍👦 Family Details" mb={4}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Marital Status" value={record.maritalStatus} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Father's Name" value={record.fatherName} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Mother's Name" value={record.motherName} />
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <InfoField label="Spouse Name" value={record.spouseName} />
                              </Grid>
                            </Grid>
                          </SectionContainer>

                          <Divider sx={{ my: 3 }} />

                          {/* Address Details Section - COMPACT TABLE FORMAT */}
                          <SectionContainer title="📍 Address Details">
                            <Grid container spacing={2}>
                              {/* Present Address */}
                              <Grid item xs={12} md={6}>
                                <Box sx={{
                                  p: 2,
                                  border: '1px solid #e0e0e0',
                                  borderRadius: 2,
                                  backgroundColor: '#f8fbff',
                                  height: '100%'
                                }}>
                                  <Typography variant="subtitle1" fontWeight={600} color="#1976d2" gutterBottom mb={2}>
                                    Present Address
                                  </Typography>
                                  <TableContainer>
                                    <Table size="small" sx={{ border: 'none' }}>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            House Name:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.presentHouseName || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            Street:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.presentStreet || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            Post:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.presentPost || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            District:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.presentDistrict || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            PIN Code:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.presentPin || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            State:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.presentState || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Box>
                              </Grid>

                              {/* Permanent Address */}
                              <Grid item xs={12} md={6}>
                                <Box sx={{
                                  p: 2,
                                  border: '1px solid #e0e0e0',
                                  borderRadius: 2,
                                  backgroundColor: '#f8fbff',
                                  height: '100%'
                                }}>
                                  <Typography variant="subtitle1" fontWeight={600} color="#1976d2" gutterBottom mb={2}>
                                    Permanent Address
                                    {record.sameAsPresent && (
                                      <Typography component="span" variant="caption" sx={{
                                        ml: 1,
                                        color: '#2e7d32',
                                        fontStyle: 'italic',
                                        fontWeight: 500,
                                        fontSize: '0.75rem'
                                      }}>
                                        (Same as Present)
                                      </Typography>
                                    )}
                                  </Typography>
                                  <TableContainer>
                                    <Table size="small" sx={{ border: 'none' }}>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            House Name:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.permanentHouseName || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            Street:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.permanentStreet || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            Post:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.permanentPost || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            District:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.permanentDistrict || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            PIN Code:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.permanentPin || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, width: '35%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                            State:
                                          </TableCell>
                                          <TableCell sx={{ border: 'none', py: 0.5, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                            {record.permanentState || "Not provided"}
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </Box>
                              </Grid>
                            </Grid>
                          </SectionContainer>

                          <Divider sx={{ my: 3 }} />

                          {/* Contact & Bank Details Section */}
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <SectionContainer title="📞 Contact Information" noPadding>
                                <TableContainer>
                                  <Table size="small" sx={{ border: 'none' }}>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, width: '40%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                          Phone:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {record.phone || "Not provided"}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, width: '40%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                          Phone (Res):
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {record.phoneRes || "Not provided"}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, width: '40%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                          Email:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {record.email || "Not provided"}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, width: '40%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                          Office Address:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {record.officeAddress || "Not provided"}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </SectionContainer>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <SectionContainer title="🏦 Bank Details" noPadding>
                                <TableContainer>
                                  <Table size="small" sx={{ border: 'none' }}>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, width: '40%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                          Bank Name:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {record.bankName || "Not provided"}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, width: '40%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                          Account Number:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {record.accountNo || "Not provided"}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, width: '40%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                          Branch:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {record.bankBranch || "Not provided"}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, width: '40%', fontWeight: 500, fontSize: '0.85rem', color: '#555' }}>
                                          IFSC Code:
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', py: 1, px: 1, fontSize: '0.9rem', color: '#333' }}>
                                          {record.ifsc || "Not provided"}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </SectionContainer>
                            </Grid>
                          </Grid>
                          <Box textAlign="right" mt={4}>
                          <Button
                            variant={viewMode ? "contained" : "outlined"}
                            onClick={() => {
                              setViewMode(!viewMode);
                              if (viewMode && hasData) {
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
                              px: 3,
                              py: 1,
                              '&:hover': {
                                background: viewMode ? "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)" : "rgba(25, 118, 210, 0.04)",
                              }
                            }}
                          >
                            {viewMode ? "Edit Details" : "View Details"}
                          </Button>
                          </Box>
                          {/* Edit Button
                          <Box textAlign="right" mt={4}>
                            <Button
                              variant="contained"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setEditIndex(index);
                                setActiveTab(0);
                              }}
                              sx={{
                                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                borderRadius: 2,
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                '&:hover': {
                                  background: "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
                                }
                              }}
                            >
                              Edit Details
                            </Button>
                          </Box> */}
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
                    px: 3,
                    py: 1,
                    minHeight: '48px'
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
              <Box sx={{ mt: 2 }}>
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
                    <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
                      Please fill in both Present and Permanent addresses. Check the box if they are the same.
                    </Alert>

                    {/* Present Address Section */}
                    <Box sx={{ mb: 4 }}>
                      <SectionHeader icon="📍" title="Present Address" />
                      <Grid container spacing={2}>
                        {renderTextField("House Name", "presentHouseName", "text", true)}
                        {renderTextField("Street", "presentStreet", "text")}
                        {renderTextField("Post", "presentPost", "text")}
                        {renderDropdown("District", "presentDistrict", districtOptions, true)}
                        {renderTextField("PIN", "presentPin", "text", true)}
                        {renderDropdown("State", "presentState", stateOptions, true)}
                      </Grid>
                    </Box>

                    {/* Address Copy Section */}
                    <Box sx={{
                      mb: 4,
                      p: 3,
                      border: '1px dashed #1976d2',
                      borderRadius: 2,
                      backgroundColor: '#f8fbff'
                    }}>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.sameAsPresent}
                                onChange={handleChange}
                                name="sameAsPresent"
                                color="primary"
                              />
                            }
                            label={
                              <Typography sx={{ fontWeight: 500, color: '#1976d2' }}>
                                Permanent address same as present address
                              </Typography>
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                          <Button
                            variant="outlined"
                            startIcon={<ContentCopyIcon />}
                            onClick={handleCopyAddress}
                            sx={{
                              borderColor: '#1976d2',
                              color: '#1976d2',
                              '&:hover': {
                                borderColor: '#1565c0',
                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                              }
                            }}
                          >
                            Copy to Permanent
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Permanent Address Section */}
                    <Box sx={{ mb: 4 }}>
                      <SectionHeader icon="🏠" title="Permanent Address" />
                      <Grid container spacing={2}>
                        {renderTextField("House Name", "permanentHouseName", "text")}
                        {renderTextField("Street", "permanentStreet", "text")}
                        {renderTextField("Post", "permanentPost", "text")}
                        {renderDropdown("District", "permanentDistrict", districtOptions)}
                        {renderTextField("PIN", "permanentPin", "text")}
                        {renderDropdown("State", "permanentState", stateOptions)}
                      </Grid>
                    </Box>

                    {/* Contact Information Section */}
                    <Box>
                      <SectionHeader icon="📞" title="Contact Information" />
                      <Grid container spacing={2}>
                        {renderTextField("Phone", "phone", "tel")}
                        {renderTextField("Phone (RES)", "phoneRes", "tel")}
                        {renderTextField("Email", "email", "email")}
                        {renderTextField("Office Address", "officeAddress", "text")}
                      </Grid>
                    </Box>
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
                <Box sx={{ mt: 6, display: "flex", justifyContent: "space-between" }}>
                  <Button
                    disabled={activeTab === 0}
                    onClick={() => setActiveTab((prev) => prev - 1)}
                    variant="outlined"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      borderRadius: 2,
                      minWidth: '120px'
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
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                        minWidth: '120px'
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
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
                        minWidth: '120px'
                      }}
                    >
                      {loading ? "Saving..." : hasData ? "Update Profile" : "Save Profile"}
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

// ===== FormSection Component =====
const FormSection = ({ title, children }) => (
  <Box sx={{ mt: 2 }}>
    <Typography
      variant="h6"
      sx={{
        mb: 3,
        fontWeight: 700,
        color: "#0b3d91",
        borderLeft: "4px solid #1976d2",
        pl: 2,
        textTransform: "uppercase",
        background: "linear-gradient(to right, #eaf2ff 0%, #ffffff 100%)",
        py: 1,
        borderRadius: 1,
        fontSize: '1.1rem'
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

// ===== SectionHeader Component =====
const SectionHeader = ({ icon, title }) => (
  <Typography variant="subtitle1" sx={{
    color: "#1976d2",
    fontWeight: 600,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem'
  }}>
    <Box component="span" sx={{ mr: 1 }}>{icon}</Box>
    {title}
  </Typography>
);

// ===== SectionContainer Component =====
const SectionContainer = ({ title, children, mb = 0, noPadding = false }) => (
  <Box sx={{ mb: mb }}>
    <Typography
      variant="h6"
      sx={{
        color: "#1976d2",
        fontWeight: 600,
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.25rem'
      }}
    >
      {title}
    </Typography>
    <Box sx={noPadding ? {} : { p: { xs: 2, sm: 3 } }}>
      {children}
    </Box>
  </Box>
);

// ===== InfoField Component =====
const InfoField = ({ label, value, highlight = false }) => {
  const displayValue = value || <Typography component="span" sx={{ color: '#999', fontStyle: 'italic' }}>Not provided</Typography>;

  return (
    <Box sx={{
      p: 1.5,
      border: '1px solid #e0e0e0',
      borderRadius: 1.5,
      backgroundColor: highlight ? '#f0f7ff' : '#fafafa',
      height: '100%',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: '#1976d2',
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
      }
    }}>
      <Typography
        variant="caption"
        sx={{
          color: '#666',
          fontWeight: 500,
          display: 'block',
          mb: 0.5,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: highlight ? 600 : 400,
          color: highlight ? '#1976d2' : 'text.primary',
          fontSize: '0.9rem',
          lineHeight: 1.4
        }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};

export default Generalsetting;