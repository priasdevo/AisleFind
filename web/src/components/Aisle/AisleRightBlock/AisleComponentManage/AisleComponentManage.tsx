import { Typography } from "@mui/material";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { ButtonLine, SmallIconButton } from "../../styled";
import { MODE_INSTRUCTION_1, MODE_INSTRUCTION_2 } from "./constants";

interface AisleComponentManageProps {
  name: string;
  canEdit?: boolean;
  changeMode: Function;
  mode: number;
  focusText: string;
}

const AisleComponentManage = (props: AisleComponentManageProps) => {
  const { name, canEdit, changeMode, mode, focusText } = props;
  const isFocus = focusText === name;
  return (
    <>
      <Typography
        variant="subtitle1"
        sx={{ alignSelf: "flex-start", marginLeft: "2.5vw" }}
      >
        {name}
      </Typography>
      <ButtonLine>
        <SmallIconButton
          onClick={() => {
            changeMode(1, name);
          }}
          sx={{ background: isFocus && mode === 1 ? "#C26625" : "#FCA86C" }}
        >
          <AiOutlinePlus size={14} />
        </SmallIconButton>
        {canEdit && (
          <SmallIconButton
            onClick={() => {
              changeMode(2, name);
            }}
            sx={{ background: isFocus && mode === 2 ? "#C26625" : "#FCA86C" }}
          >
            <MdOutlineEdit size={14} />
          </SmallIconButton>
        )}
        <SmallIconButton
          onClick={() => {
            changeMode(3, name);
          }}
          sx={{ background: isFocus && mode === 3 ? "#C26625" : "#FCA86C" }}
        >
          <MdOutlineDelete size={14} />
        </SmallIconButton>
      </ButtonLine>
      {isFocus && (
        <Typography
          variant="subtitle1"
          sx={{ alignSelf: "flex-start", marginLeft: "2.5vw" }}
        >
          {MODE_INSTRUCTION_1[mode]}
          {name}
          {MODE_INSTRUCTION_2[mode]}
        </Typography>
      )}
    </>
  );
};
export default AisleComponentManage;
