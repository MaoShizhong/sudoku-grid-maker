import { Cell } from '../cell';
import { Region } from '../region';
import Sudoku from '../sudoku';
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

describe('Regions', (): void => {
    const sudoku = new Sudoku();

    describe('rows', (): void => {
        const rows = sudoku.rows;

        it('has 9 rows', (): void => {
            expect(rows.length).toBe(9);
        });

        it('has each row in this.rows corresponding to each grid row', (): void => {
            rows.forEach((row, rowIndex): void => {
                expect(row).toBeInstanceOf(Region);
                row.cells.forEach((cell, cellIndex): void => {
                    expect(cell).toBe(sudoku.grid[rowIndex][cellIndex]);
                });
            });
        });
    });

    describe('columns', (): void => {
        const columns = sudoku.columns;

        it('has 9 columns', (): void => {
            expect(columns.length).toBe(9);
        });

        it('has each column in this.columns corresponding to each grid column', (): void => {
            columns.forEach((column, columnIndex): void => {
                expect(column).toBeInstanceOf(Region);
                column.cells.forEach((cell, cellIndex): void => {
                    expect(cell).toBe(sudoku.grid[cellIndex][columnIndex]);
                });
            });
        });
    });

    describe('boxes', (): void => {
        const boxes = sudoku.boxes;

        it('has 9 boxes', (): void => {
            expect(boxes.length).toBe(9);
        });

        it('does not have cells shared between boxes', (): void => {
            expect(boxes.length).toBe(9);

            const cells: Cell[] = [];
            boxes.forEach((box): void => {
                cells.push(...box.cells.values());
            });
            expect(cells.length).toBe(9 * 9);
        });

        it('each box covers a unique 3x3 subgrid of cells', (): void => {
            const isFirstBoxTopLeftBox =
                boxes[0].cells.includes(sudoku.grid[0][0]) &&
                boxes[0].cells.includes(sudoku.grid[0][1]) &&
                boxes[0].cells.includes(sudoku.grid[0][2]) &&
                boxes[0].cells.includes(sudoku.grid[1][0]) &&
                boxes[0].cells.includes(sudoku.grid[1][1]) &&
                boxes[0].cells.includes(sudoku.grid[1][2]) &&
                boxes[0].cells.includes(sudoku.grid[2][0]) &&
                boxes[0].cells.includes(sudoku.grid[2][1]) &&
                boxes[0].cells.includes(sudoku.grid[2][2]);

            const isFifthBoxMiddleBox =
                boxes[4].cells.includes(sudoku.grid[3][3]) &&
                boxes[4].cells.includes(sudoku.grid[3][4]) &&
                boxes[4].cells.includes(sudoku.grid[3][5]) &&
                boxes[4].cells.includes(sudoku.grid[4][3]) &&
                boxes[4].cells.includes(sudoku.grid[4][4]) &&
                boxes[4].cells.includes(sudoku.grid[4][5]) &&
                boxes[4].cells.includes(sudoku.grid[5][3]) &&
                boxes[4].cells.includes(sudoku.grid[5][4]) &&
                boxes[4].cells.includes(sudoku.grid[5][5]);

            const isSixthBoxMiddleRightBox =
                boxes[5].cells.includes(sudoku.grid[3][6]) &&
                boxes[5].cells.includes(sudoku.grid[3][7]) &&
                boxes[5].cells.includes(sudoku.grid[3][8]) &&
                boxes[5].cells.includes(sudoku.grid[4][6]) &&
                boxes[5].cells.includes(sudoku.grid[4][7]) &&
                boxes[5].cells.includes(sudoku.grid[4][8]) &&
                boxes[5].cells.includes(sudoku.grid[5][6]) &&
                boxes[5].cells.includes(sudoku.grid[5][7]) &&
                boxes[5].cells.includes(sudoku.grid[5][8]);

            expect(isFirstBoxTopLeftBox).toBe(true);
            expect(isFifthBoxMiddleBox).toBe(true);
            expect(isSixthBoxMiddleRightBox).toBe(true);
        });
    });
});

