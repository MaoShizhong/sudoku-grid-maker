import { Cell } from '../cell';
import { SudokuNumber } from '../types';

describe('Cell instantiation', (): void => {
    it('initialises .value as null if instantiated without an argument', (): void => {
        expect(new Cell().value).toBe(null);
    });

    it('initialises .value with number argument', (): void => {
        expect(new Cell(6).value).toBe(6);
    });

    it('initialises .pencilMarks as empty set', (): void => {
        expect(new Cell().pencilMarks).toEqual([]);
    });
});

describe('pencil marks', (): void => {
    describe('addPencilMark', (): void => {
        it('adds 1-9 to .pencilMarks if not already in set', (): void => {
            const cell = new Cell();
            for (let i = 1; i <= 9; i++) {
                const num = i as SudokuNumber;
                cell.addPencilMark(num);
                expect(cell.pencilMarks.includes(num)).toBe(true);
            }
        });

        it('does not add number to .pencilMarks if already in set', (): void => {
            const cell = new Cell();
            cell.addPencilMark(5);
            cell.addPencilMark(5);
            expect(cell.pencilMarks.length).toBe(1);
        });

        it('does not add number to .pencilMarks if .value is not null', (): void => {
            const cell = new Cell();
            cell.value = 2;
            cell.addPencilMark(5);
            expect(cell.pencilMarks.length).toBe(0);
        });
    });

    describe('removePencilMark', (): void => {
        it('deletes an existing pencil mark', (): void => {
            const cell = new Cell();
            cell.addPencilMark(5);
            cell.removePencilMark(5);
            expect(cell.pencilMarks.length).toBe(0);
        });

        it('does nothing if trying to delete a non-existant pencil mark', (): void => {
            const cell = new Cell();
            cell.addPencilMark(5);
            cell.removePencilMark(6);
            expect(cell.pencilMarks.includes(5)).toBe(true);
            expect(cell.pencilMarks.length).toBe(1);
        });
    });
});
