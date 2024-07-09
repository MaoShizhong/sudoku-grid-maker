import { CellValue, SudokuNumber } from './types';

export class Cell {
    value: CellValue;
    pencilMarks = new Set<SudokuNumber>();

    constructor(value: CellValue = null) {
        this.value = value;
    }

    addPencilMark(number: SudokuNumber): void {
        if (this.value !== null || this.pencilMarks.has(number)) {
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
