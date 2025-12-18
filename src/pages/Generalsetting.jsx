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
  const username = localStorage.getItem("username");

  // ✅ Fetch all records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://service-book-backend.onrender.com/api/general-details");
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

  // ✅ Submit new record - FIXED VERSION
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setLoading(true);

      const username = localStorage.getItem("username");
      
      // Create a clean copy of formData with all fields
      const sendData = { 
        ...formData,
        username,
      };

      console.log("Sending data:", sendData); // Debug log

      const res = await axios.post(
        "https://service-book-backend.onrender.com/api/general-details",
        formData
      );

      console.log("Response from server:", res.data); // Debug log

      if (res.data.success) {
        toast.success("✅ Saved Successfully");
        // Reset form with all fields
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
          username: localStorage.getItem("username") || "",
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

  // ✅ Format field name for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .replace("Present ", "")
      .replace("Permanent ", "");
  };

  // ✅ Check if field is an address field
  const isAddressField = (fieldName) => {
    return fieldName.includes('present') || 
           fieldName.includes('permanent') || 
           fieldName === 'sameAsPresent';
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
              {viewMode && (
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
                onClick={() => setViewMode(!viewMode)}
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

          {/* ===== View/Edit Mode ===== */}
          {viewMode ? (
            loading ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
              </Box>
            ) : records.length === 0 ? (
              <Typography textAlign="center" py={3}>
                No records found.
              </Typography>
            ) : (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Viewing and editing mode. Click the edit icon to modify records.
                </Alert>
                
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
                        
                        {/* General Fields */}
                        {[
                          ["Title", "title"],
                          ["Name", "name"],
                          ["Date of Join", "dateOfJoin"],
                          ["Date of Birth", "dateOfBirth"],
                          ["Religion", "religion"],
                          ["Staff ID", "staffId"],
                          ["Gender", "gender"],
                          ["Employee ID", "employeeId"],
                          ["Blood Group", "bloodGroup"],
                          ["Caste", "caste"],
                          ["Department", "department"],
                          ["Designation", "designation"],
                          ["Contract Type", "contractType"],
                          ["Category", "category"],
                          ["Institution Last Worked", "institutionLastWorked"],
                          ["KTU ID", "ktuId"],
                          ["AICTE ID", "penNo"],
                        ].map(([label, name]) => (
                          <Grid item xs={12} sm={6} md={4} key={name}>
                            <TextField
                              label={label}
                              fullWidth
                              size="small"
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
                            />
                          </Grid>
                        ))}
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Personal Details Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Personal Details
                          </Typography>
                        </Grid>
                        
                        {[
                          ["Marital Status", "maritalStatus"],
                          ["Mother Name", "motherName"],
                          ["Father Name", "fatherName"],
                          ["Spouse Name", "spouseName"],
                          ["Nationality", "nationality"],
                        ].map(([label, name]) => (
                          <Grid item xs={12} sm={6} md={4} key={name}>
                            <TextField
                              label={label}
                              fullWidth
                              size="small"
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
                            />
                          </Grid>
                        ))}
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Present Address Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Present Address
                          </Typography>
                        </Grid>
                        
                        {[
                          ["House Name", "presentHouseName"],
                          ["Street", "presentStreet"],
                          ["Post", "presentPost"],
                          ["District", "presentDistrict"],
                          ["PIN", "presentPin"],
                          ["State", "presentState"],
                        ].map(([label, name]) => (
                          <Grid item xs={12} sm={6} md={4} key={name}>
                            <TextField
                              label={label}
                              fullWidth
                              size="small"
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
                            />
                          </Grid>
                        ))}
                        
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
                        
                        {[
                          ["House Name", "permanentHouseName"],
                          ["Street", "permanentStreet"],
                          ["Post", "permanentPost"],
                          ["District", "permanentDistrict"],
                          ["PIN", "permanentPin"],
                          ["State", "permanentState"],
                        ].map(([label, name]) => (
                          <Grid item xs={12} sm={6} md={4} key={name}>
                            <TextField
                              label={label}
                              fullWidth
                              size="small"
                              name={name}
                              value={record[name] || ""}
                              disabled={editIndex !== index || (record.sameAsPresent || false)}
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
                            />
                          </Grid>
                        ))}
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Contact Information Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Contact Information
                          </Typography>
                        </Grid>
                        
                        {[
                          ["Phone", "phone"],
                          ["Phone (RES)", "phoneRes"],
                          ["Email", "email"],
                          ["Office Address", "officeAddress"],
                        ].map(([label, name]) => (
                          <Grid item xs={12} sm={6} md={4} key={name}>
                            <TextField
                              label={label}
                              fullWidth
                              size="small"
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
                            />
                          </Grid>
                        ))}
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                        
                        {/* Bank Details Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold" color="#1976d2" gutterBottom sx={{ borderBottom: '2px solid #1976d2', pb: 1 }}>
                            Bank Details
                          </Typography>
                        </Grid>
                        
                        {[
                          ["Bank Name", "bankName"],
                          ["Account No.", "accountNo"],
                          ["Bank Branch", "bankBranch"],
                          ["IFSC Code", "ifsc"],
                        ].map(([label, name]) => (
                          <Grid item xs={12} sm={6} md={4} key={name}>
                            <TextField
                              label={label}
                              fullWidth
                              size="small"
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
                            />
                          </Grid>
                        ))}
                        
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
                    {[
                      ["Title", "title"],
                      ["Name", "name"],
                      ["Date of Join", "dateOfJoin", "date"],
                      ["Date of Birth", "dateOfBirth", "date"],
                      ["Religion", "religion"],
                      ["Staff ID", "staffId"],
                      ["Gender", "gender"],
                      ["Employee ID", "employeeId"],
                      ["Blood Group", "bloodGroup"],
                      ["Caste", "caste"],
                      ["Department", "department"],
                      ["Designation", "designation"],
                      ["Contract Type", "contractType"],
                      ["Category", "category"],
                      ["Institution Last Worked", "institutionLastWorked"],
                      ["KTU ID", "ktuId"],
                      ["AICTE ID.", "penNo"],
                    ].map(([label, name, type]) => (
                      <Grid item xs={12} sm={6} key={name}>
                        <TextField
                          fullWidth
                          type={type || "text"}
                          label={label}
                          name={name}
                          value={formData[name] || ""}
                          onChange={handleChange}
                          size="small"
                          error={!!errors[name]}
                          helperText={errors[name]}
                          required={requiredFields.includes(name)}
                          InputLabelProps={
                            type === "date" ? { shrink: true } : {}
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormSection>
              )}

              {activeTab === 1 && (
                <FormSection title="Personal Details">
                  <Grid container spacing={2}>
                    {[
                      ["Marital Status", "maritalStatus"],
                      ["Mother Name", "motherName"],
                      ["Father Name", "fatherName"],
                      ["Spouse Name", "spouseName"],
                      ["Nationality", "nationality"],
                    ].map(([label, name]) => (
                      <Grid item xs={12} sm={6} key={name}>
                        <TextField
                          fullWidth
                          label={label}
                          name={name}
                          value={formData[name] || ""}
                          onChange={handleChange}
                          size="small"
                        />
                      </Grid>
                    ))}
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
                    {[
                      ["House Name", "presentHouseName"],
                      ["Street", "presentStreet"],
                      ["Post", "presentPost"],
                      ["District", "presentDistrict"],
                      ["PIN", "presentPin"],
                      ["State", "presentState"],
                    ].map(([label, name]) => (
                      <Grid item xs={12} sm={6} key={name}>
                        <TextField
                          fullWidth
                          label={label}
                          name={name}
                          value={formData[name] || ""}
                          onChange={handleChange}
                          size="small"
                          error={!!errors[name]}
                          helperText={errors[name]}
                          required={requiredFields.includes(name)}
                        />
                      </Grid>
                    ))}
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
                    {[
                      ["House Name", "permanentHouseName"],
                      ["Street", "permanentStreet"],
                      ["Post", "permanentPost"],
                      ["District", "permanentDistrict"],
                      ["PIN", "permanentPin"],
                      ["State", "permanentState"],
                    ].map(([label, name]) => (
                      <Grid item xs={12} sm={6} key={name}>
                        <TextField
                          fullWidth
                          label={label}
                          name={name}
                          value={formData[name] || ""}
                          onChange={handleChange}
                          size="small"
                          disabled={formData.sameAsPresent}
                          error={!!errors[name]}
                          helperText={errors[name]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Contact Information */}
                  <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "#1976d2", fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      ["Phone", "phone"],
                      ["Phone (RES)", "phoneRes"],
                      ["Email", "email", "email"],
                      ["Office Address", "officeAddress"],
                    ].map(([label, name, type]) => (
                      <Grid item xs={12} sm={6} key={name}>
                        <TextField
                          fullWidth
                          label={label}
                          name={name}
                          type={type || "text"}
                          value={formData[name] || ""}
                          onChange={handleChange}
                          size="small"
                          error={!!errors[name]}
                          helperText={errors[name]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormSection>
              )}

              {activeTab === 3 && (
                <FormSection title="Bank Details">
                  <Grid container spacing={2}>
                    {[
                      ["Bank Name", "bankName"],
                      ["Account No.", "accountNo"],
                      ["Bank Branch", "bankBranch"],
                      ["IFSC Code", "ifsc"],
                    ].map(([label, name]) => (
                      <Grid item xs={12} sm={6} key={name}>
                        <TextField
                          fullWidth
                          label={label}
                          name={name}
                          value={formData[name] || ""}
                          onChange={handleChange}
                          size="small"
                          error={!!errors[name]}
                          helperText={errors[name]}
                          required={requiredFields.includes(name)}
                        />
                      </Grid>
                    ))}
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