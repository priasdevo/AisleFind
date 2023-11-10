"use client";
import React, { useEffect, useState } from "react";
import {
  AisleGridWrapper,
  AisleSubGrid,
  LeftBlock,
  RightBlock,
} from "./styled";
import useAisle from "@/hooks/useAisle";
import AisleCell from "./AisleCell/AisleCell";
import { Typography } from "@mui/material";

interface AisleGridProps {
  isOwner: boolean;
  width: number;
  height: number;
  positions: [number, number, number, number][];
}

const AisleGrid2 = (props: AisleGridProps) => {
  const { isOwner, width, height } = props;
  const gridTemplateColumns = `repeat(${width}, 50px)`;
  const gridTemplateRows = `repeat(${height}, 50px)`;
  const { cellDetails, cellClickHandle, changeMode } = useAisle();
  const [searchValue, setSearchValue] = useState("");
  const [searchValue2, setSearchValue2] = useState("");
  const itemList = [
    { name: "ประเภทสินค้า1", desc: "ชั้นวางที่ 1 ชั้นที่ 2 ฝั่ง ซ้าย" },
    { name: "ประเภทสินค้า2", desc: "ชั้นวางที่ 2 ชั้นที่ 3 ฝั่ง ขวา" },
    { name: "เครื่องดื่มและน้ำ", desc: "ชั้นวางที่ 1 ชั้นที่ 4 ฝั่ง ซ้าย" },
    { name: "ขนมและวิปครีม", desc: "ชั้นวางที่ 3 ชั้นที่ 4 ฝั่ง ขวา" },
    { name: "ของเครื่องใช้บนโต๊ะ", desc: "ชั้นวางที่ 2 ชั้นที่ 2 ฝั่ง ซ้าย" },
  ];

  const shopList = [
    { name: "ร้าน XXX 1", desc: "ชั้นวางที่ 1 ชั้นที่ 2 ฝั่ง ซ้าย" },
    { name: "ร้าน YYY 2", desc: "ชั้นวางที่ 2 ชั้นที่ 3 ฝั่ง ขวา" },
    { name: "ร้าน ZZZ 3", desc: "ชั้นวางที่ 1 ชั้นที่ 4 ฝั่ง ซ้าย" },
    { name: "ร้าน BBB 5", desc: "ชั้นวางที่ 2 ชั้นที่ 2 ฝั่ง ซ้าย" },
  ];

  const filteredShops = shopList.filter(
    (shop) =>
      shop.name.includes(searchValue2) || shop.desc.includes(searchValue2)
  );

  const filteredItems = itemList.filter(
    (item) => item.name.includes(searchValue) || item.desc.includes(searchValue)
  );

  console.log("AisleGrid render");

  return (
    <AisleGridWrapper>
      {/* Left content */}
      <LeftBlock>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            type="text"
            placeholder="ค้นหาร้านค้า"
            style={{ flex: 1, padding: "5px", marginRight: "10px" }}
            value={searchValue2}
            onChange={(e) => setSearchValue2(e.target.value)}
          />
          <button>🔍</button>{" "}
          {/* This is a placeholder search icon; replace with your preferred icon */}
        </div>
        <div
          style={{
            backgroundColor: "#FFEBDC",
            borderRadius: "12px",
            boxShadow: "2px 2px 20px 0px rgba(0, 0, 0, 0.20)",
            padding: "15px",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            style={{ marginTop: "20px", marginBottom: "10px" }}
          >
            ร้านทั้งหมด
          </Typography>
          <hr style={{ width: "100%", marginBottom: "5px" }} />
          {filteredShops.map((shop, index) => {
            return (
              <div
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: index === 0 ? "#FFD5B5" : "",
                }}
              >
                <Typography variant="body1">{shop.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {shop.desc}
                </Typography>
              </div>
            );
          })}
        </div>
        {/* ... add more shops as needed */}
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
      <RightBlock>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="ค้นหาสินค้า"
            style={{ flex: 1, padding: "5px", marginRight: "10px" }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button>🔍</button>{" "}
          {/* This is a placeholder search icon; replace with your preferred icon */}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            padding: "15px",
            height: "100%",
            gap: "5px",
            width: "100%",
          }}
        >
          {filteredItems.map((item, index) => (
            <div
              key={index}
              style={{
                width: "100%",
              }}
              onClick={() => {
                cellClickHandle(1, 1);
              }}
            >
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                {item.desc}
              </Typography>
            </div>
          ))}
        </div>
        {/* ... add more shops as needed */}
      </RightBlock>
    </AisleGridWrapper>
  );
};

export default AisleGrid2;
