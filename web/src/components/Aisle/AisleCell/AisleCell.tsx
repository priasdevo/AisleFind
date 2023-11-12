"use client";
import React from "react";
import { AisleCellStyle } from "./styled";
import { BACKGROUND_COLOR, BORDER } from "./constants";
import { text } from "stream/consumers";

interface AisleCellProps {
  isOwner: boolean;
  startColumn: number;
  columnSpan: number;
  startRow: number;
  rowSpan: number;
  selected?: boolean;
  status?: string;
  onClick: Function;
  text?: string;
  type?: string;
}

const AisleCell = (props: AisleCellProps) => {
  const {
    isOwner,
    startColumn,
    columnSpan,
    startRow,
    rowSpan,
    onClick,
    selected,
    status,
    text,
    type,
  } = props;
  const border = selected ? BORDER["SELECTED"] : isOwner ? BORDER["OWNER"] : "";
  const background_color = selected
    ? BACKGROUND_COLOR["SELECTED"]
    : status
    ? BACKGROUND_COLOR[status]
    : "";
  return (
    <AisleCellStyle
      style={{
        maxHeight: type === "DOOR" ? "20px" : "",
        minHeight: type === "DOOR" ? "20px" : "50px",
        marginTop: type === "DOOR" ? "70px" : "",
        border: border,
        backgroundColor: background_color,
        gridColumnStart: startColumn,
        gridColumnEnd: startColumn + columnSpan,
        gridRowStart: startRow,
        gridRowEnd: startRow + rowSpan,
      }}
      onClick={() => {
        onClick();
      }}
    >
      {type === "CASHIER" ? "แคชเชียร์" : type === "DOOR" ? "ประตู" : text}
    </AisleCellStyle>
  );
};

export default AisleCell;
