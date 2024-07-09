import { CellValue, SudokuNumber } from './types';

export class Cell {
    value: CellValue;
    pencilMarks: SudokuNumber[];

    constructor(value: CellValue = null) {
        this.value = value;
        this.pencilMarks = [];
    }

    addPencilMark(number: SudokuNumber): void {
        if (this.value !== null || this.pencilMarks.includes(number)) {
            return;
        }

        this.pencilMarks.push(number);
    }

    removePencilMark(number: SudokuNumber): void {
        if (this.pencilMarks.includes(number)) {
            this.pencilMarks.splice(this.pencilMarks.indexOf(number), 1);
        }
    }

    clearPencilMarks(): void {
        this.pencilMarks = [];
    }
}
