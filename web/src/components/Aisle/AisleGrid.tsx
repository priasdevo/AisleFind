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
import { AiOutlineShop } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoMdStats } from "react-icons/io";
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
    itemList,
    confirmItem,
    shelfName,
    selectItem,
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
            background: mode <= 3 ? "#C26625" : "#fca86c",
            color: mode <= 3 ? "white" : "",
          }}
          onClick={() => changeMode(0, "")}
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
            background: mode <= 7 && mode >= 4 ? "#C26625" : "#fca86c",
            color: mode <= 7 && mode >= 4 ? "white" : "",
          }}
          onClick={() => changeMode(4, "")}
        >
          {"แก้ไขข้อมูลสินค้า"}
          <HiOutlineDocumentText size={14} />
        </SmallIconButton>
        <SmallIconButton
          sx={{
            width: "auto",
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            padding: "10px",
            background: mode === 8 ? "#C26625" : "#fca86c",
            color: mode === 8 ? "white" : "",
          }}
          onClick={() => changeMode(8, "")}
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
            text={cell.text}
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
        itemList={itemList}
        confirmItem={confirmItem}
        shelfName={shelfName!}
        selectItem={selectItem}
      />
    </AisleGridWrapper>
  );
};

export default AisleGrid;
