import { Cell } from '../cell';
import { Region } from '../region';
import Sudoku from '../sudoku';

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
