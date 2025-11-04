import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Toolbar,
  CssBaseline,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  AppBar,
  Toolbar as MuiToolbar,
} from "@mui/material";
import { Download, TableChart, Close, Visibility } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 260;

/* ======================================================
   ⚙️ Export to Excel (Single)
====================================================== */
const exportToExcel = (sheetName, dataArray) => {
  // 1️⃣ Create worksheet from JSON
  const ws = XLSX.utils.json_to_sheet(dataArray);

  // 2️⃣ Convert HYPERLINK text formula into real Excel formulas
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellRef];
      if (cell && typeof cell.v === "string" && cell.v.startsWith('=HYPERLINK')) {
        cell.f = cell.v.replace("=", ""); // 🧠 tell XLSX it's a formula
        delete cell.v; // remove text value
      }
    }
  }

  // 3️⃣ Create workbook and add the sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // 4️⃣ Export file
  XLSX.writeFile(wb, `${sheetName.replace(/\s+/g, "_")}_Export.xlsx`);
};

/* ======================================================
   🧭 Data Modal
====================================================== */
const DataModal = ({ open, onClose, sectionName, sectionData }) => {
  if (!sectionData || sectionData.length === 0) return null;
  const columns = Object.keys(sectionData[0]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "90%",
          maxWidth: 1200,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          mx: "auto",
          mt: 5,
          overflow: "hidden",
        }}
      >
        <AppBar position="static" color="primary">
          <MuiToolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {sectionName} - Data Preview
            </Typography>
            <IconButton color="inherit" onClick={onClose}>
              <Close />
            </IconButton>
          </MuiToolbar>
        </AppBar>

        <Box sx={{ p: 3, maxHeight: "80vh", overflowY: "auto" }}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col, i) => (
                    <TableCell key={i} sx={{ fontWeight: "bold", background: "#f4f6f8" }}>
                      {col.replace(/_/g, " ")}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sectionData.map((row, i) => (
                  <TableRow key={i}>
                    {columns.map((col, j) => (
                      <TableCell key={j}>{row[col] || "-"}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button onClick={onClose} sx={{ mr: 2 }}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => exportToExcel(sectionName, sectionData)}
            >
              Export Excel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

/* ======================================================
   🧭 Main Component
====================================================== */
const AdminExcelExport = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSectionData, setSelectedSectionData] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logging out...");
    setTimeout(() => (window.location.href = "/login"), 1000);
  };

  /* ======================================================
     📡 Fetch All 21 Sections
  ======================================================= */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const endpoints = {
          // generalDetails: "/api/general-details",
          qualifications: "/api/qualification/get",
          experience: "/api/experience/get",
          // subjectsEngaged: "/api/subject",
          // publications: "/api/publication",
          consultancies: "/api/consultancy/get",
          // programsCoordinated: "/api/programscoordinated",
          // programsAttended: "/api/programsattended",
          facultyResearch: "/api/facultyresearch/get",
          projectsGuided: "/api/projectsguided/get",
          // seminarsGuided: "/api/seminarsguided",
          // interactionsOutside: "/api/interactions",
          // positionsHeld: "/api/positions",
          researchInterests: "/api/reserach/get",
          achievements: "/api/achievements/get",
          interestsubject:"/api/interest/get",
          activityLog: "/api/activity/get",
          // patents: "/api/patents",
          administrativeWork: "/api/administrative/get",
          // professionalMemberships: "/api/professionalbody",
        };

        const results = await Promise.all(
          Object.entries(endpoints).map(async ([key, endpoint]) => {
            const res = await axios.get(`${API_URL}${endpoint}`);
            return [key, res.data.data || []];
          })
        );

        setData(Object.fromEntries(results));
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        toast.error("Failed to load all section data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleViewData = (name, key) => {
    setSelectedSection(name);
    setSelectedSectionData(data[key] || []);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const userName = localStorage.getItem("name") || "Admin";
  const userGmail = localStorage.getItem("gmail") || "admin@jec.ac.in";

  const sections = Object.keys(data).map((key) => ({
    name: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    key,
  }));

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 10 }}>
        <Typography variant="h6" color="text.secondary">
          ⏳ Loading all Service Book data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminHeader
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        userName={userName}
        userGmail={userGmail}
        handleLogout={handleLogout}
      />
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#F5F9FF",
          minHeight: "100vh",
          overflowY: "auto",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar />
        <Typography variant="h4" fontWeight={700} color="#0D47A1" textAlign="center" mb={2}>
          📊 Service Book Data Export
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" textAlign="center" mb={5}>
          View and export each Service Book section or download all 21 sections together.
        </Typography>

        {/* Section Cards */}
        <Grid container spacing={3} justifyContent="center">
          {sections.map((section, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 20px rgba(25,118,210,0.25)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      mx: "auto",
                      mb: 2,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <TableChart sx={{ fontSize: 35 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="#1565C0" mb={1}>
                    {section.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {data[section.key]?.length || 0} record(s)
                  </Typography>
                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Visibility />}
                      onClick={() => handleViewData(section.name, section.key)}
                    >
                      View Data
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      endIcon={<Download />}
                      onClick={() => exportToExcel(section.name, data[section.key] || [])}
                    >
                      Download Excel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Export All */}
        <Box sx={{ textAlign: "center", mt: 6, mb: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              const wb = XLSX.utils.book_new();
              Object.entries(data).forEach(([key, value]) => {
                const ws = XLSX.utils.json_to_sheet(value);
                XLSX.utils.book_append_sheet(wb, ws, key);
              });
              const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
              saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                "ServiceBook_All_Sections.xlsx"
              );
              toast.success("✅ All sections exported successfully!");
            }}
          >
            Export All Sections (Combined)
          </Button>
        </Box>
      </Box>

      <DataModal
        open={modalOpen}
        onClose={handleCloseModal}
        sectionName={selectedSection}
        sectionData={selectedSectionData}
      />
      <ToastContainer position="top-center" autoClose={2000} />
    </Box>
  );
};

export default AdminExcelExport;
