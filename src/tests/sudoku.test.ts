import Sudoku from '..';
import { Cell } from '../cell';
import { CellValue } from '../types';

describe('Sudoku grid', (): void => {
    const sudoku = new Sudoku();

    it('has 9 rows of 9 cells', (): void => {
        expect(Array.isArray(sudoku.grid)).toBe(true);
        expect(sudoku.grid.length).toBe(9);
        sudoku.grid.forEach((row): void => {
            expect(row.length).toBe(9);
            expect(row.every((el): boolean => el instanceof Cell)).toBe(true);
        });
    });

    it('contains all unique Cell objects', (): void => {
        const uniqueCells = new Set(sudoku.grid);
        expect(uniqueCells.size).toBe(sudoku.grid.length);
    });
});

describe('Starting values', (): void => {
    const CELL_VALUES = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
    function generateRandomValuesArray(): CellValue[][] {
        const valuesArray: CellValue[][] = [];
        for (let i = 0; i < 9; i++) {
            const row: CellValue[] = [];
            for (let j = 0; j < 9; j++) {
                const randomCellValue =
                    CELL_VALUES[Math.floor(Math.random() * CELL_VALUES.length)];
                row.push(randomCellValue);
            }
            valuesArray.push(row);
        }
        return valuesArray;
    }

    it('initialises all grid values as null if no constructor argument', (): void => {
        const sudoku = new Sudoku();
        expect(JSON.stringify(sudoku)).toBe(
            '[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]]'
        );
    });

    it('initialises grid with populated values based on constructor input array', (): void => {
        const RANDOM_TEST_COUNT = 10;
        for (let i = 0; i < RANDOM_TEST_COUNT; i++) {
            const randomValuesArray = generateRandomValuesArray();
            const randomValuesArrayString = JSON.stringify(randomValuesArray);

            const sudoku = new Sudoku(randomValuesArray);
            expect(JSON.stringify(sudoku)).toBe(randomValuesArrayString);
        }
    });
});

