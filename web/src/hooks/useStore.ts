import { useUser } from "@/context/userContext";
import { apiClient } from "@/utils/axios";
import { useEffect, useState } from "react";

type store = {
  title: string;
  description: string;
  size_x: number;
  size_y: number;
  id: number;
};

const useStore = () => {
  const [allStore, setAllStore] = useState<store[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
        const response = await fetch(
          process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/store",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        const data = await response.json();
        setAllStore(data.stores);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  });

  return { allStore };
};
export default useStore;
