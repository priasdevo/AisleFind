"use client";
import React, { useEffect, useState } from "react";
import { ModalWrapper, ModalContent, ActionButton, Option } from "./styled";

interface modalProps {
  isShow: boolean;
  cancel: Function;
  confirm: Function;
  shelfName: string;
  mode: number;
  startName: string;
  startDetails: string;
}

const AisleItemModal = (props: modalProps) => {
  const { isShow, cancel, confirm, shelfName, mode, startName, startDetails } =
    props;

  useEffect(() => {
    console.log("Current startName : ", startName);
    setProductName(startName);
  }, [startName]);
  useEffect(() => {
    setProductDetails(startDetails);
  }, [startDetails]);

  const [productName, setProductName] = useState(startName);
  const [productDetails, setProductDetails] = useState(startDetails);

  return (
    <ModalWrapper>
      {isShow && (
        <ModalContent>
          {mode !== 7 && (
            <>
              <Option
                type="text"
                placeholder="ชื่อสินค้า"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <Option
                type="text"
                placeholder="ชั้นวาง (เลือกจากแผงผัง)"
                value={shelfName}
              />
              <Option
                type="text"
                placeholder="รายละเอียดสินค้าเพิ่มเติม"
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
              />
            </>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <ActionButton color="#C26625" onClick={() => cancel()}>
              ยกเลิก
            </ActionButton>
            <ActionButton
              color="#FCA86C"
              onClick={() => confirm(productName, shelfName, productDetails)}
            >
              ยืนยัน
            </ActionButton>
          </div>
        </ModalContent>
      )}
    </ModalWrapper>
  );
};

export default AisleItemModal;
