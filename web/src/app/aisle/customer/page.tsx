import React from "react";
import { Container, Box } from "@mui/material";
import AisleGrid2 from "@/components/Aisle/AisleGrid2";
import Header from "@/components/header";
const mockPositions = [
  [1, 1, 2, 2], // This will span from row 1-3 and column 1-3
  [3, 3, 1, 2], // This will span from row 3-4 and column 3-4
  // ... add more positions as needed
];

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
        <AisleGrid2
          isOwner={false}
          width={7}
          height={7}
          positions={mockPositions as [number, number, number, number][]}
        />
      </Box>
    </div>
  );
};

export default AislePage;
