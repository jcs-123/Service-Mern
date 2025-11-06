import React, { useState, useEffect } from "react";
import {
  Box,
  Toolbar,
  Typography,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import CountUp from "react-countup";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const drawerWidth = 240;

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const userName = localStorage.getItem("name") || "Admin";
  const userGmail = localStorage.getItem("gmail") || "admin@jec.ac.in";

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logging out...");
    setTimeout(() => (window.location.href = "/login"), 1000);
  };

  /* ======================================================
     📊 Fetch Dashboard Counts
  ====================================================== */
  useEffect(() => {
    const fetchCounts = async () => {
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
          interestsubject: "/api/interest/get",
          activityLog: "/api/activity/get",
          patents: "/api/patents/get", // ✅ Added
          mooc: "/api/mooc/get", // ✅ Added
          administrativeWork: "/api/administrative/get",
           professionalBody: "/api/professional-body/get",
        };

        const results = await Promise.all(
          Object.entries(endpoints).map(async ([key, url]) => {
            try {
              const res = await axios.get(`${API_URL}${url}`);
              const arr = res.data.data || res.data || [];
              return [key, Array.isArray(arr) ? arr.length : 0];
            } catch {
              return [key, 0];
            }
          })
        );

        setStats(Object.fromEntries(results));
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data!");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  /* ======================================================
     🎨 Section Metadata
  ====================================================== */
  const sectionMeta = [
    { key: "generalDetails", title: "General Details", color: "#667eea", icon: "👤" },
    { key: "qualifications", title: "Qualifications", color: "#f093fb", icon: "🎓" },
    { key: "experience", title: "Experience", color: "#4facfe", icon: "💼" },
    { key: "subjectEngaged", title: "Subject Engaged", color: "#43e97b", icon: "📚" },
    { key: "publications", title: "Publications", color: "#fa709a", icon: "📄" },
    { key: "programsCoordinated", title: "Programs Coordinated", color: "#ffecd2", icon: "🎯" },
    { key: "programsAttended", title: "Programs Attended", color: "#c6ffdd", icon: "🗓️" },
    { key: "consultancies", title: "Consultancies", color: "#ff9a9e", icon: "💡" },
    { key: "facultyResearch", title: "Faculty Research", color: "#a18cd1", icon: "🔬" },
    { key: "projectsGuided", title: "Projects Guided", color: "#fad0c4", icon: "👨‍🏫" },
    { key: "seminarsGuided", title: "Seminars Guided", color: "#8fd3f4", icon: "🎤" },
    { key: "interactions", title: "Outside Interactions", color: "#fbc2eb", icon: "🌐" },
    { key: "positions", title: "Positions Held", color: "#84fab0", icon: "⭐" },
    { key: "researchInterests", title: "Research Interests", color: "#d299c2", icon: "🎯" },
    { key: "achievements", title: "Achievements", color: "#fdbb2d", icon: "🏆" },
    { key: "interestsubject", title: "Interested Subjects", color: "#8EC5FC", icon: "❤️" },
    { key: "activityLog", title: "Activity Log", color: "#FFDEE9", icon: "📊" },
    { key: "patents", title: "Patents", color: "#FF9A8B", icon: "📜" },
    { key: "mooc", title: "MOOC Courses", color: "#6A11CB", icon: "💻" },
    { key: "administrativeWork", title: "Administrative Work", color: "#3E5151", icon: "⚙️" },
    { key: "professionalBody", title: "Professional Body", color: "#13547A", icon: "🏛️" },
  ];

  /* ======================================================
     📈 Chart Data
  ====================================================== */
  const chartData = sectionMeta.map((s) => ({
    name: s.title,
    count: stats[s.key] ?? 0,
  }));

  const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);
  const completedSections = Object.values(stats).filter((n) => n > 0).length;
  const totalSections = Object.keys(stats).length;

  /* ======================================================
     🧭 UI
  ====================================================== */
  return (
    <Box sx={{ display: "flex", background: "#f4f6fb", minHeight: "100vh" }}>
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

      {/* ✅ Scrollable Section */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#f4f6fb",
          p: isMobile ? 2 : 3,
          overflowY: "auto",
          height: "100vh",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#90caf9",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#1565c0",
          },
        }}
      >
        <Toolbar />

        {/* 🌟 Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} color="#0D47A1">
            Welcome, {userName} 👋
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Comprehensive overview of all Service Book records.
          </Typography>
        </motion.div>

        {/* 🌀 Loading */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
            <CircularProgress color="primary" />
            <Typography mt={2} color="text.secondary">
              Loading dashboard data...
            </Typography>
          </Box>
        ) : (
          <>
            {/* 🟩 Stat Cards */}
            <Grid container spacing={2.5}>
              {sectionMeta.map(({ key, title, color, icon }, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <StatCard
                      color={color}
                      title={title}
                      value={stats[key] ?? 0}
                      icon={icon}
                      isMobile={isMobile}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* 📊 Chart */}
            <Box mt={6}>
              <Typography variant="h6" fontWeight={700} color="#0D47A1" mb={2}>
                Overview by Section
              </Typography>
              <Card sx={{ p: 2, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#42A5F5" animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Box>

            {/* 🧾 Summary */}
            <Box
              mt={5}
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              gap={2}
              mb={3}
            >
              <SummaryChip label="Total Records" value={totalRecords} color="#1565C0" />
              <SummaryChip label="Completed Sections" value={completedSections} color="#43A047" />
              <SummaryChip
                label="Pending Sections"
                value={totalSections - completedSections}
                color="#E53935"
              />
            </Box>
          </>
        )}
      </Box>

      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </Box>
  );
};

/* ======================================================
   🔹 Stat Card with CountUp Animation
====================================================== */
const StatCard = ({ color, title, value, icon, isMobile }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${color}, ${color}99)`,
      borderRadius: 3,
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease-in-out",
      minHeight: isMobile ? 100 : 140,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
      },
    }}
  >
    <CardContent>
      <Typography
        variant={isMobile ? "h4" : "h3"}
        fontWeight="bold"
        sx={{ mb: 0.5, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
      >
        <CountUp end={value} duration={1.5} separator="," />
      </Typography>
      <Typography fontWeight={600}>
        {icon} {title}
      </Typography>
    </CardContent>
  </Card>
);

/* ======================================================
   🔹 SummaryChip
====================================================== */
const SummaryChip = ({ label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Box
      sx={{
        background: color,
        color: "white",
        px: 3,
        py: 1,
        borderRadius: 3,
        fontWeight: 600,
        fontSize: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {label}: {value}
    </Box>
  </motion.div>
);

export default AdminDashboard;
