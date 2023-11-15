import { ActionButton } from "@/components/Aisle/AisleItemModal/styled";
import React from "react";

interface StoreCreateModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
  onConfirm: () => void;
  cancel: () => void;
}

const StoreCreateModal = (props: StoreCreateModalProps) => {
  const { isOpen, children, onConfirm, cancel } = props;
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        right: `-50px`,
        width: "300px",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "2px 2px 20px 0px rgba(0, 0, 0, 0.20)",
        backgroundColor: "white",
      }}
    >
      {children}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ActionButton color="#C26625" onClick={() => cancel()}>
          ยกเลิก
        </ActionButton>
        <ActionButton color="#FCA86C" onClick={() => onConfirm()}>
          ยืนยัน
        </ActionButton>
      </div>
    </div>
  );
};

export default StoreCreateModal;
