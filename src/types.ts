import { Cell } from './cell';

export type SudokuNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CellValue = SudokuNumber | null;

export type SudokuPuzzle = Cell[][];

export type PlacementErrorDetails = {
    isAlreadyInRow: boolean;
    isAlreadyInColumn: boolean;
    isAlreadyInBox: boolean;
};

export type CellProps = {
    value?: CellValue;
    row: number;
    column: number;
    pencilMarks?: SudokuNumber[];
};

export type Coordinate = { row: number; column: number };
export type Box = Coordinate[];
