import { CellValue, SudokuNumber } from './types';

export class Cell {
    value: CellValue;
    #pencilMarks: Set<SudokuNumber>;

    constructor(value: CellValue = null) {
        this.value = value;
        this.#pencilMarks = new Set();
    }

    get pencilMarks(): Set<SudokuNumber> {
        return this.#pencilMarks;
    }

    addPencilMark(number: SudokuNumber): void {
        if (this.pencilMarks.has(number)) {
            return;
        }

        this.pencilMarks.add(number);
    }

    removePencilMark(number: SudokuNumber): void {
        if (this.pencilMarks.has(number)) {
            this.pencilMarks.delete(number);
        }
    }
}
