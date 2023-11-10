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
        maxHeight: text === "ประตู" ? "20px" : "",
        minHeight: text === "ประตู" ? "20px" : "50px",
        marginTop: text === "ประตู" ? "70px" : "",
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
      {text}
    </AisleCellStyle>
  );
};

export default AisleCell;
