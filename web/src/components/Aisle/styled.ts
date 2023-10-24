import { styled } from "@mui/material";

interface StyledCellProps {
  isOwner: boolean;
}

interface StyledGridProps {
  gridTemplateColumns: string;
  gridTemplateRows: string;
  children?: React.ReactNode;
}

export const AisleCell = styled("div")<StyledCellProps>`
  background-color: none;
  border: ${(props) => (props.isOwner ? "1px solid #D9D9D9" : "none")};
  border-radius: 8px;
  min-width: 50px;
  min-height: 50px;
`;

export const AisleSubGrid = styled("div")<StyledGridProps>`
  display: grid;
  gap: 1rem;
  grid-template-columns: ${(props) => props.gridTemplateColumns};
  grid-template-rows: ${(props) => props.gridTemplateRows};
  border-radius: 8px;
  border: 4px solid #d9d9d9;
  padding: 25px;
  width: 60vw;
`;

export const AisleGridWrapper = styled("div")`
  display: flex;
  justify-content: space-between; // This will create space between the left content, center grid, and right buttons
  width: 100%;
  padding: 20px; // Add some padding around the main wrapper
`;

export const LeftBlock = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start; // This will create space between the left content, center grid, and right buttons
  width: 23vw;
  align-items: flex-start; // This will align the top edges of the children
  padding: 20px; // Add some padding around the main wrapper
  gap: 15px;
`;

export const RightBlock = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: flex-start; // This will create space between the left content, center grid, and right buttons
  width: 17vw;
  height: 100%;
  align-items: flex-end; // This will align the top edges of the children
  padding: 20px; // Add some padding around the main wrapper
  gap: 15px;
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
