import React from "react";
import { Box, Typography } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";

function Journalpublicationdetail() {
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
      <ArticleIcon sx={{ fontSize: 70, color: "#2e7d32", mb: 2 }} />

      <Typography
        variant="h5"
        fontWeight={600}
        gutterBottom
      >
        Journal Publication Details
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 420 }}
      >
        This section is currently under maintenance.
        Please check back later once updates are completed.
      </Typography>
    </Box>
  );
}

export default Journalpublicationdetail;
