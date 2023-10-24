import { Typography } from "@mui/material";
import React from "react";
import { CONFIRMKEYWORD } from "../constants";
import { RightBlock, SmallIconButton } from "./styled";
import AisleComponentManage from "./AisleComponentManage/AisleComponentManage";

interface AisleRightBlockProps {
  name?: string[];
  canEdit?: boolean[];
  changeMode: Function;
  mode: number;
  objectText: string;
  confirmTrigger: Function;
}

const AisleRightBlock = (props: AisleRightBlockProps) => {
  const { changeMode, mode, objectText, confirmTrigger } = props;
  const canEdit = [true, true, false];
  const name = ["ชั้นวาง", "ประตู", "แคชเชียร์"];
  return (
    <RightBlock>
      <Typography variant="h6">แก้ไขโครงสร้างร้าน</Typography>
      {name.map((nameS, index) => {
        return (
          <AisleComponentManage
            name={name[index]}
            changeMode={changeMode}
            mode={mode}
            focusText={objectText!}
            canEdit={canEdit[index]}
          />
        );
      })}
      {mode !== 0 && (
        <SmallIconButton
          sx={{ justifySelf: "flex-end", width: "auto", padding: "10px" }}
          onClick={() => {
            confirmTrigger();
          }}
        >
          {CONFIRMKEYWORD[mode]}
          {objectText}
        </SmallIconButton>
      )}
      {/* Add other buttons or content for the right side here */}
    </RightBlock>
  );
};

export default AisleRightBlock;
