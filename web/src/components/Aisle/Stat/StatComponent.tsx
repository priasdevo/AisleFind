import React, { useState } from "react";

const statsData = [
  { label: "ประเภทสินค้า 1", value: 100 },
  { label: "เครื่องดื่มและน้ำ", value: 40 },
  { label: "ขนมและวิปครีม", value: 25 },
];

const maxStat = Math.max(...statsData.map((stat) => stat.value));

const StatComponent = () => {
  const [search, setSearch] = useState("");

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
          {statsData
            .filter((stat) => stat.label.includes(search))
            .map((stat, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "50px",
                    height: `${(stat.value / maxStat) * 200}px`,
                    marginTop: `${200 - (stat.value / maxStat) * 200}px`,
                    background: "#FFA07A",
                    marginBottom: "5px",
                    transition: "height 0.3s ease",
                  }}
                />
                <span>{stat.value}</span>
                <p>{stat.label}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatComponent;