describe('Methods', (): void => {
    describe('addNumber', (): void => {
        it('does nothing if targeting out of bounds of the grid', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 5, row: 234, column: 10 });
            const gridCellValues = sudoku.grid
                .flat()
                .map((cell): CellValue => cell.value);
            const valuesInGrid = new Set(gridCellValues);

            expect(valuesInGrid.size).toBe(1);
            expect(valuesInGrid.has(null)).toBe(true);
        });

        it('sets single digit number to cell if not already in row/column/box', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 5, row: 0, column: 0 });
            expect(sudoku.grid[0][0].value).toBe(5);

            sudoku.addNumber({ newNumber: 1, row: 2, column: 0 });
            expect(sudoku.grid[2][0].value).toBe(1);

            sudoku.addNumber({ newNumber: 9, row: 8, column: 7 });
            expect(sudoku.grid[8][7].value).toBe(9);

            sudoku.addNumber({ newNumber: 4, row: 8, column: 7 });
            expect(sudoku.grid[8][7].value).toBe(4);
        });

        it('does not throw if target cell contains same number', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 5, row: 0, column: 0 });
            expect((): void =>
                sudoku.addNumber({ newNumber: 5, row: 0, column: 0 })
            ).not.toThrow();
            expect(sudoku.grid[0][0].value).toBe(5);
        });

        it('clears target cell pencil marks when changing its value', (): void => {
            const sudoku = new Sudoku();
            sudoku.addPencilMark({ number: 5, row: 0, column: 0 });
            sudoku.addPencilMark({ number: 6, row: 0, column: 0 });
            sudoku.addPencilMark({ number: 8, row: 0, column: 0 });
            sudoku.addNumber({ newNumber: 8, row: 0, column: 0 });

            expect(sudoku.grid[0][0].pencilMarks.length).toBe(0);
        });

        it('throws if row already contains number', (): void => {
            expect.assertions(1);
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 5, row: 0, column: 0 });
            try {
                sudoku.addNumber({ newNumber: 5, row: 0, column: 7 });
            } catch (error) {
                expect(error).toHaveProperty('isAlreadyInRow', true);
            }
        });

        it('throws if column already contains number', (): void => {
            expect.assertions(1);
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 5, row: 0, column: 0 });
            try {
                sudoku.addNumber({ newNumber: 5, row: 7, column: 0 });
            } catch (error) {
                expect(error).toHaveProperty('isAlreadyInColumn', true);
            }
        });

        it('throws if box already contains number', (): void => {
            expect.assertions(1);
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 5, row: 0, column: 0 });
            try {
                sudoku.addNumber({ newNumber: 5, row: 1, column: 1 });
            } catch (error) {
                expect(error).toHaveProperty('isAlreadyInBox', true);
            }
        });
    });

    describe('removeNumber', (): void => {
        it('does nothing if targeting out of bounds of the grid', (): void => {
            const sudoku = new Sudoku();

            sudoku.removeNumber({ row: 234, column: 10 });
            const gridCellValues = sudoku.grid
                .flat()
                .map((cell): CellValue => cell.value);
            const valuesInGrid = new Set(gridCellValues);

            expect(valuesInGrid.size).toBe(1);
            expect(valuesInGrid.has(null)).toBe(true);
        });

        it("removes a cell's number", (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 5, row: 0, column: 0 });
            sudoku.addNumber({ newNumber: 8, row: 4, column: 8 });

            sudoku.removeNumber({ row: 0, column: 0 });
            sudoku.removeNumber({ row: 4, column: 8 });
            sudoku.removeNumber({ row: 7, column: 3 });

            expect(sudoku.grid[0][0].value).toBe(null);
            expect(sudoku.grid[4][8].value).toBe(null);
            expect(sudoku.grid[7][3].value).toBe(null);
        });
    });

    describe('addPencilMark', (): void => {
        it('does nothing if targeting out of bounds of the grid', (): void => {
            const sudoku = new Sudoku();

            sudoku.addPencilMark({ number: 5, row: 234, column: 10 });
            const gridCells = sudoku.grid.flat();
            const hasPencilMarksAdded = gridCells.some(
                (cell): boolean => cell.pencilMarks.length > 0
            );

            expect(hasPencilMarksAdded).toBe(false);
        });

        it('adds a pencil mark to a cell with no pencil marks', (): void => {
            const sudoku = new Sudoku();

            sudoku.addPencilMark({ number: 2, row: 4, column: 6 });
            expect(sudoku.grid[4][6].pencilMarks.length).toBe(1);
            expect(sudoku.grid[4][6].pencilMarks.includes(2)).toBe(true);

            sudoku.addPencilMark({ number: 5, row: 1, column: 1 });
            expect(sudoku.grid[1][1].pencilMarks.length).toBe(1);
            expect(sudoku.grid[1][1].pencilMarks.includes(5)).toBe(true);
        });

        it('adds a pencil mark to a cell with existing pencil marks', (): void => {
            const sudoku = new Sudoku();

            sudoku.addPencilMark({ number: 5, row: 1, column: 1 });
            expect(sudoku.grid[1][1].pencilMarks.length).toBe(1);
            expect(sudoku.grid[1][1].pencilMarks.includes(5)).toBe(true);

            sudoku.addPencilMark({ number: 8, row: 1, column: 1 });
            expect(sudoku.grid[1][1].pencilMarks.length).toBe(2);
            expect(sudoku.grid[1][1].pencilMarks.includes(8)).toBe(true);
        });
    });

    describe('removePencilMark', (): void => {
        it('does nothing if targeting out of bounds of the grid', (): void => {
            const sudoku = new Sudoku();

            sudoku.removePencilMark({ number: 5, row: 234, column: 10 });
            const gridCells = sudoku.grid.flat();
            const hasPencilMarksAdded = gridCells.some(
                (cell): boolean => cell.pencilMarks.length > 0
            );

            expect(hasPencilMarksAdded).toBe(false);
        });

        it("does nothing if target pencil mark doesn't exist", (): void => {
            const sudoku = new Sudoku();

            sudoku.removePencilMark({ number: 5, row: 0, column: 0 });
            expect(sudoku.grid[0][0].pencilMarks.length).toBe(0);
        });

        it('removes a pencil mark from a cell', (): void => {
            const sudoku = new Sudoku();

            sudoku.addPencilMark({ number: 2, row: 4, column: 6 });
            sudoku.removePencilMark({ number: 2, row: 4, column: 6 });
            expect(sudoku.grid[4][6].pencilMarks.length).toBe(0);

            sudoku.addPencilMark({ number: 5, row: 1, column: 1 });
            sudoku.addPencilMark({ number: 8, row: 1, column: 1 });
            sudoku.removePencilMark({ number: 5, row: 1, column: 1 });
            expect(sudoku.grid[1][1].pencilMarks.length).toBe(1);
            expect(sudoku.grid[1][1].pencilMarks.includes(8)).toBe(true);
        });
    });
});

describe('Number/pencil mark interactions', (): void => {
    it('removes matching pencil marks from Regions with target cell when setting number', (): void => {
        const sudoku = new Sudoku();

        sudoku.addPencilMark({ number: 2, row: 3, column: 3 });
        sudoku.addPencilMark({ number: 4, row: 3, column: 3 });
        sudoku.addPencilMark({ number: 9, row: 3, column: 3 });
        sudoku.addPencilMark({ number: 2, row: 4, column: 8 });
        sudoku.addPencilMark({ number: 2, row: 8, column: 4 });

        // Add number to central cell, so row 4, column 4, box 4 (0-indexed)
        sudoku.addNumber({ newNumber: 2, row: 4, column: 4 });

        expect(sudoku.grid[3][3].pencilMarks.length).toBe(2);
        expect(sudoku.grid[3][3].pencilMarks.includes(2)).toBe(false);
        expect(sudoku.grid[4][8].pencilMarks.includes(2)).toBe(false);
        expect(sudoku.grid[8][4].pencilMarks.includes(2)).toBe(false);

        // change central cell number to 9
        sudoku.addNumber({ newNumber: 9, row: 4, column: 4 });
        expect(sudoku.grid[3][3].pencilMarks.length).toBe(1);
        expect(sudoku.grid[3][3].pencilMarks.includes(9)).toBe(false);
    });
});
