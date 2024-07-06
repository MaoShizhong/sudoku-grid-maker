import { Cell } from './cell';
import { PlacementError } from './error';
import { Region } from './region';
import { SudokuNumber } from './types';

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
        number,
        row,
        column,
    }: {
        number: SudokuNumber;
        row: number;
        column: number;
    }): void {
        const targetCell = this.grid[row][column];
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

        if (canPlaceNumber) {
            targetCell.value = number;
        } else {
            throw new PlacementError(placementErrorDetails);
        }
    }

    removeNumber({ row, column }: { row: number; column: number }): void {
        this.grid[row][column].value = null;
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
