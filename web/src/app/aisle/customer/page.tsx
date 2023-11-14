import React from "react";
import { Container, Box } from "@mui/material";
import AisleGrid2 from "@/components/Aisle/AisleGrid2";
import Header from "@/components/header";

const AislePage = () => {
  return (
    <div>
      <Header />
      <Box display="flex" height="90vh" width="100vw" justifyContent="center">
        <AisleGrid2 isOwner={false} />
      </Box>
    </div>
  );
};

export default AislePage;
