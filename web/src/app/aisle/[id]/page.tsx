"use client";
import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import AisleGrid from "@/components/Aisle/AisleGrid";
import Header from "@/components/header";
import { usePathname } from "next/navigation";

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
      <Box display="flex" height="100vh" width="100vw" justifyContent="center">
        <AisleGrid isOwner={true} />
      </Box>
    </div>
  );
};

export default AislePage;
