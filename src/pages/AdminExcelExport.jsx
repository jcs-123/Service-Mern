import React, { useState } from "react";
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
} from "@mui/material";
import { Download, TableChart } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 260;

/* ======================================================
   📘 Dummy Data: 21 Sections of Service Book
====================================================== */
const data = {
  generalDetails: [
    {
      Title: "Dr.",
      Name: "Dr. Vijayakumar R",
      Date_of_Join: "03/08/2021",
      Date_of_Birth: "28/05/1959",
      Religion: "Hindu",
      Staff_ID: "JEC690",
      Gender: "Male",
      Department: "CSE",
      Designation: "Professor",
      Category: "Teaching",
    },
  ],
  qualifications: [
    {
      Degree: "Ph.D.",
      Discipline: "Computer Science and Engg",
      University: "Kerala",
      Year_of_Passing: "2000",
    },
    {
      Degree: "Integrated PG Course",
      Discipline: "Computer Science and Engg",
      University: "IIT Bombay",
      Year_of_Passing: "1992",
    },
  ],
  experience: [
    {
      Title: "Professor, CSED",
      Institution: "Jyothi Engg College, Cheruthuruthy",
      From: "03/08/2024",
      To: "",
      Nature_of_Employment: "Guest--37400-67000",
    },
  ],
  subjectsEngaged: [
    {
      Academic_Year: "2024-2025",
      Batch: "CSE-M 2K24",
      Semester: "IInd",
      Subject: "222ECS001 - WIRELESS SENSOR NETWORKS",
      Course_Diary: "Diary",
      Pass_Percentage: "",
    },
  ],
  publications: [
    {
      Category: "International Journal <1.5 IF",
      Title:
        "Optimization driven GAN for course recommendation in E-Learning",
      Publication: "International Journal of Wireless and Mobile Computing",
      Indexing: "SCOPUS",
      Date: "01/11/2023",
    },
  ],
  consultancies: [
    {
      Title:
        "Kannadi Service Cooperative Bank Automation - tender, testing, certification",
      Funded: "Yes",
      Amount: "₹75 Lakhs",
      Academic_Year: "2018-2019",
    },
  ],
  programsCoordinated: [
    {
      Title:
        "Two weeks FDP FOR THE TEACHERS OF AFFILIATED COLLEGES UNDER MG UTY",
      Category: "FDP",
      Organised_By: "MGU-UGC",
      From: "16/01/2017",
      To: "31/01/2017",
      Academic_Year: "2022-2023",
    },
  ],
  programsAttended: [
    {
      Category: "Other Programs",
      Sub_Category: "CAS selection committee",
      Organised_By: "University of Kerala",
      From: "17/02/2020",
      To: "17/02/2020",
    },
  ],
  facultyResearch: [
    {
      Title:
        "Research Guide approval from MGU since 2008. 09 PhDs completed under guidance.",
      Academic_Year: "2020-2021",
      Funded: "No",
      Status: "Ongoing",
    },
  ],
  projectsGuided: [
    {
      Title:
        "Ph.D. Guidance - Dr. Leena C Shekar (Swarm intelligence based feature selection)",
      Academic_Year: "2020-2021",
      Level: "Ph.D.",
      Funded: "No",
    },
  ],
  seminarsGuided: [
    {
      Title:
        "Comparative analysis of Deep Learning Algorithms for Big Data Analytics",
      Academic_Year: "2022-2023",
    },
  ],
  interactionsOutside: [
    {
      Title:
        "Bharathiyar Univ., Coimbatore VIVA VOCE and Thesis Evaluation (A J Rajeswari Joe)",
      Academic_Year: "2019-2020",
    },
    {
      Title:
        "University of Kerala Thesis Evaluation (Ranganayaki 15-07-2019)",
      Academic_Year: "2019-2020",
    },
  ],
  positionsHeld: [
    {
      Position: "Member, EXECUTIVE COUNCIL, K-DISC, KOTTAYAM",
      Academic_Year: "2018-2019",
      Period: "30/03/2018 - 20/08/2022",
    },
  ],
  researchInterests: [
    {
      Title:
        "Big Data Analytics — Sentiment Analysis, WSN, IoT, Mobile Networks, Automation",
    },
    {
      Title:
        "Cloud Computing — Security aspects, Networking, Ethical Hacking",
    },
  ],
  achievements: [
    {
      Title:
        "First Ph.D. in Computer Science & Engg., College of Engineering Trivandrum (2000)",
    },
  ],
  activityLog: [
    {
      Title:
        "Doctoral Committee Meeting at Jyothi Engg College (Candidate: Bisna Jose)",
      Academic_Year: "2021-2022",
      Date: "19/11/2022",
    },
  ],
  patents: [
    {
      Patent_No: "",
      Inventor: "",
      Year: "",
      Status: "",
    },
  ],
  administrativeWork: [
    {
      Work:
        "Director, School of Computer Sciences, MGU, Kottayam — Academic and Research Coordination (2011–2014)",
      Academic_Year: "2018-2019",
    },
  ],
  professionalMemberships: [
    {
      Body: "ISTE",
      Type: "Lifetime Membership",
      Member_ID: "LM 14153",
      Since: "1985",
      Description:
        "Member from 1985, Life member from 1993, 2× Managing Committee Member, 2× Chapter President, Awarded Best Chapter (2003, 2004)",
    },
  ],
};

