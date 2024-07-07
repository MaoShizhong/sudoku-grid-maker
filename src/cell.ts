import { CellValue, SudokuNumber } from './types';

export class Cell {
    #value: CellValue;
    #pencilMarks: Set<SudokuNumber>;

    constructor(value: CellValue = null) {
        this.#value = value;
        this.#pencilMarks = new Set();
    }

    get value(): CellValue {
        return this.#value;
    }

    set value(number: CellValue) {
        this.#pencilMarks.clear();
        this.#value = number;
    }

    get pencilMarks(): Set<SudokuNumber> {
        return this.#pencilMarks;
    }

    addPencilMark(number: SudokuNumber): void {
        if (this.#value !== null || this.pencilMarks.has(number)) {
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
