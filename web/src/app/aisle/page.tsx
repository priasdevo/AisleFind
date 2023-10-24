import React from "react";
import { Container, Box } from "@mui/material";
import AisleGrid from "@/components/Aisle/AisleGrid";
const mockPositions = [
  [1, 1, 2, 2], // This will span from row 1-3 and column 1-3
  [3, 3, 1, 2], // This will span from row 3-4 and column 3-4
  // ... add more positions as needed
];

const AislePage = () => {
  console.log("Page render");
  return (
    <div>
      <Box
        display="flex"
        height="100vh"
        width="100vw"
        alignItems="center"
        justifyContent="center"
      >
        <AisleGrid
          isOwner={true}
          width={7}
          height={7}
          positions={mockPositions as [number, number, number, number][]}
        />
      </Box>
    </div>
  );
};

export default AislePage;
