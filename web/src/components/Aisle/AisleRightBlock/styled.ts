import { styled } from "@mui/material";

export const RightBlock = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start; // This will create space between the left content, center grid, and right buttons
  width: 17vw;
  height: 100%;
  align-items: flex-end; // This will align the top edges of the children
  padding: 20px; // Add some padding around the main wrapper
  gap: 15px;
  position: relative;
`;

export const SmallIconButton = styled("div")`
  cursor: pointer;
  display: flex;
  width: 48px;
  height: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #fca86c;
  box-shadow: 2px 2px 20px 0px rgba(0, 0, 0, 0.2);
`;

export const ButtonLine = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 180px;
  gap: 15px;
`;
