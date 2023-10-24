import { useState, useEffect, useMemo } from "react";
import { CELLSTATUS } from "@/components/Aisle/constants";

type CellDetail = {
  startRow: number;
  startColumn: number;
  rowSpan: number;
  columnSpan: number;
  selected?: boolean;
  status?: string;
  text?: string;
};

type Position = {
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
  name?: string;
};

export type ItemPos = {
  itemName: string;
  location: string;
  description: string;
  selected?: boolean;
};

const useAisle = () => {
  const [cellDetails, setCellDetails] = useState<CellDetail[]>([]);
  const [objectText, setObjectText] = useState<string>();
  const [shelfName, setShelfName] = useState<string>();
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const [itemList, setItemList] = useState<ItemPos[]>([
    {
      itemName: "อาหารแมว",
      location: "ชั้นวาง 2",
      description: "ฝั่งขวาชั้นบน",
    },
    {
      itemName: "อาหารแมว 2",
      location: "ชั้นวาง 4",
      description: "ฝั่งซ้ายชั้นบน",
    },
  ]);
  const [mode, setMode] = useState<number>(0);
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
  const [objectList, setObjectList] = useState<Position[]>([
    { row: 1, col: 1, rowSpan: 2, colSpan: 2 },
    { row: 3, col: 3, rowSpan: 1, colSpan: 2 },
  ]);

  const height = 7;
  const width = 7;

  useEffect(() => {
    const grid: boolean[][] = Array.from({ length: height }, () =>
      Array(width).fill(false)
    );

    const occupiedCells: CellDetail[] = objectList.map((aisleObject, index) => {
      for (
        let row = aisleObject.row;
        row < aisleObject.row + aisleObject.rowSpan!;
        row++
      ) {
        for (
          let col = aisleObject.col;
          col < aisleObject.col + aisleObject.colSpan!;
          col++
        ) {
          grid[row - 1][col - 1] = true;
        }
      }
      return {
        startRow: aisleObject.row,
        startColumn: aisleObject.col,
        rowSpan: aisleObject.rowSpan!,
        columnSpan: aisleObject.colSpan!,
        status: CELLSTATUS.OBJECT,
        text: index + 1,
      };
    });

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
  }, [objectList]);

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
              { row: cell.startRow, col: cell.startColumn },
            ]);
          } else if (mode === 1 && cell.selected) {
            setSelected((prevSelected) =>
              prevSelected.filter((position) => {
                return (
                  position.row !== cell.startRow ||
                  position.col !== cell.startColumn
                );
              })
            );
          } else if (mode === 2) {
            if (selected.length === 1 && cell.status === CELLSTATUS.BLANK) {
              setSelected((prevSelected) => [
                ...prevSelected,
                {
                  row: cell.startRow,
                  col: cell.startColumn,
                  rowSpan: cell.rowSpan,
                  colSpan: cell.columnSpan,
                },
              ]);
            } else if (
              selected.length === 0 &&
              cell.status === CELLSTATUS.OBJECT
            ) {
              setSelected((prevSelected) => [
                ...prevSelected,
                {
                  row: cell.startRow,
                  col: cell.startColumn,
                  rowSpan: cell.rowSpan,
                  colSpan: cell.columnSpan,
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
                row: cell.startRow,
                col: cell.startColumn,
                rowSpan: cell.rowSpan,
                colSpan: cell.columnSpan,
              },
            ]);
          } else if (mode === 3 && cell.selected) {
            setSelected((prevSelected) =>
              prevSelected.filter((position) => {
                return (
                  position.row !== cell.startRow ||
                  position.col !== cell.startColumn
                );
              })
            );
          } else if (!cell.selected) {
            console.log("Prias test");
            setSelected((prevSelected) => [
              ...prevSelected,
              {
                row: cell.startRow,
                col: cell.startColumn,
                rowSpan: cell.rowSpan,
                colSpan: cell.columnSpan,
                name: cell.text,
              },
            ]);
          } else {
            setSelected((prevSelected) =>
              prevSelected.filter((position) => {
                return (
                  position.row !== cell.startRow ||
                  position.col !== cell.startColumn
                );
              })
            );
          }
          console.log("Prias ?? : ", cell.selected);
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
      const minRow = Math.min(...selected.map((p) => p.row));
      const maxRow = Math.max(...selected.map((p) => p.row));
      const minCol = Math.min(...selected.map((p) => p.col));
      const maxCol = Math.max(...selected.map((p) => p.col));

      const newRowSpan = maxRow - minRow + 1;
      const newColSpan = maxCol - minCol + 1;

      const newObject = {
        row: minRow,
        col: minCol,
        rowSpan: newRowSpan,
        colSpan: newColSpan,
      };

      setObjectList((prev) => [...prev, newObject]);
      setSelected([]);
    } else {
      console.log("Selected is not rectangle : ", selected);
    }
  };

  const confirmDelete = () => {
    if (selected.length === 0) return; // exit if no selected object

    const { row, col } = selected[0];

    // Filter out the deleted object from the objectList
    const updatedObjectList = objectList.filter(
      (object) => !(object.row === row && object.col === col)
    );

    setObjectList(updatedObjectList);
    setSelected([]);
  };

  const confirmMove = () => {
    if (selected.length !== 2) return; // Ensure there are exactly two positions in selected

    const [origin, destination] = selected;

    // Find the object to move in the objectList
    const objectToMove = objectList.find(
      (obj) => obj.row === origin.row && obj.col === origin.col
    );

    if (!objectToMove) return; // Exit if no matching object found

    const destinationEndRow = destination.row + objectToMove.rowSpan!;
    const destinationEndCol = destination.col + objectToMove.colSpan!;

    // Check for overlaps at the destination
    for (let row = destination.row; row < destinationEndRow; row++) {
      for (let col = destination.col; col < destinationEndCol; col++) {
        const overlappingObject = objectList.find(
          (obj) =>
            row >= obj.row &&
            row < obj.row + obj.rowSpan! &&
            col >= obj.col &&
            col < obj.col + obj.colSpan!
        );
        if (overlappingObject) {
          console.error("Overlap detected. Move is not possible.");
          return; // Exit if an overlap is detected
        }
      }
    }

    // Adjust the row and col of the object to move
    objectToMove.row = destination.row;
    objectToMove.col = destination.col;

    // Update the state with the adjusted objectList
    setObjectList([...objectList]);

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
    console.log("ConfirmItem");
    if (mode === 5) {
      const newItem: ItemPos = {
        itemName: itenName,
        location: `ชั้นวาง ${itemShelf}`,
        description: itemDescription,
      };
      setItemList((prev) => [...prev, newItem]);
      setMode(4);
    } else if (mode === 7) {
      setItemList((prev) => prev.filter((_, index) => index !== selectedItem));
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
    } else {
      setSelectedItem(index);
      const updatedItem = { ...itemList[index], selected: true };

      setItemList((prevList) =>
        prevList.map((item, indexs) => (indexs === index ? updatedItem : item))
      );
    }
  };

  useEffect(() => {
    console.log("Prias current selected : ", selected);
    console.log("Prias cell Details : ", cellDetails);
    if (selected.length !== 0 && selected[selected.length - 1].name) {
      setShelfName(selected[selected.length - 1].name);
    } else {
      setShelfName("");
    }
  }, [selected]);

  useEffect(() => {
    //console.log("Prias mode : ", mode);
  }, [mode]);

  useEffect(() => {
    console.log(itemList), [itemList];
  });

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
  positions.forEach(({ row, col }) => {
    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
  });

  // Calculate the expected number of positions for a rectangle.
  const totalPositions = (maxRow - minRow + 1) * (maxCol - minCol + 1);

  // If the total number of positions isn't equal to the positions given, return false.
  if (totalPositions !== positions.length) return false;

  // Check if all positions in the defined rectangle are in the positions set.
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      if (!positions.some((pos) => pos.row === row && pos.col === col)) {
        return false;
      }
    }
  }

  return true;
};

export default useAisle;
