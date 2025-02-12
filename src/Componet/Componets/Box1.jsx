import { Box, Typography } from "@mui/material";
import React from "react";

const Box1 = (props) => {
  return (
    <div>
      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid lightgray",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          width: "300px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="primary">
          {props.title}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, color: "#555" }}>
          {props.number}
        </Typography>
      </Box>
    </div>
  );
};

export default Box1;
