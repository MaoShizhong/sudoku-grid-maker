import { Cell } from '../cell';
import { SudokuNumber } from '../types';

describe('Cell instantiation', (): void => {
    it('initialises .value as null if instantiated without a value prop', (): void => {
        expect(new Cell({ row: 0, column: 0 }).value).toBe(null);
    });

    it('initialises .value with number argument', (): void => {
        expect(new Cell({ value: 6, row: 0, column: 0 }).value).toBe(6);
    });

    it('initialises .pencilMarks as empty array', (): void => {
        expect(new Cell({ value: 6, row: 0, column: 0 }).pencilMarks).toEqual(
            []
        );
    });
});

describe('pencil marks', (): void => {
    describe('togglePencilMark', (): void => {
        it('adds 1-9 to .pencilMarks if not already in set', (): void => {
            const cell = new Cell({ row: 0, column: 0 });
            for (let i = 1; i <= 9; i++) {
                const num = i as SudokuNumber;
                cell.togglePencilMark(num);
                expect(cell.pencilMarks.includes(num)).toBe(true);
            }
        });

        it('does not add pencil marks if cell has a number value', (): void => {
            const cell = new Cell({ row: 0, column: 0 });
            cell.value = 2;
            cell.togglePencilMark(5);
            expect(cell.pencilMarks.length).toBe(0);
        });

        it('deletes an existing pencil mark', (): void => {
            const cell = new Cell({ row: 0, column: 0 });
            cell.togglePencilMark(5);
            cell.togglePencilMark(5);
            expect(cell.pencilMarks.includes(5)).toBe(false);
        });
    });
});
