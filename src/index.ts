import { Cell } from './cell';
import { PlacementError } from './error';
import { PuzzleHistory } from './puzzle-history';
import {
    Box,
    CellValue,
    Coordinate,
    PlacementErrorDetails,
    SudokuNumber,
    SudokuPuzzle,
} from './types';

class Sudoku {
    static #BOARD_RESOLUTION = 9;
    static #boxesCoordinates = Sudoku.#generateBoxesCoordinates();

    grid: SudokuPuzzle;
    history: PuzzleHistory;
    #shouldLockStartNums: boolean;

    constructor(startingValues?: CellValue[][], shouldLockStartNums = false) {
        this.#shouldLockStartNums = shouldLockStartNums;
        this.grid = this.#createGrid(startingValues);
        this.history = new PuzzleHistory(this.grid);
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
        if (
            !targetCell ||
            targetCell.value === newNumber ||
            targetCell.isLocked
        ) {
            return;
        }

        const [canPlaceNumber, placementErrorDetails] =
            this.#checkPlacementValidity(targetCell, newNumber);

        if (canPlaceNumber) {
            targetCell.value = newNumber;
            targetCell.clearPencilMarks();
            this.#removeMatchingPencilMarksInMatchingRegions(targetCell);
            this.history.recordNewGridState(this.grid);
        } else {
            throw new PlacementError(placementErrorDetails);
        }
    }

    removeNumber({ row, column }: { row: number; column: number }): void {
        const targetCell = this.grid[row]?.[column];
        if (targetCell && !targetCell.isLocked) {
            targetCell.value = null;
            this.history.recordNewGridState(this.grid);
        }
    }

    togglePencilMark({
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
            targetCell.togglePencilMark(number);
            this.history.recordNewGridState(this.grid);
        }
    }

    undo(): void {
        this.grid = this.history.toPreviousGridState();
    }

    redo(): void {
        this.grid = this.history.toNextGridState();
    }

    reset(): void {
        this.history.reset();
        this.grid = this.history.currentGridState;
    }

    isSolved(): boolean {
        return this.grid.every((row): boolean =>
            row.every((cell) => cell.value)
        );
    }

    #checkPlacementValidity(
        targetCell: Cell,
        number: SudokuNumber
    ): [boolean, PlacementErrorDetails] {
        let canPlaceNumber = true;
        const placementErrorDetails = {
            isAlreadyInRow: false,
            isAlreadyInColumn: false,
            isAlreadyInBox: false,
            isLocked: false,
        };

        if (targetCell.isLocked) {
            placementErrorDetails.isLocked = true;
            return [false, placementErrorDetails];
        }

        for (let row = 0; row < this.grid.length; row++) {
            for (let column = 0; column < this.grid[row].length; column++) {
                const currentCell = this.grid[row][column];
                if (currentCell.value !== number) {
                    continue;
                }

                const isNumberAlreadyInRow = currentCell.row === targetCell.row;
                const isNumberAlreadyInColumn =
                    currentCell.column === targetCell.column;
                const isNumberAlreadyInBox = this.#isInSameBox(
                    currentCell,
                    targetCell
                );

                if (isNumberAlreadyInRow) {
                    canPlaceNumber = false;
                    placementErrorDetails.isAlreadyInRow = true;
                }
                if (isNumberAlreadyInColumn) {
                    canPlaceNumber = false;
                    placementErrorDetails.isAlreadyInColumn = true;
                }
                if (isNumberAlreadyInBox) {
                    canPlaceNumber = false;
                    placementErrorDetails.isAlreadyInBox = true;
                }
            }
        }

        return [canPlaceNumber, placementErrorDetails];
    }

    #isInSameBox(cellA: Cell, cellB: Cell): boolean {
        const cellABox = Sudoku.#getBoxNumber(cellA.row, cellA.column);
        const cellBBox = Sudoku.#getBoxNumber(cellB.row, cellB.column);

        return cellABox === cellBBox;
    }

    #getCellsInBox(boxNumber: number): Cell[] {
        const boxCoordinates = Sudoku.#boxesCoordinates[boxNumber];
        const cellsInBox: Cell[] = [];

        for (const { row, column } of boxCoordinates) {
            cellsInBox.push(this.grid[row][column]);
        }
        return cellsInBox;
    }

    #getCellsInColumn(column: number): Cell[] {
        const cellsInColumn: Cell[] = [];

        for (const row of this.grid) {
            cellsInColumn.push(row[column]);
        }
        return cellsInColumn;
    }

    #removeMatchingPencilMarksInMatchingRegions({
        value,
        row,
        column,
    }: Cell): void {
        if (value === null) {
            return;
        }

        const boxNumber = Sudoku.#getBoxNumber(row, column);
        const cellsInColumn = this.#getCellsInColumn(column);
        const cellsInBox = this.#getCellsInBox(boxNumber);
        const matchingRegionCells = [
            ...this.grid[row],
            ...cellsInColumn,
            ...cellsInBox,
        ];

        for (const cell of matchingRegionCells) {
            if (cell.pencilMarks.includes(value)) {
                cell.togglePencilMark(value);
            }
        }
    }

    #createGrid(valuesArray?: CellValue[][]): SudokuPuzzle {
        const grid: SudokuPuzzle = [];
        for (let i = 0; i < Sudoku.#BOARD_RESOLUTION; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < Sudoku.#BOARD_RESOLUTION; j++) {
                const cellValue = valuesArray?.[i][j] ?? null;
                row.push(
                    new Cell({
                        value: cellValue,
                        row: i,
                        column: j,
                        isLocked:
                            this.#shouldLockStartNums && cellValue !== null,
                    })
                );
            }
            grid.push(row);
        }
        return grid;
    }

    toJSON(): CellValue[][] {
        return this.grid.map((row): CellValue[] =>
            row.map((cell): CellValue => cell.value)
        );
    }

    toString(): string {
        return JSON.stringify(this);
    }

    static #generateBoxesCoordinates(): Box[] {
        const boxes: Box[] = [];
        const firstBoxCellCoordinates = [
            { row: 0, column: 0 },
            { row: 0, column: 1 },
            { row: 0, column: 2 },
            { row: 1, column: 0 },
            { row: 1, column: 1 },
            { row: 1, column: 2 },
            { row: 2, column: 0 },
            { row: 2, column: 1 },
            { row: 2, column: 2 },
        ];

        for (let box = 0; box < Sudoku.#BOARD_RESOLUTION; box++) {
            const boxCells = firstBoxCellCoordinates.map(
                ({ row, column }): Coordinate => {
                    const boxRow = box < 3 ? 0 : box < 6 ? 1 : 2;
                    const boxColumn = box % 3;
                    const newRow = row + boxRow * 3;
                    const newColumn = column + boxColumn * 3;
                    return { row: newRow, column: newColumn };
                }
            );

            boxes.push(boxCells);
        }
        return boxes;
    }

    static #getBoxNumber(cellRow: number, cellColumn: number): number {
        for (let box = 0; box < Sudoku.#BOARD_RESOLUTION; box++) {
            for (const { row, column } of Sudoku.#boxesCoordinates[box]) {
                if (cellRow === row && cellColumn === column) {
                    return box;
                }
            }
        }

        // should not be reachable
        throw new Error(
            `Cell marked as row ${cellRow} and column ${cellColumn} which is out of bounds`
        );
    }
}

export default Sudoku;
module.exports = Sudoku;
