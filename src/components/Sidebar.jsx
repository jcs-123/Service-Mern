import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useMediaQuery,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
  Person,
  School,
  Work,
  MenuBook,
  Article,
  EventAvailable,
  EventNote,
  Science,
  Build,
  Folder,
  Forum,
  Public,
  Interests,
  EmojiEvents,
  History,
  Lightbulb,
  LibraryBooks,
  WorkspacePremium,
  MilitaryTech,
  AccountTree,
  Logout,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* =====================
   RESPONSIVE DRAWER WIDTH
   ===================== */
const drawerWidth = {
  xs: 220, // mobile
  sm: 240, // desktop
};

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();

  /* Auto-open Research Profile if child route active */
  const [openResearch, setOpenResearch] = React.useState(
    location.pathname.startsWith("/publications")
  );

  const forms = [
    { text: "1. General Details", icon: <Person />, path: "/GeneralDetail" },
    { text: "2. Qualifications", icon: <School />, path: "/Qualification" },
    { text: "3. Experience", icon: <Work />, path: "/Experience" },
    { text: "4. Subject Engaged", icon: <MenuBook />, path: "/SubjectEngaged" },

    {
      text: "5. Research Profile",
      icon: <Article />,
      children: [
        { text: "5A. Journal Publication Details", path: "/publications/journal" },
        { text: "5B. Conference Publication Details", path: "/publications/conference" },
        { text: "5C. Book & Book Chapter Publications", path: "/publications/book" },
        { text: "5D. Research ID", path: "/publications/research-id" },
      ],
    },

    { text: "6. Patent", icon: <Lightbulb />, path: "/Patent" },
    { text: "7. Programs Co-ordinated", icon: <EventAvailable />, path: "/ProgramsCoordinated" },
    { text: "8. Programs Attended", icon: <EventNote />, path: "/ProgramsAttended" },
    { text: "9. MOOC Course", icon: <LibraryBooks />, path: "/MoocCourseCompleted" },
    { text: "10. Faculty Research", icon: <Science />, path: "/FacultyReserach" },
    { text: "11. Consultancies", icon: <Build />, path: "/Consultancy" },
    { text: "12. Project Guided", icon: <Folder />, path: "/ProjectGuided" },
    { text: "13. Seminar Guided", icon: <Forum />, path: "/SeminarsGuided" },
    { text: "14. Outside Interactions", icon: <Public />, path: "/InteractionsOutsideWorld" },
    { text: "15. Positions Held / Other Responsibilities", icon: <AccountTree />, path: "/PositionsHeld" },
    { text: "16. Research Interests", icon: <Interests />, path: "/ResearchInterests" },
    { text: "17. Achievements", icon: <EmojiEvents />, path: "/Achievements" },
    { text: "18. Activity Log", icon: <History />, path: "/ActivityLog" },
    { text: "19. Administrative Work", icon: <WorkspacePremium />, path: "/AdministrativeWork" },
    { text: "20. Professional Body", icon: <MilitaryTech />, path: "/Professional" },
  ];

  const handleLogout = () => {
    toast.info("Logging out... 👋", { autoClose: 1200 });
    setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, 1000);
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <List sx={{ px: 1 }}>
        {forms.map((item) => {
          /* ================= RESEARCH PROFILE ================= */
          if (item.children) {
            const isAnyChildActive = item.children.some(
              (child) => location.pathname === child.path
            );

            return (
              <Box key={item.text}>
                <ListItemButton
                  onClick={() => setOpenResearch(!openResearch)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.4,
                    backgroundColor: isAnyChildActive
                      ? "rgba(25,118,210,0.12)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(25,118,210,0.08)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isAnyChildActive
                        ? "#1976d2"
                        : "rgba(0,0,0,0.6)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isAnyChildActive ? 600 : 500,
                      fontSize: "0.85rem",
                      color: isAnyChildActive ? "#1976d2" : "#2c3e50",
                    }}
                  />

                  {openResearch ? (
                    <ExpandLess sx={{ color: isAnyChildActive ? "#1976d2" : "inherit" }} />
                  ) : (
                    <ExpandMore sx={{ color: isAnyChildActive ? "#1976d2" : "inherit" }} />
                  )}
                </ListItemButton>

                <Collapse in={openResearch} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path;

                      return (
                        <ListItemButton
                          key={child.text}
                          component={Link}
                          to={child.path}
                          onClick={isMobile ? handleDrawerToggle : undefined}
                          sx={{
                            pl: 5,
                            borderRadius: 2,
                            mb: 0.3,
                            backgroundColor: isChildActive
                              ? "rgba(25,118,210,0.12)"
                              : "transparent",
                          }}
                        >
                          <ListItemText
                            primary={child.text}
                            primaryTypographyProps={{
                              fontSize: "0.8rem",
                              fontWeight: isChildActive ? 600 : 500,
                              color: isChildActive ? "#1976d2" : "#2c3e50",
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          /* ================= NORMAL ITEMS ================= */
          const isActive = location.pathname === item.path;

          return (
            <Tooltip key={item.text} title={isMobile ? "" : item.text} placement="right" arrow>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  mb: 0.4,
                  backgroundColor: isActive
                    ? "rgba(25,118,210,0.12)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(25,118,210,0.08)",
                    transform: "translateX(3px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "#1976d2" : "rgba(0,0,0,0.6)",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.85rem",
                    color: isActive ? "#1976d2" : "#2c3e50",
                  }}
                />
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ mt: "auto" }}>
        <Divider />
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon sx={{ color: "#f44336" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ color: "#f44336", fontWeight: 600 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth.xs,
            top: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP DRAWER */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth.sm,
            top: "64px",
            height: "calc(100% - 64px)",
            boxShadow: "6px 0 12px rgba(0,0,0,0.25)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
