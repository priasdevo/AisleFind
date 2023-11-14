"use client";
import React from "react";
import {
  AisleGridWrapper,
  AisleSubGrid,
  ButtonLine,
  LeftBlock,
  RightBlock,
  SmallIconButton,
  SubGridWrapper,
} from "./styled";
import useAisle from "@/hooks/useAisle";
import AisleCell from "./AisleCell/AisleCell";
import { Typography } from "@mui/material";
import { AiOutlineShop } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoMdStats } from "react-icons/io";
import AisleRightBlock from "./AisleRightBlock/AisleRightBlock";
import StatComponent from "./Stat/StatComponent";

interface AisleGridProps {
  isOwner: boolean;
}

const AisleGrid = (props: AisleGridProps) => {
  const { isOwner } = props;

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
    store,
    selectedItem,
  } = useAisle();
  const gridTemplateColumns = `repeat(${store?.size_x}, 50px)`;
  const gridTemplateRows = `repeat(${store?.size_y}, 50px)`;
  console.log("AisleGrid render");

  return (
    <AisleGridWrapper>
      {/* Left content */}
      <LeftBlock>
        <Typography variant="h6">ร้าน {store?.title}</Typography>
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
      {mode !== 8 && (
        <SubGridWrapper>
          <AisleSubGrid
            gridTemplateColumns={gridTemplateColumns}
            gridTemplateRows={gridTemplateRows}
            columnCount={store?.size_y!}
            rowCount={store?.size_x!}
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
                text={cell.id}
                type={cell.type}
                onClick={() => {
                  cellClickHandle(cell.startRow, cell.startColumn);
                }}
              />
            ))}
          </AisleSubGrid>
        </SubGridWrapper>
      )}
      {mode === 8 && <StatComponent itemList={itemList} />}
      <AisleRightBlock
        changeMode={changeMode}
        mode={mode}
        objectText={objectText!}
        confirmTrigger={confirmTrigger}
        itemList={itemList}
        confirmItem={confirmItem}
        shelfName={shelfName!}
        selectItem={selectItem}
        selectedIndex={selectedItem}
      />
    </AisleGridWrapper>
  );
};

export default AisleGrid;
