import { Cell } from './cell';
import { CellValue, SudokuNumber } from './types';

export class Region {
    static CELL_COUNT_ERROR = 'Regions must contain 9 cells';
    static DUPLICATE_NUMBERS_ERROR =
        'Regions cannot contain multiple cells with the same non-null values';
    static #CELL_COUNT = 9;
    cells: Cell[];

    constructor(...cells: Cell[]) {
        if (cells.length !== Region.#CELL_COUNT) {
            throw new RangeError(Region.CELL_COUNT_ERROR);
        }
        if (Region.#containsDuplicateCellNumbers(cells)) {
            throw new RangeError(Region.DUPLICATE_NUMBERS_ERROR);
        }

        this.cells = cells;
    }

    canPlaceNumber(number: SudokuNumber): boolean {
        return !this.cells.some((cell): boolean => cell.value === number);
    }

    static #containsDuplicateCellNumbers(cells: Cell[]): boolean {
        const cellValues: CellValue[] = [];
        for (const cell of cells) {
            if (cellValues.includes(cell.value)) {
                return true;
            } else if (cell.value !== null) {
                cellValues.push(cell.value);
            }
        }
        return false;
    }
}
