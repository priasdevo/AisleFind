import React from "react";

interface ItemListModal {
  isOpen: boolean;
  children?: React.ReactNode;
  left: number;
  top: number;
}

const AisleItemListModal = (props: ItemListModal) => {
  const { isOpen, left, top, children } = props;
  if (!isOpen) return null;
  const leftPosition = left * 66 + 25 - 10; // Multiply grid column by 50 pixels
  const topPosition = top * 66 + 25 - 62;

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPosition}px`, // Use the calculated position
        top: `${topPosition}px`, // Use the calculated position
        borderRadius: "12px",
        boxShadow: "2px 2px 20px 0px rgba(0, 0, 0, 0.20)",
      }}
    >
      {children}
    </div>
  );
};

export default AisleItemListModal;
