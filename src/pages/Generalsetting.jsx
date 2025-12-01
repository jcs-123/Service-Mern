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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabLabels = [
  "General Details",
  "Personal Details",
  "Contact Details",
  "Bank Details",
  "Login Details",
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
    houseName: "",
    street: "",
    post2: "",
    district: "",
    pin: "",
    state: "",
    phone: "",
    phoneRes: "",
    email: "",
    officeAddress: "",
    bankName: "",
    accountNo: "",
    bankBranch: "",
    ifsc: "",
    username: "",
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
    "bankName",
    "accountNo",
    "bankBranch",
    "ifsc",
    "username",
    "password",
  ];

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "Required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  // ✅ Submit new record
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.warning("⚠️ Please fill all required fields before submitting.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://service-book-backend.onrender.com/api/general-details",
        formData
      );
      if (res.data.success) {
        toast.success("✅ Saved Successfully");
        setFormData({});
        fetchRecords();
        // ✅ Navigate to Qualification page after success
        setTimeout(() => navigate("/Qualification"), 1200);
      } else toast.error("❌ Failed to save details!");
    } catch (err) {
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
      toast.error("❌ Update Failed!");
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
        style={{ width: "100%", maxWidth: "1150px" }}
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
              records.map((record, index) => (
                <Accordion key={record._id} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 600, color: "#0b3d91" }}>
                      {record.name || "Unnamed"} – {record.department}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {Object.entries(record).map(
                        ([key, value]) =>
                          key !== "_id" &&
                          key !== "__v" && (
                            <Grid item xs={12} sm={6} key={key}>
                              <TextField
                                label={key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (s) => s.toUpperCase())}
                                fullWidth
                                size="small"
                                name={key}
                                value={value || ""}
                                disabled={editIndex !== index}
                                onChange={(e) => {
                                  const updated = {
                                    ...record,
                                    [key]: e.target.value,
                                  };
                                  setRecords((prev) => {
                                    const copy = [...prev];
                                    copy[index] = updated;
                                    return copy;
                                  });
                                }}
                              />
                            </Grid>
                          )
                      )}
                    </Grid>
                    <Box textAlign="right" mt={2}>
                      {editIndex === index ? (
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
                          Save
                        </Button>
                      ) : (
                        <IconButton
                          color="primary"
                          onClick={() => setEditIndex(index)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))
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
                      ["PEN No.", "penNo"],
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
                  <Grid container spacing={2}>
                    {[
                      ["House Name", "houseName"],
                      ["Street", "street"],
                      ["Post / Street 2", "post2"],
                      ["District", "district"],
                      ["PIN", "pin"],
                      ["State", "state"],
                      ["Phone", "phone"],
                      ["Phone (RES)", "phoneRes"],
                      ["Email", "email"],
                      ["Office Address", "officeAddress"],
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
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormSection>
              )}

              {activeTab === 4 && (
                <FormSection title="Login Details">
                  <Grid container spacing={2}>
                    {[
                      ["Username", "username"],
                      ["Default Password", "password", "password"],
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