describe('Methods', (): void => {
    describe('addNumber', (): void => {
        it('does nothing if targeting out of bounds of the grid', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ number: 5, row: 234, column: 10 });
            const gridCellValues = sudoku.grid
                .flat()
                .map((cell): CellValue => cell.value);
            const valuesInGrid = new Set(gridCellValues);

            expect(valuesInGrid.size).toBe(1);
            expect(valuesInGrid.has(null)).toBe(true);
        });

        it('sets single digit number to cell if not already in row/column/box', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ number: 5, row: 0, column: 0 });
            expect(sudoku.grid[0][0].value).toBe(5);

            sudoku.addNumber({ number: 1, row: 2, column: 0 });
            expect(sudoku.grid[2][0].value).toBe(1);

            sudoku.addNumber({ number: 9, row: 8, column: 7 });
            expect(sudoku.grid[8][7].value).toBe(9);
        });

        it('does not throw if target cell contains same number', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ number: 5, row: 0, column: 0 });
            expect((): void =>
                sudoku.addNumber({ number: 5, row: 0, column: 0 })
            ).not.toThrow();
            expect(sudoku.grid[0][0].value).toBe(5);
        });

        it('throws if row already contains number', (): void => {
            expect.assertions(1);
            const sudoku = new Sudoku();

            sudoku.addNumber({ number: 5, row: 0, column: 0 });
            try {
                sudoku.addNumber({ number: 5, row: 0, column: 7 });
            } catch (error) {
                expect(error).toHaveProperty('isAlreadyInRow', true);
            }
        });

        it('throws if column already contains number', (): void => {
            expect.assertions(1);
            const sudoku = new Sudoku();

            sudoku.addNumber({ number: 5, row: 0, column: 0 });
            try {
                sudoku.addNumber({ number: 5, row: 7, column: 0 });
            } catch (error) {
                expect(error).toHaveProperty('isAlreadyInColumn', true);
            }
        });

        it('throws if box already contains number', (): void => {
            expect.assertions(1);
            const sudoku = new Sudoku();

            sudoku.addNumber({ number: 5, row: 0, column: 0 });
            try {
                sudoku.addNumber({ number: 5, row: 1, column: 1 });
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

            sudoku.addNumber({ number: 5, row: 0, column: 0 });
            sudoku.addNumber({ number: 8, row: 4, column: 8 });

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
                (cell): boolean => cell.pencilMarks.size > 0
            );

            expect(hasPencilMarksAdded).toBe(false);
        });

        it('adds a pencil mark to a cell with no pencil marks', (): void => {
            const sudoku = new Sudoku();

            sudoku.addPencilMark({ number: 2, row: 4, column: 6 });
            expect(sudoku.grid[4][6].pencilMarks.size).toBe(1);
            expect(sudoku.grid[4][6].pencilMarks.has(2)).toBe(true);

            sudoku.addPencilMark({ number: 5, row: 1, column: 1 });
            expect(sudoku.grid[1][1].pencilMarks.size).toBe(1);
            expect(sudoku.grid[1][1].pencilMarks.has(5)).toBe(true);
        });

        it('adds a pencil mark to a cell with existing pencil marks', (): void => {
            const sudoku = new Sudoku();

            sudoku.addPencilMark({ number: 5, row: 1, column: 1 });
            expect(sudoku.grid[1][1].pencilMarks.size).toBe(1);
            expect(sudoku.grid[1][1].pencilMarks.has(5)).toBe(true);

            sudoku.addPencilMark({ number: 8, row: 1, column: 1 });
            expect(sudoku.grid[1][1].pencilMarks.size).toBe(2);
            expect(sudoku.grid[1][1].pencilMarks.has(8)).toBe(true);
        });
    });

    describe('removePencilMark', (): void => {
        it('does nothing if targeting out of bounds of the grid', (): void => {
            const sudoku = new Sudoku();

            sudoku.removePencilMark({ number: 5, row: 234, column: 10 });
            const gridCells = sudoku.grid.flat();
            const hasPencilMarksAdded = gridCells.some(
                (cell): boolean => cell.pencilMarks.size > 0
            );

            expect(hasPencilMarksAdded).toBe(false);
        });

        it("does nothing if target pencil mark doesn't exist", (): void => {
            const sudoku = new Sudoku();

            sudoku.removePencilMark({ number: 5, row: 0, column: 0 });
            expect(sudoku.grid[0][0].pencilMarks.size).toBe(0);
        });

        it('removes a pencil mark from a cell', (): void => {
            const sudoku = new Sudoku();

            sudoku.addPencilMark({ number: 2, row: 4, column: 6 });
            sudoku.removePencilMark({ number: 2, row: 4, column: 6 });
            expect(sudoku.grid[4][6].pencilMarks.size).toBe(0);

            sudoku.addPencilMark({ number: 5, row: 1, column: 1 });
            sudoku.addPencilMark({ number: 8, row: 1, column: 1 });
            sudoku.removePencilMark({ number: 5, row: 1, column: 1 });
            expect(sudoku.grid[1][1].pencilMarks.size).toBe(1);
            expect(sudoku.grid[1][1].pencilMarks.has(8)).toBe(true);
        });
    });
});
