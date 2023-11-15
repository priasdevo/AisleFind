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
  store_id?: number;
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

const useAisle = () => {
  const { displaySnackbar } = useSnackbar();

  const [cellDetails, setCellDetails] = useState<CellDetail[]>([]);
  const [objectText, setObjectText] = useState<string>();
  const [shelfName, setShelfName] = useState<string>();
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const [store, setStore] = useState<store>();
  const [itemList, setItemList] = useState<ItemPos[]>([]);
  const [mode, setMode] = useState<number>(2);
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
  const [selected, setSelected] = useState<Position[]>([]);
  const [objectList, setObjectList] = useState<Position[]>([]);

  const pathName = usePathname();
  const [id, setId] = useState<string | undefined>(); // State is now explicitly typed

  useEffect(() => {
    const match = pathName.match(/\/aisle\/([^\/]+)/i);
    if (match) {
      setId(match[1]);
    }
  }, [pathName]);

  useEffect(() => {
    if (id) {
      fetchData();
      fetchLayout();
      fetchItem();
    }
  }, [id]);

  useEffect(() => {
    if (
      store &&
      (objectList.length === 0 || objectList[0].store_id === store.id)
    ) {
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

  const cellClickHandle = (startRow: number, startColumn: number) => {
    setCellDetails((prevDetails) =>
      prevDetails.map((cell, index) => {
        if (cell.startRow === startRow && cell.startColumn === startColumn) {
          if (mode === 0) {
            return cell;
          } else if (mode === 1 && cell.status !== CELLSTATUS.BLANK) {
            return cell;
          } else if (mode === 3 && cell.status !== CELLSTATUS.OBJECT) {
            return cell;
          } else if (mode == 2) {
          } else if (mode > 3 && cell.status != CELLSTATUS.OBJECT) {
            return cell;
          }

          if (mode === 1 && !cell.selected) {
            setSelected((prevSelected) => [
              ...prevSelected,
              {
                id: cell.id!,
                pos_x: cell.startRow,
                pos_y: cell.startColumn,
              },
            ]);
          } else if (mode === 1 && cell.selected) {
            setSelected((prevSelected) =>
              prevSelected.filter((position) => {
                return (
                  position.pos_x !== cell.startRow ||
                  position.pos_y !== cell.startColumn
                );
              })
            );
          } else if (mode === 2) {
            if (selected.length === 1 && cell.status === CELLSTATUS.BLANK) {
              setSelected((prevSelected) => [
                ...prevSelected,
                {
                  id: cell.id!,
                  pos_x: cell.startRow,
                  pos_y: cell.startColumn,
                  row_span: cell.rowSpan,
                  col_span: cell.columnSpan,
                },
              ]);
            } else if (
              selected.length === 0 &&
              cell.status === CELLSTATUS.OBJECT
            ) {
              setSelected((prevSelected) => [
                ...prevSelected,
                {
                  id: cell.id!,
                  pos_x: cell.startRow,
                  pos_y: cell.startColumn,
                  row_span: cell.rowSpan,
                  col_span: cell.columnSpan,
                },
              ]);
            } else {
              return cell;
            }
          } else if (mode === 3 && !cell.selected) {
            if (selected.length === 1) {
              return cell;
            }
            setSelected((prevSelected) => [
              ...prevSelected,
              {
                id: cell.id!,
                pos_x: cell.startRow,
                pos_y: cell.startColumn,
                row_span: cell.rowSpan,
                col_span: cell.columnSpan,
              },
            ]);
          } else if (mode === 3 && cell.selected) {
            setSelected((prevSelected) =>
              prevSelected.filter((position) => {
                return (
                  position.pos_x !== cell.startRow ||
                  position.pos_y !== cell.startColumn
                );
              })
            );
          } else if (!cell.selected) {
            setSelected((prevSelected) => [
              ...prevSelected,
              {
                id: cell.id!,
                pos_x: cell.startRow,
                pos_y: cell.startColumn,
                row_span: cell.rowSpan,
                col_span: cell.columnSpan,
                name: cell.id,
              },
            ]);
          } else {
            setSelected((prevSelected) =>
              prevSelected.filter((position) => {
                return (
                  position.pos_x !== cell.startRow ||
                  position.pos_y !== cell.startColumn
                );
              })
            );
          }
          return {
            ...cell,
            selected: !cell.selected,
          };
        }
        return cell;
      })
    );
  };

  const confirmCreate = () => {
    if (isRectangle(selected)) {
      const minRow = Math.min(...selected.map((p) => p.pos_x));
      const maxRow = Math.max(...selected.map((p) => p.pos_x));
      const minCol = Math.min(...selected.map((p) => p.pos_y));
      const maxCol = Math.max(...selected.map((p) => p.pos_y));

      const newRowSpan = maxRow - minRow + 1;
      const newColSpan = maxCol - minCol + 1;

      createNewObject(
        minRow,
        minCol,
        newRowSpan,
        newColSpan,
        objectText === "ประตู"
          ? "DOOR"
          : objectText === "ชั้นวาง"
          ? "SHELF"
          : "CASHIER"
      );
      setSelected([]);
    } else {
      console.log("Selected is not rectangle : ", selected);
    }
  };

  const confirmDelete = () => {
    if (selected.length === 0) return; // exit if no selected object

    const { id } = selected[0];

    deleteObject(id);
    setSelected([]);
  };

  const confirmMove = () => {
    if (selected.length !== 2) return; // Ensure there are exactly two positions in selected

    const [origin, destination] = selected;

    // Find the object to move in the objectList
    const objectToMove = objectList.find(
      (obj) => obj.pos_x === origin.pos_x && obj.pos_y === origin.pos_y
    );

    if (!objectToMove) return; // Exit if no matching object found

    const destinationEndRow = destination.pos_x + objectToMove.row_span!;
    const destinationEndCol = destination.pos_y + objectToMove.col_span!;

    // Check for overlaps at the destination
    for (let row = destination.pos_x; row < destinationEndRow; row++) {
      for (let col = destination.pos_y; col < destinationEndCol; col++) {
        const overlappingObject = objectList.find(
          (obj) =>
            row >= obj.pos_x &&
            row < obj.pos_x + obj.row_span! &&
            col >= obj.pos_y &&
            col < obj.pos_y + obj.col_span!
        );
        if (overlappingObject) {
          console.error("Overlap detected. Move is not possible.");
          displaySnackbar("Overlap detected. Move is not possible.", "error");
          return; // Exit if an overlap is detected
        }
      }
    }

    // Adjust the row and col of the object to move
    objectToMove.pos_x = destination.pos_x;
    objectToMove.pos_y = destination.pos_y;

    // Update the state with the adjusted objectList
    moveObject(
      objectToMove.id,
      destination.pos_x,
      destination.pos_y,
      objectToMove.row_span!,
      objectToMove.col_span!,
      objectToMove.type!
    );

    // Clear the selected state
    setSelected([]);
  };

  const confirmTrigger = () => {
    switch (mode) {
      case 0:
        break;
      case 1:
        confirmCreate();
        break;
      case 2:
        confirmMove();
        break;
      case 3:
        confirmDelete();
        break;
      default:
        break;
    }
  };

  const confirmItem = (
    itenName: string,
    itemShelf: string,
    itemDescription: string
  ) => {
    if (mode === 5) {
      createItem(itenName, itemDescription, id!, itemShelf);
      setMode(4);
    } else if (mode === 6) {
      editItem(
        itenName,
        itemDescription,
        id!,
        itemShelf,
        itemList[selectedItem].id
      );
      setMode(4);
    } else if (mode === 7) {
      deleteItem(itemList[selectedItem].id);
      setMode(4);
    }
  };

  const changeMode = (nMode: number, text: string) => {
    if (mode === nMode && text === objectText) {
      setObjectText("");
      if (mode <= 3) {
        setMode(0);
      } else if (mode <= 7) {
        setMode(4);
      }
    } else {
      // Set mode according to the paramete r
      setMode(nMode);
      setObjectText(text);
    }

    // Reset the selected array
    setSelectedItem(-1);
    setSelected([]);

    // Update cellDetails to set all selected properties to false
    const updatedCellDetails = cellDetails.map((cell) => {
      return {
        ...cell,
        selected: false,
      };
    });

    const updatedItemList = itemList.map((item) => {
      return {
        ...item,
        selected: false,
      };
    });

    setItemList(updatedItemList);
    setCellDetails(updatedCellDetails);
  };

  const selectItem = (index: number) => {
    if (mode !== 6 && mode !== 7) {
      return;
    }
    if (selectedItem) {
      const oldItem = { ...itemList[selectedItem], selected: false };

      const updatedItem = { ...itemList[index], selected: true };

      setItemList((prevList) =>
        prevList.map((item, indexs) =>
          indexs === index
            ? updatedItem
            : indexs === selectedItem
            ? oldItem
            : item
        )
      );
      setSelectedItem(index);
      setShelfName(itemList[index].layout_id);
    } else {
      setSelectedItem(index);
      const updatedItem = { ...itemList[index], selected: true };

      setItemList((prevList) =>
        prevList.map((item, indexs) => (indexs === index ? updatedItem : item))
      );
    }
  };

  async function createNewObject(
    pos_x: number,
    pos_y: number,
    row_span: number,
    col_span: number,
    type: string
  ) {
    try {
      const req = {
        pos_x: pos_x,
        pos_y: pos_y,
        row_span: row_span,
        col_span: col_span,
        type: type,
      };
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/store/" + id + "/layout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(req),
        }
      );
      const data = await response.json();
      fetchLayout();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function deleteObject(layoutId: string) {
    try {
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] +
          "/store/" +
          id +
          "/layout/" +
          layoutId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      const data = await response.json();
      fetchLayout();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function moveObject(
    layoutId: string,
    pos_x: number,
    pos_y: number,
    row_span: number,
    col_span: number,
    type: string
  ) {
    try {
      const req = {
        pos_x: pos_x,
        pos_y: pos_y,
        row_span: row_span,
        col_span: col_span,
        type: type,
      };
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] +
          "/store/" +
          id +
          "/layout/" +
          layoutId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(req),
        }
      );
      const data = await response.json();
      fetchLayout();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchData() {
    try {
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/store/" + id,
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
        process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/store/" + id + "/layout",
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
          id,
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

  async function createItem(
    title: string,
    description: string,
    store_id: string,
    layout_id: string
  ) {
    try {
      const req = {
        title: title,
        description: description,
        store_id: store_id,
        layout_id: layout_id,
      };
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/aisle/items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(req),
        }
      );
      const data = await response.json();
      fetchItem();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function editItem(
    title: string,
    description: string,
    store_id: string,
    layout_id: string,
    itemId: string
  ) {
    try {
      const req = {
        title: title,
        description: description,
        store_id: store_id,
        layout_id: layout_id,
      };
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/aisle/items/" + itemId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(req),
        }
      );
      const data = await response.json();
      fetchItem();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function deleteItem(itemId: string) {
    try {
      const token = localStorage.getItem("token"); // Replace with actual token retrieval logic
      const response = await fetch(
        process.env["NEXT_PUBLIC_GATEWAY_URL"] + "/aisle/items/" + itemId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      fetchItem();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if (selected.length !== 0 && selected[selected.length - 1].id) {
      setShelfName(selected[selected.length - 1].id.toString());
    } else {
      setShelfName("");
    }
  }, [selected]);

  return {
    cellDetails,
    cellClickHandle,
    changeMode,
    confirmTrigger,
    mode,
    objectText,
    itemList,
    confirmItem,
    shelfName,
    selectItem,
    store,
    selectedItem,
  };
};

const isRectangle = (positions: Position[]): boolean => {
  // If positions are empty, return false.
  if (positions.length === 0) return false;

  let minRow = Infinity;
  let maxRow = -Infinity;
  let minCol = Infinity;
  let maxCol = -Infinity;

  // Find the minimum and maximum rows and columns.
  positions.forEach(({ pos_x, pos_y }) => {
    minRow = Math.min(minRow, pos_x);
    maxRow = Math.max(maxRow, pos_x);
    minCol = Math.min(minCol, pos_y);
    maxCol = Math.max(maxCol, pos_y);
  });

  // Calculate the expected number of positions for a rectangle.
  const totalPositions = (maxRow - minRow + 1) * (maxCol - minCol + 1);

  // If the total number of positions isn't equal to the positions given, return false.
  if (totalPositions !== positions.length) return false;

  // Check if all positions in the defined rectangle are in the positions set.
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      if (!positions.some((pos) => pos.pos_x === row && pos.pos_y === col)) {
        return false;
      }
    }
  }

  return true;
};

export default useAisle;
