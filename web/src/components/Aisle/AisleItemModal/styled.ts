import { styled } from "@mui/material";

export const ModalWrapper = styled("div")`
  position: absolute;
  top: 0;
  left: -220px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled("div")`
  width: 300px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Option = styled("input")`
  /* Your styling for the input fields goes here */
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  width: 100%;
`;

export const ActionButton = styled("button")`
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  background-color: ${(props) => props.color || "#FF5733"};
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e54623;
  }
`;
