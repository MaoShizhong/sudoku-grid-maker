import { CellProps, CellValue, SudokuNumber } from './types';

export class Cell implements CellProps {
    value: CellValue;
    row: number;
    column: number;
    pencilMarks: SudokuNumber[];

    constructor({ value = null, row, column, pencilMarks = [] }: CellProps) {
        this.value = value;
        this.row = row;
        this.column = column;
        this.pencilMarks = pencilMarks;
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
