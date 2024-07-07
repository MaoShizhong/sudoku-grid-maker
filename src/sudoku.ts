import { Cell } from './cell';
import { PlacementError } from './error';
import { Region } from './region';
import { PlacementErrorDetails, SudokuNumber } from './types';

export default class Sudoku {
    static #BOARD_RESOLUTION = 9;
    grid: Cell[][];
    rows: Region[];
    columns: Region[];
    boxes: Region[];

    constructor() {
        this.grid = this.#createGrid();
        this.rows = this.#createRows();
        this.columns = this.#createColumns();
        this.boxes = this.#createBoxes();
    }

    addNumber({
        newNumber,
        row,
        column,
    }: {
        newNumber: SudokuNumber;
        row: number;
        column: number;
    }): void {
        const targetCell = this.grid[row]?.[column];
        if (!targetCell || targetCell.value === newNumber) {
            return;
        }

        const [canPlaceNumber, placementErrorDetails] =
            this.#checkPlacementValidity(targetCell, newNumber);

        if (canPlaceNumber) {
            targetCell.value = newNumber;
        } else {
            throw new PlacementError(placementErrorDetails);
        }
    }

    removeNumber({ row, column }: { row: number; column: number }): void {
        const targetCell = this.grid[row]?.[column];
        if (targetCell) {
            targetCell.value = null;
        }
    }

    addPencilMark({
        number,
        row,
        column,
    }: {
        number: SudokuNumber;
        row: number;
        column: number;
    }): void {
        const targetCell = this.grid[row]?.[column];
        if (targetCell) {
            targetCell.addPencilMark(number);
        }
    }

    removePencilMark({
        number,
        row,
        column,
    }: {
        number: SudokuNumber;
        row: number;
        column: number;
    }): void {
        const targetCell = this.grid[row]?.[column];
        if (targetCell) {
            targetCell.removePencilMark(number);
        }
    }

    #checkPlacementValidity(
        targetCell: Cell,
        number: SudokuNumber
    ): [boolean, PlacementErrorDetails] {
        const placementErrorDetails = {
            isAlreadyInRow: false,
            isAlreadyInColumn: false,
            isAlreadyInBox: false,
        };

        const isTargetCell = (cell: Cell): boolean => cell === targetCell;
        let canPlaceNumber = true;

        for (let i = 0; i < Sudoku.#BOARD_RESOLUTION; i++) {
            const cellInRow = this.rows[i].cells.find(isTargetCell);
            const cellInColumn = this.columns[i].cells.find(isTargetCell);
            const cellInBox = this.boxes[i].cells.find(isTargetCell);

            if (!cellInRow && !cellInColumn && !cellInBox) {
                continue;
            }

            const canPlaceInRow = this.rows[i].canPlaceNumber(number);
            const canPlaceInColumn = this.columns[i].canPlaceNumber(number);
            const canPlaceInBox = this.boxes[i].canPlaceNumber(number);

            if (cellInRow && !canPlaceInRow) {
                placementErrorDetails.isAlreadyInRow = true;
            }
            if (cellInColumn && !canPlaceInColumn) {
                placementErrorDetails.isAlreadyInColumn = true;
            }
            if (cellInBox && !canPlaceInBox) {
                placementErrorDetails.isAlreadyInBox = true;
            }

            canPlaceNumber = Object.values(placementErrorDetails).every(
                (value): boolean => value === false
            );
            if (!canPlaceNumber) {
                break;
            }
        }

        return [canPlaceNumber, placementErrorDetails];
    }

    #createGrid(): Cell[][] {
        const grid: Cell[][] = [];
        for (let i = 0; i < Sudoku.#BOARD_RESOLUTION; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < Sudoku.#BOARD_RESOLUTION; j++) {
                row.push(new Cell());
            }
            grid.push(row);
        }
        return grid;
    }

    #createRows(): Region[] {
        const rows: Region[] = [];
        for (let i = 0; i < Sudoku.#BOARD_RESOLUTION; i++) {
            rows.push(new Region(...this.grid[i]));
        }
        return rows;
    }

    #createColumns(): Region[] {
        const columns: Region[] = [];
        for (let i = 0; i < Sudoku.#BOARD_RESOLUTION; i++) {
            columns.push(
                new Region(
                    this.grid[0][i],
                    this.grid[1][i],
                    this.grid[2][i],
                    this.grid[3][i],
                    this.grid[4][i],
                    this.grid[5][i],
                    this.grid[6][i],
                    this.grid[7][i],
                    this.grid[8][i]
                )
            );
        }
        return columns;
    }

    #createBoxes(): Region[] {
        const firstBoxCellCoordinates = [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 1],
            [1, 2],
            [2, 0],
            [2, 1],
            [2, 2],
        ];

        const boxes: Region[] = [];
        for (let box = 0; box < Sudoku.#BOARD_RESOLUTION; box++) {
            const boxCells = firstBoxCellCoordinates.map(([y, x]): Cell => {
                const boxRow = box < 3 ? 0 : box < 6 ? 1 : 2;
                const boxColumn = box % 3;
                const newY = y + boxRow * 3;
                const newX = x + boxColumn * 3;
                return this.grid[newY][newX];
            });

            boxes.push(new Region(...boxCells));
        }
        return boxes;
    }
}
