"use client";
import { useState, useEffect } from "react";
import { CELLSTATUS } from "@/components/Aisle/constants";
import { useSnackbar } from "@/context/snackbarContext";
import { usePathname } from "next/navigation";

type CellDetail = {
  startRow: number;
  startColumn: number;
  rowSpan: number;
  columnSpan: number;
  selected?: boolean;
  status?: string;
  id?: string;
  type?: string;
};

type Position = {
  id: string;
  pos_x: number;
  pos_y: number;
  row_span?: number;
  col_span?: number;
  type?: string;
};

export type ItemPos = {
  id: string;
  title: string;
  layout_id: string;
  description: string;
  search_count: number;
  selected?: boolean;
};

type store = {
  title: string;
  description: string;
  size_x: number;
  size_y: number;
  id: number;
};

const useAisleCustomer = () => {
  const { displaySnackbar } = useSnackbar();

  const [cellDetails, setCellDetails] = useState<CellDetail[]>([]);
  const [objectText, setObjectText] = useState<string>();
  const [shelfName, setShelfName] = useState<string>();
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const [store, setStore] = useState<store>();
  const [itemList, setItemList] = useState<ItemPos[]>([]);
  /* Mode number meaning
  mode 0 : nothing
  mode 1 : Add
  mode 2 : Edit (Move)
  mode 3 : Delete
  mode 4 : Item
  mode 5 : Add Item
  mode 6 : Edit Item
  mode 7 : Delete Item
  mode 8 : Stat
  */
  const [selected, setSelected] = useState<CellDetail | null>(null);
  const [objectList, setObjectList] = useState<Position[]>([]);
  const [selectedShop, setSelectedShop] = useState(-1);

  const pathName = usePathname();
  const [id, setId] = useState<string | undefined>(); // State is now explicitly typed

  useEffect(() => {
    const match = pathName.match(/\/aisle\/([^\/]+)/i);
    if (match) {
      setId(match[1]);
    }
  }, [pathName]);

  useEffect(() => {
    if (selectedShop !== -1) {
      console.log(selectedShop);
      fetchData();
      fetchLayout();
      fetchItem();
    }
  }, [selectedShop]);

  useEffect(() => {
    if (store) {
      const grid: boolean[][] = Array.from({ length: store?.size_y! }, () =>
        Array(store?.size_x).fill(false)
      );

      const occupiedCells: CellDetail[] = objectList.map(
        (aisleObject, index) => {
          for (
            let row = aisleObject.pos_x;
            row < aisleObject.pos_x + aisleObject.row_span!;
            row++
          ) {
            for (
              let col = aisleObject.pos_y;
              col < aisleObject.pos_y + aisleObject.col_span!;
              col++
            ) {
              grid[row - 1][col - 1] = true;
            }
          }
          return {
            startRow: aisleObject.pos_x,
            startColumn: aisleObject.pos_y,
            rowSpan: aisleObject.row_span!,
            columnSpan: aisleObject.col_span!,
            status: CELLSTATUS.OBJECT,
            id: aisleObject.id,
            type: aisleObject.type,
          };
        }
      );

      // Find the empty cells
      const emptyCells: CellDetail[] = [];
      grid.forEach((row, rowIndex) => {
        row.forEach((isOccupied, colIndex) => {
          if (!isOccupied) {
            emptyCells.push({
              startRow: rowIndex + 1,
              startColumn: colIndex + 1,
              rowSpan: 1,
              columnSpan: 1,
              status: CELLSTATUS.BLANK,
            });
          }
        });
      });

      // Combine occupied and empty cells and update state
      setCellDetails([...occupiedCells, ...emptyCells]);
    }
  }, [objectList, store]);

  const selectItem = (id: number, layout_id: string) => {
    if (selectedItem === id) {
      setSelectedItem(-1);
    } else {
      setSelectedItem(id);
    }

    setCellDetails((prevDetails) =>
      prevDetails.map((cell, index) => {
        if (cell.id === layout_id) {
          setSelected(cell);
          return {
            ...cell,
            selected: !cell.selected,
          };
        } else {
          return {
            ...cell,
            selected: false,
          };
        }
      })
    );
  };

  const selectCell = (id: string) => {
    setSelectedItem(-1);
    setCellDetails((prevDetails) =>
      prevDetails.map((cell, index) => {
        if (cell.id === id) {
          setSelected(cell);
          return {
            ...cell,
            selected: !cell.selected,
          };
        } else {
          return {
            ...cell,
            selected: false,
          };
        }
      })
    );
  };

  async function fetchData() {
    try {
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/store/" + selectedShop,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      const data = await response.json();
      setStore(data.store);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchLayout() {
    try {
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] +
          "/store/" +
          selectedShop +
          "/layout",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          next: { tags: ["object"] },
        }
      );
      const data = await response.json();
      setObjectList(data.layouts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchItem() {
    try {
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] +
          "/aisle/items/stats/store/" +
          selectedShop,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      const data = await response.json();
      setItemList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    console.log("Prias selected : selected ", selected);
  });

  return {
    cellDetails,
    selectedShop,
    setSelectedShop,
    objectText,
    itemList,
    shelfName,
    store,
    selectedItem,
    selectItem,
    selected,
    selectCell,
  };
};

export default useAisleCustomer;
