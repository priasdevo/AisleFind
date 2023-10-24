"use client";
import React from "react";
import {
  AisleGridWrapper,
  AisleSubGrid,
  ButtonLine,
  LeftBlock,
  RightBlock,
  SmallIconButton,
} from "./styled";
import useAisle from "@/hooks/useAisle";
import AisleCell from "./AisleCell/AisleCell";
import { Typography } from "@mui/material";
import { AiOutlinePlus, AiOutlineShop } from "react-icons/ai";
import { GrDocumentText } from "react-icons/gr";
import { IoMdStats } from "react-icons/io";
import { CONFIRMKEYWORD } from "./constants";
import AisleComponentManage from "./AisleRightBlock/AisleComponentManage/AisleComponentManage";
import AisleRightBlock from "./AisleRightBlock/AisleRightBlock";

interface AisleGridProps {
  isOwner: boolean;
  width: number;
  height: number;
  positions: [number, number, number, number][];
}

const AisleGrid = (props: AisleGridProps) => {
  const { isOwner, width, height } = props;
  const gridTemplateColumns = `repeat(${width}, 50px)`;
  const gridTemplateRows = `repeat(${height}, 50px)`;
  const {
    cellDetails,
    cellClickHandle,
    changeMode,
    confirmTrigger,
    mode,
    objectText,
  } = useAisle();
  console.log("AisleGrid render");

  return (
    <AisleGridWrapper>
      {/* Left content */}
      <LeftBlock>
        <Typography variant="h6">ร้าน XXX 1</Typography>
        <SmallIconButton
          sx={{
            width: "auto",
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            padding: "10px",
          }}
        >
          {"แก้ไขโครงสร้างร้าน"}
          <AiOutlineShop size={14} />
        </SmallIconButton>
        <SmallIconButton
          sx={{
            width: "auto",
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            padding: "10px",
          }}
        >
          {"แก้ไขข้อมูลสินค้า"}
          <GrDocumentText size={14} />
        </SmallIconButton>
        <SmallIconButton
          sx={{
            width: "auto",
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            padding: "10px",
          }}
        >
          {"ดูสถิติ"}
          <IoMdStats size={14} />
        </SmallIconButton>
        {/* Add any other content for the left side here */}
      </LeftBlock>

      <AisleSubGrid
        gridTemplateColumns={gridTemplateColumns}
        gridTemplateRows={gridTemplateRows}
      >
        {cellDetails.map((cell) => (
          <AisleCell
            key={`empty-${cell.startRow}-${cell.startColumn}`}
            isOwner={isOwner}
            startColumn={cell.startColumn}
            columnSpan={cell.columnSpan}
            startRow={cell.startRow}
            rowSpan={cell.rowSpan}
            selected={cell.selected}
            status={cell.status}
            onClick={() => {
              cellClickHandle(cell.startRow, cell.startColumn);
            }}
          />
        ))}
      </AisleSubGrid>
      <AisleRightBlock
        changeMode={changeMode}
        mode={mode}
        objectText={objectText!}
        confirmTrigger={confirmTrigger}
      />
    </AisleGridWrapper>
  );
};

export default AisleGrid;
