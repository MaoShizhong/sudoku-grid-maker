import { CellProps, CellValue, SudokuNumber } from './types';

export class Cell implements CellProps {
    value: CellValue;
    row: number;
    column: number;
    pencilMarks: SudokuNumber[];
    #isLocked: boolean;

    constructor({ value = null, row, column, pencilMarks = [] }: CellProps) {
        this.value = value;
        this.row = row;
        this.column = column;
        this.pencilMarks = pencilMarks;
        this.#isLocked = Boolean(value);
    }

    get isLocked(): boolean {
        return this.#isLocked;
    }

    togglePencilMark(number: SudokuNumber): void {
        if (this.pencilMarks.includes(number)) {
            this.pencilMarks.splice(this.pencilMarks.indexOf(number), 1);
        } else if (this.value === null) {
            this.pencilMarks.push(number);
        }
    }

    clearPencilMarks(): void {
        this.pencilMarks = [];
    }
}
