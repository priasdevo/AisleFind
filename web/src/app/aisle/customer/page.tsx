import React from "react";
import { Container, Box } from "@mui/material";
import AisleGrid2 from "@/components/Aisle/AisleGrid2";
import Header from "@/components/header";

const AislePage = () => {
  console.log("Page render");
  return (
    <div>
      <Header />
      <Box
        display="flex"
        height="100vh"
        width="100vw"
        alignItems="center"
        justifyContent="center"
      >
        <AisleGrid2 isOwner={false} />
      </Box>
    </div>
  );
};

export default AislePage;
