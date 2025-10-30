import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
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

  // ✅ Required fields
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

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validate required fields
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

  // ✅ Submit data
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.warning("⚠️ Please fill all required fields before submitting.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/general-details",
        formData
      );

      if (res.data.success) {
        if (res.data.message.includes("updated")) {
          toast.info(`🔁 ${res.data.message}`);
        } else {
          toast.success(`✅ ${res.data.message}`);
        }

        setTimeout(() => navigate("/Qualification"), 1500);
      } else {
        toast.error("❌ Failed to save details!");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error, please try again later.");
    } finally {
      setLoading(false);
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
          {/* Tabs */}
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
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
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
                      value={formData[name]}
                      onChange={handleChange}
                      size="small"
                      error={!!errors[name]}
                      helperText={errors[name]}
                      InputLabelProps={type === "date" ? { shrink: true } : {}}
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
                      value={formData[name]}
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
                      value={formData[name]}
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
                      value={formData[name]}
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
                      value={formData[name]}
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
