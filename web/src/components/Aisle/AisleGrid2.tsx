"use client";
import React, { useEffect, useState } from "react";
import {
  AisleGridWrapper,
  AisleSubGrid,
  LeftBlock,
  RightBlock,
} from "./styled";
import useAisleCustomer from "@/hooks/useAisleCustomer";
import AisleCell from "./AisleCell/AisleCell";
import { Typography } from "@mui/material";
import useStore from "@/hooks/useStore";
import AisleItemListModal from "./AisleItemListModal/AisleItemListModal";

interface AisleGridProps {
  isOwner: boolean;
}

const AisleGrid2 = (props: AisleGridProps) => {
  const { isOwner } = props;

  const {
    cellDetails,
    itemList,
    selectedShop,
    setSelectedShop,
    store,
    selectItem,
    selectedItem,
    selected,
    selectCell,
  } = useAisleCustomer();
  const gridTemplateColumns = `repeat(${store?.size_x}, 50px)`;
  const gridTemplateRows = `repeat(${store?.size_y}, 50px)`;
  const { allStore } = useStore();
  const [searchValue, setSearchValue] = useState("");
  const [searchValue2, setSearchValue2] = useState("");

  const filteredShops = allStore.filter(
    (shop) =>
      shop.title.includes(searchValue2) ||
      shop.description.includes(searchValue2)
  );

  console.log("Prias itemList test : ", itemList);
  const filteredItems =
    itemList.length !== 0
      ? itemList.filter(
          (item) =>
            item.title.includes(searchValue) ||
            item.description.includes(searchValue)
        )
      : [];
  const shelfItem =
    itemList.length !== 0
      ? itemList.filter((item) => item.layout_id === selected?.id)
      : [];
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
                  backgroundColor: shop.id === selectedShop ? "#FFD5B5" : "",
                }}
                onClick={() => {
                  setSelectedShop(shop.id);
                }}
              >
                <Typography variant="body1">{shop.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {shop.description}
                </Typography>
              </div>
            );
          })}
        </div>
        {/* ... add more shops as needed */}
      </LeftBlock>

      {selectedShop !== -1 && (
        <AisleSubGrid
          gridTemplateColumns={gridTemplateColumns}
          gridTemplateRows={gridTemplateRows}
          style={{ position: "relative" }}
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
                selectCell(cell.id!);
              }}
            />
          ))}
          <AisleItemListModal
            isOpen={selected !== null && !selected.selected!}
            left={selected?.startColumn! + selected?.columnSpan! - 1}
            top={selected?.startRow! + selected?.rowSpan! - 1}
          >
            {shelfItem.map((item, index) => (
              <div
                key={item.id}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="body1">{item.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {item.description}
                </Typography>
              </div>
            ))}
          </AisleItemListModal>
        </AisleSubGrid>
      )}
      {selectedShop !== -1 && (
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
                key={item.id}
                style={{
                  width: "100%",
                  backgroundColor:
                    selectedItem === parseInt(item.id) ? "#FFEBDC" : "",
                  padding: "12px",
                  borderRadius: "8px",
                }}
                onClick={() => {
                  selectItem(parseInt(item.id), item.layout_id);
                }}
              >
                <Typography variant="body1">{item.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {item.description}
                </Typography>
              </div>
            ))}
          </div>
          {/* ... add more shops as needed */}
        </RightBlock>
      )}
    </AisleGridWrapper>
  );
};

export default AisleGrid2;
