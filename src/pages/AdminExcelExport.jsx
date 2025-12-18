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
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Download,
  TableChart,
  Close,
  Visibility,
  Search,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 260;

/* ======================================================
   ⚙️ Export to Excel
====================================================== */
const exportToExcel = (sheetName, dataArray) => {
  const ws = XLSX.utils.json_to_sheet(dataArray);
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellRef];
      if (cell && typeof cell.v === "string" && cell.v.startsWith("=HYPERLINK")) {
        cell.f = cell.v.replace("=", "");
        delete cell.v;
      }
    }
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${sheetName.replace(/\s+/g, "_")}_Export.xlsx`);
};

/* ======================================================
   🧭 Modal Component
====================================================== */
const DataModal = ({ open, onClose, sectionName, sectionData }) => {
  if (!sectionData?.length) return null;
  const columns = Object.keys(sectionData[0]);

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Box
              sx={{
                width: "92%",
                maxWidth: 1200,
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                mx: "auto",
                mt: 6,
                overflow: "hidden",
              }}
            >
              <AppBar position="static" color="primary" elevation={2}>
                <MuiToolbar>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {sectionName} — Data Preview
                  </Typography>
                  <IconButton color="inherit" onClick={onClose}>
                    <Close />
                  </IconButton>
                </MuiToolbar>
              </AppBar>

              <Box sx={{ p: 3, maxHeight: "75vh", overflowY: "auto" }}>
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map((col, i) => (
                          <TableCell
                            key={i}
                            sx={{
                              fontWeight: "bold",
                              background: "#E3F2FD",
                              color: "#0D47A1",
                            }}
                          >
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
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
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
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "https://service-book-backend.onrender.com";

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logging out...");
    setTimeout(() => (window.location.href = "/login"), 1000);
  };

  /* Fetch all data once */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const endpoints = {
          generalDetails: "/api/general/get",
          qualifications: "/api/qualification/get",
          experience: "/api/experience/get",
          subjectEngaged: "/api/subjects-engaged/get",
          publications: "/api/publications/get",
          programsCoordinated: "/api/programs-coordinated/get",
          programsAttended: "/api/programs-attended/get",
          consultancies: "/api/consultancy/get",
          facultyResearch: "/api/facultyresearch/get",
          projectsGuided: "/api/projectsguided/get",
          seminarsGuided: "/api/seminars-guided/get",
          interactions: "/api/interactions/get",
          positions: "/api/positions/get", // ✅ Added
          researchInterests: "/api/reserach/get",
          achievements: "/api/achievements/get",
          // interestsubject: "/api/interest/get",
          activityLog: "/api/activity/get",
          patents: "/api/patents/get", // ✅ Added
          mooc: "/api/mooc/get", // ✅ Added
          administrativeWork: "/api/administrative/get",
           professionalBody: "/api/professional-body/get",
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
        toast.error("Failed to load data");
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

  const sections = Object.keys(data)
    .map((key) => ({
      name: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
      key,
    }))
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
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
        component={motion.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background:
            "linear-gradient(135deg, #e8f0fe 0%, #f8fbff 60%, #e9f5ec 100%)",
          minHeight: "100vh",
          overflowY: "auto",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={50} color="primary" />
          </Box>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              color="#0D47A1"
              textAlign="center"
              mb={2}
            >
              📘 Service Book Export Center
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              textAlign="center"
              mb={5}
            >
              Export, preview, and manage all Service Book sections easily.
            </Typography>

            {/* 🔍 Top Controls */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mb: 4,
              }}
            >
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search section..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: "280px" }}
              />
              <Button
                variant="contained"
                startIcon={<Download />}
                sx={{
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                  px: 3,
                }}
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
                Export All Sections
              </Button>
            </Box>

            {/* 🎴 Animated Cards Grid */}
            <Grid container spacing={3} justifyContent="center">
              {sections.map((section, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
                        backdropFilter: "blur(8px)",
                        backgroundColor: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Box
                            sx={{
                              width: 70,
                              height: 70,
                              mx: "auto",
                              mb: 2,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #1976d2, #42a5f5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              boxShadow: "0 4px 10px rgba(25,118,210,0.3)",
                            }}
                          >
                            <TableChart sx={{ fontSize: 35 }} />
                          </Box>
                        </motion.div>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#1565C0"
                          mb={1}
                        >
                          {section.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={2}
                        >
                          {data[section.key]?.length || 0} record(s)
                        </Typography>

                        <Divider sx={{ my: 1 }} />
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexDirection: "column",
                            mt: 1,
                          }}
                        >
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<Visibility />}
                            onClick={() =>
                              handleViewData(section.name, section.key)
                            }
                          >
                            View Data
                          </Button>
                          <Button
                            variant="contained"
                            fullWidth
                            endIcon={<Download />}
                            onClick={() =>
                              exportToExcel(
                                section.name,
                                data[section.key] || []
                              )
                            }
                          >
                            Download Excel
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
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
