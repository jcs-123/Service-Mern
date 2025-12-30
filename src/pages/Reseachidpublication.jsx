import React from "react";
import { Box, Typography } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";

function Reseachidpublication() {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#f9fafb",
        borderRadius: 2,
        p: 4,
      }}
    >
      <BadgeIcon sx={{ fontSize: 70, color: "#6a1b9a", mb: 2 }} />

      <Typography
        variant="h5"
        fontWeight={600}
        gutterBottom
      >
        Research ID
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 420 }}
      >
        This section is currently under maintenance.
        Please check back later for updates.
      </Typography>
    </Box>
  );
}

export default Reseachidpublication;
