import { Typography } from "@mui/material";
import React from "react";
import { CONFIRMKEYWORD } from "../constants";
import { RightBlock, SmallIconButton } from "./styled";
import AisleComponentManage from "./AisleComponentManage/AisleComponentManage";
import AisleItemManage from "./AisleItemManage/AisleItemManage";
import { ItemPos } from "@/hooks/useAisle";
import AisleItemModal from "../AisleItemModal/AisleItemModal";

interface AisleRightBlockProps {
  name?: string[];
  canEdit?: boolean[];
  changeMode: Function;
  mode: number;
  objectText: string;
  confirmTrigger: Function;
  itemList: ItemPos[];
  confirmItem: Function;
  shelfName: string;
  selectItem: Function;
}

const AisleRightBlock = (props: AisleRightBlockProps) => {
  const {
    changeMode,
    mode,
    objectText,
    confirmTrigger,
    itemList,
    confirmItem,
    shelfName,
    selectItem,
  } = props;
  let selectItemCount = 0;
  const canEdit = [true, true, false];
  const name = ["ชั้นวาง", "ประตู", "แคชเชียร์"];
  return (
    <RightBlock>
      {mode <= 3 && <Typography variant="h6">แก้ไขโครงสร้างร้าน</Typography>}
      {mode <= 3 &&
        name.map((nameS, index) => {
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
      {mode >= 4 && mode <= 7 && (
        <>
          <Typography variant="h6">แก้ไขสินค้าในร้าน</Typography>
          <AisleItemManage
            changeMode={changeMode}
            mode={mode}
            objectText={""}
            confirmTrigger={confirmTrigger}
          />
          <hr style={{ width: "100%" }} />
          {itemList.map((item, index) => {
            if (item.selected) {
              selectItemCount += 1;
            }
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  width: "100%",
                  backgroundColor: item.selected ? "#FFEBDC" : "",
                }}
                key={`ItemwithIndex${index}`}
                onClick={() => selectItem(index)}
              >
                <Typography variant="subtitle1" sx={{ width: "100%" }}>
                  {item.itemName}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ width: "100%", color: "#8F8F8F", marginTop: "-15px" }}
                >
                  {item.location} {item.description}
                </Typography>
              </div>
            );
          })}
        </>
      )}

      {mode !== 0 && mode < 4 && (
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
      <AisleItemModal
        isShow={mode === 5 || mode === 6 || selectItemCount !== 0}
        shelfName={shelfName}
        cancel={() => changeMode(4, "")}
        confirm={confirmItem}
        mode={mode}
      />
    </RightBlock>
  );
};

export default AisleRightBlock;