/* ======================================================
   ⚙️ Export to Excel (Single)
====================================================== */
const exportToExcel = (sheetName, dataArray) => {
  const ws = XLSX.utils.json_to_sheet(dataArray);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${sheetName.replace(/\s+/g, "_")}_Export.xlsx`);
};

/* ======================================================
   🧭 Main Component
====================================================== */
const AdminExcelExport = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logging out...");
    setTimeout(() => (window.location.href = "/login"), 1000);
  };

  const userName = localStorage.getItem("name") || "Admin";
  const userGmail = localStorage.getItem("gmail") || "admin@jec.ac.in";

  const sections = Object.keys(data).map((key) => ({
    name: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    key,
  }));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Header */}
      <AdminHeader
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        userName={userName}
        userGmail={userGmail}
        handleLogout={handleLogout}
      />

      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#F5F9FF",
          height: "100vh",
          overflowY: "auto", // ✅ Scrollable
          p: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar />

        <Typography
          variant="h4"
          fontWeight={700}
          color="#0D47A1"
          textAlign="center"
          mb={2}
        >
          📊 Service Book Data Export
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          mb={5}
        >
          Export each Service Book section or download all 21 sections together.
        </Typography>

        {/* Cards */}
        <Grid container spacing={3} justifyContent="center">
          {sections.map((section, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
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
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <TableChart sx={{ fontSize: 35 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#1565C0"
                    mb={1}
                  >
                    {section.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {data[section.key]?.length || 0} record(s)
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<Download />}
                    onClick={() =>
                      exportToExcel(section.name, data[section.key] || [])
                    }
                    sx={{
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                      fontWeight: 600,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                      },
                    }}
                  >
                    Download Excel
                  </Button>
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
                XLSX.utils.book_append_sheet(
                  wb,
                  ws,
                  key.charAt(0).toUpperCase() + key.slice(1)
                );
              });
              const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
              saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                "ServiceBook_All_Sections.xlsx"
              );
              toast.success("✅ All sections exported successfully!");
            }}
            sx={{
              background:
                "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              fontWeight: 700,
              px: 4,
              py: 1.2,
              "&:hover": {
                background:
                  "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
              },
            }}
          >
            Export All Sections (Combined)
          </Button>
        </Box>
      </Box>
      <ToastContainer position="top-center" autoClose={2000} />
    </Box>
  );
};

export default AdminExcelExport;
