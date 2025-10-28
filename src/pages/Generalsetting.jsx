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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => navigate("/Qualification");

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(180deg, #f7faff 0%, #edf3ff 100%)",
        overflowY: "auto",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          maxWidth: "1100px",
          mx: "auto",
          background: "#fff",
        }}
      >
        {/* ===== Sub Step Tabs ===== */}
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          centered
          variant="scrollable"
          allowScrollButtonsMobile
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mb: 3,
            "& .MuiTab-root": {
              fontWeight: 600,
              color: "#0b3d91",
              textTransform: "none",
              fontSize: "0.95rem",
            },
          }}
        >
          {tabLabels.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>

        {/* ===== Sub Form Sections ===== */}
        {activeTab === 0 && (
          <FormSection title="General Details">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  fullWidth
                  label="Date of Join"
                  name="dateOfJoin"
                  value={formData.dateOfJoin}
                  onChange={handleChange}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {[
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
              ].map(([label, name]) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField fullWidth label={label} name={name} value={formData[name]} onChange={handleChange} size="small" />
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
                  <TextField fullWidth label={label} name={name} value={formData[name]} onChange={handleChange} size="small" />
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
                  <TextField fullWidth label={label} name={name} value={formData[name]} onChange={handleChange} size="small" />
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
                  <TextField fullWidth label={label} name={name} value={formData[name]} onChange={handleChange} size="small" />
                </Grid>
              ))}
            </Grid>
          </FormSection>
        )}

        {activeTab === 4 && (
          <FormSection title="Login Details">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="User Name" name="username" value={formData.username} onChange={handleChange} size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Default Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            </Grid>
          </FormSection>
        )}

        {/* ===== Navigation Buttons ===== */}
        <Box
          sx={{
            mt: 4,
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
              fontWeight: 600,
              textTransform: "none",
              color: "#1976d2",
              borderColor: "#1976d2",
              "&:hover": { background: "rgba(25,118,210,0.1)" },
            }}
          >
            ← Previous
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
              onClick={handleNext}
              variant="contained"
              sx={{
                px: 4,
                py: 1,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              }}
            >
              Go to Qualifications →
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

// ===== Reusable Section Wrapper =====
const FormSection = ({ title, children }) => (
  <Box sx={{ mt: 2 }}>
    <Typography
      variant="h6"
      sx={{
        mb: 2,
        fontWeight: 700,
        color: "#0b3d91",
        borderLeft: "4px solid #1976d2",
        pl: 1,
        textTransform: "uppercase",
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

export default Generalsetting;
