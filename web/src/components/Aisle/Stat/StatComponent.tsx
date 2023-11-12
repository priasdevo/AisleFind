"use client";
import { ItemPos } from "@/hooks/useAisle";
import React, { useEffect, useState } from "react";

const statsData = [
  { label: "ประเภทสินค้า 1", value: 100 },
  { label: "เครื่องดื่มและน้ำ", value: 40 },
  { label: "ขนมและวิปครีม", value: 25 },
];

const maxStat = Math.max(...statsData.map((stat) => stat.value));

interface StatProps {
  itemList: ItemPos[];
}

const StatComponent = (props: StatProps) => {
  const { itemList } = props;
  const [search, setSearch] = useState("");
  const [itemStat, setItemStat] = useState<ItemPos[]>([]);

  useEffect(() => {
    const sortedItems = [...itemList].sort(
      (a, b) => b.search_count - a.search_count
    );
    setItemStat(sortedItems);
  }, [itemList]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="search">ค้นหาสถิติ: </label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ใส่ข้อมูลที่ต้องการค้นหา"
        />
      </div>

      <div>
        <h2>เรียงตามจำนวนสินค้าที่มีในคลัง</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {itemStat
            .filter((stat) => stat.title.includes(search))
            .map((stat, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "50px",
                    height: `${(stat.search_count / maxStat) * 200}px`,
                    marginTop: `${200 - (stat.search_count / maxStat) * 200}px`,
                    background: "#FFA07A",
                    marginBottom: "5px",
                    transition: "height 0.3s ease",
                  }}
                />
                <span>{stat.search_count}</span>
                <p>{stat.title}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatComponent;
