"use client";
import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import AisleGrid from "@/components/Aisle/AisleGrid";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
const mockPositions = [
  [1, 1, 2, 2], // This will span from row 1-3 and column 1-3
  [3, 3, 1, 2], // This will span from row 3-4 and column 3-4
  // ... add more positions as needed
];

const AislePage = () => {
  const pathName = usePathname();
  const [id, setId] = useState<string | undefined>(); // State is now explicitly typed

  useEffect(() => {
    const match = pathName.match(/\/aisle\/([^\/]+)/i);
    if (match) {
      setId(match[1]);
    }
  }, [pathName]);

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
