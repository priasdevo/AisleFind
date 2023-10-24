import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { ButtonLine, SmallIconButton } from "../styled";

interface AisleItemManageProps {
  name?: string[];
  canEdit?: boolean[];
  changeMode: Function;
  mode: number;
  objectText: string;
  confirmTrigger: Function;
}

const AisleItemManage = (props: AisleItemManageProps) => {
  const { changeMode, mode } = props;
  return (
    <ButtonLine>
      <SmallIconButton
        onClick={() => {
          changeMode(5, "");
        }}
        sx={{ background: mode === 5 ? "#C26625" : "#FCA86C" }}
      >
        <AiOutlinePlus size={14} />
      </SmallIconButton>

      <SmallIconButton
        onClick={() => {
          changeMode(6, "");
        }}
        sx={{ background: mode === 6 ? "#C26625" : "#FCA86C" }}
      >
        <MdOutlineEdit size={14} />
      </SmallIconButton>

      <SmallIconButton
        onClick={() => {
          changeMode(7, "");
        }}
        sx={{ background: mode === 7 ? "#C26625" : "#FCA86C" }}
      >
        <MdOutlineDelete size={14} />
      </SmallIconButton>
    </ButtonLine>
  );
};

export default AisleItemManage;
