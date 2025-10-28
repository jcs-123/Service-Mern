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
  Favorite,
  History,
  Lightbulb,
  LibraryBooks,
  WorkspacePremium,
  MilitaryTech,
  AccountTree,
  Logout,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();

  const forms = [
    { text: "1. General Details", icon: <Person />, path: "/GeneralDetail" },
    { text: "2. Qualifications", icon: <School />, path: "/Qualification" },
    { text: "3. Experience", icon: <Work />, path: "/form/3" },
    { text: "4. Subject Engaged", icon: <MenuBook />, path: "/SubjectEngaged" },
    { text: "5. Publications", icon: <Article />, path: "/Publications" },
    { text: "6. Programs Co-ordinated", icon: <EventAvailable />, path: "/ProgramsCoordinated" },
    { text: "7. Programs Attended", icon: <EventNote />, path: "/ProgramsAttended" },
    { text: "8. Faculty Research", icon: <Science />, path: "/form/8" },
    { text: "9. Consultancies", icon: <Build />, path: "/form/9" },
    { text: "10. Project Guided", icon: <Folder />, path: "/form/10" },
    { text: "11. Seminars Guided", icon: <Forum />, path: "/form/11" },
    { text: "12. Outside Interactions", icon: <Public />, path: "/form/12" },
    { text: "13. Research Interests", icon: <Interests />, path: "/form/13" },
    { text: "14. Achievements", icon: <EmojiEvents />, path: "/form/14" },
    { text: "15. Interested Subjects", icon: <Favorite />, path: "/form/15" },
    { text: "16. Activity Log", icon: <History />, path: "/form/16" },
    { text: "17. Patent", icon: <Lightbulb />, path: "/form/17" },
    { text: "18. MOOC Course", icon: <LibraryBooks />, path: "/form/18" },
    { text: "19. Administrative Work", icon: <WorkspacePremium />, path: "/form/19" },
    { text: "20. Professional Body", icon: <MilitaryTech />, path: "/form/20" },
    { text: "21. Additional Info", icon: <AccountTree />, path: "/form/21" },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(180deg, #ffffff 0%, #f4f9ff 100%)",
      }}
    >
      {/* === Sidebar Items === */}
      <Box sx={{ py: 1 }}>
        <List disablePadding sx={{ px: 1 }}>
          {forms.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={item.text}
                title={isMobile ? "" : item.text}
                placement="right"
                arrow
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                  sx={{
                    borderRadius: 2,
                    mb: 0.4,
                    transition: "all 0.2s ease-in-out",
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
                      color: isActive ? "#1976d2" : "rgba(0,0,0,0.6)",
                      minWidth: 40,
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
      </Box>

      {/* === Logout Button (Bottom) === */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ borderColor: "rgba(0,0,0,0.2)" }} />
        <Box sx={{ p: 1.5 }}>
          <ListItemButton
            onClick={() => alert("Logout Clicked")}
            sx={{
              borderRadius: 2,
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(244,67,54,0.08)",
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#f44336" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 600,
                color: "#f44336",
                fontSize: "0.9rem",
              }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* === Mobile Drawer === */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100% - 64px)",
            borderRight: "2px solid black", // 🔥 black border for mobile
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* === Desktop Drawer === */}
   <Drawer
  variant="permanent"
  sx={{
    display: { xs: "none", sm: "block" },
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      top: "64px",
      height: "calc(100% - 64px)",
      background: "linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)",
      borderRight: "2px solid #000", // ⚫ dark black border
      boxShadow: "6px 0 12px rgba(0, 0, 0, 0.25)", // 🌫️ stronger sidebar shadow
      transition: "all 0.3s ease-in-out",
    },
  }}
  open
>
  {drawerContent}
</Drawer>

    </>
  );
};

export default Sidebar;
