import { Typography } from "@mui/material";
import { StoreBlock } from "./styled";
import { GrAdd } from "react-icons/gr";
import useStore from "@/hooks/useStore";
import { useRouter } from "next/navigation";

const StoreList = () => {
  const { allStore } = useStore();
  const router = useRouter();
  return (
    <StoreBlock>
      <button className="small-button" style={{ width: "120px" }}>
        <Typography variant="button" sx={{ marginRight: "7px" }}>
          เพิ่มร้านค้า
        </Typography>
        <GrAdd />
      </button>
      <div
        style={{
          width: "100%",
          backgroundColor: "#FFEBDC",
          boxShadow: "2px 2px 20px 0px rgba(0, 0, 0, 0.20)",
          borderRadius: "12px",
          marginTop: "21px",
          padding: "18px",
          minHeight: "500px",
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
              onClick={() => {
                router.push(`/aisle/${store.id}`);
              }}
            >
              <Typography variant="subtitle1">{store.title}</Typography>
              <Typography variant="subtitle2" sx={{ color: "#8E8E8E" }}>
                {store.description}
              </Typography>
            </div>
          );
        })}
      </div>
    </StoreBlock>
  );
};

export default StoreList;
