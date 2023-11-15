import { Typography } from "@mui/material";
import { InputBox, StoreBlock } from "./styled";
import { GrAdd } from "react-icons/gr";
import useStore from "@/hooks/useStore";
import Link from "next/link";
import StoreCreateModal from "./StoreCreateModal/StoreCreateModal";
import { useState } from "react";

const StoreList = () => {
  const { allStore, createNewStore } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size_x, setSize_x] = useState(0);
  const [size_y, setSize_y] = useState(0);
  return (
    <StoreBlock>
      <button className="small-button" style={{ width: "120px" }}>
        <Typography
          variant="button"
          sx={{ marginRight: "7px" }}
          onClick={() => {
            setIsOpen((prev) => {
              return !prev;
            });
          }}
        >
          เพิ่มร้านค้า
        </Typography>
        <GrAdd />
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: "#FFEBDC",
          boxShadow: "2px 2px 20px 0px rgba(0, 0, 0, 0.20)",
          borderRadius: "12px",
          marginTop: "21px",
          padding: "18px",
          maxHeight: "500px",
          overflowY: "scroll",
          gap: "10px",
        }}
      >
        <Typography variant="h6">ร้านค้า</Typography>
        <hr style={{ width: "100%", marginBottom: "5px" }} />
        {allStore.map((store, index) => {
          return (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0px" }}
              key={store.id}
            >
              <Link href={`/aisle/${store.id}`}>
                <Typography variant="subtitle1">{store.title}</Typography>
                <Typography variant="subtitle2" sx={{ color: "#8E8E8E" }}>
                  {store.description}
                </Typography>
              </Link>
            </div>
          );
        })}
      </div>
      <StoreCreateModal
        isOpen={isOpen}
        onConfirm={() => {
          setIsOpen(false);
          createNewStore(title, description, size_x, size_y);
        }}
        cancel={() => {
          setIsOpen(false);
        }}
      >
        <InputBox
          type="text"
          placeholder="ชื่อร้าน"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputBox
          type="text"
          placeholder="รายละเอียดร้าน"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputBox
          type="number"
          placeholder="ขนาดร้าน (แนวนอน) "
          value={size_x}
          onChange={(e) => setSize_x(parseInt(e.target.value))}
        />
        <InputBox
          type="number"
          placeholder="ขนาดร้าน (แนวตั้ง)"
          value={size_y}
          onChange={(e) => setSize_y(parseInt(e.target.value))}
        />
      </StoreCreateModal>
    </StoreBlock>
  );
};

export default StoreList;
