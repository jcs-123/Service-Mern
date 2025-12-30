import React from "react";
import { Box, Typography } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";

function Bookchapterpublication() {
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
      <BuildIcon sx={{ fontSize: 70, color: "#ff9800", mb: 2 }} />

      <Typography
        variant="h5"
        fontWeight={600}
        color="text.primary"
        gutterBottom
      >
        Book & Book Chapter Publications
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 420 }}
      >
        This section is currently under maintenance.
        Please check back later once the update is completed.
      </Typography>
    </Box>
  );
}

export default Bookchapterpublication;
