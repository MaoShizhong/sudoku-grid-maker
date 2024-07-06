import { Cell } from './cell';
import { Region } from './region';

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
