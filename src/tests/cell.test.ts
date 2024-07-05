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
        expect(new Cell().pencilMarks).toEqual(new Set());
    });
});

describe('addPencilMark', (): void => {
    it('Adds 1-9 to .pencilMarks if not already in set', (): void => {
        const cell = new Cell();
        for (let i = 1; i <= 9; i++) {
            const num = i as SudokuNumber;
            cell.addPencilMark(num);
            expect(cell.pencilMarks.has(num)).toBe(true);
        }
    });

    it('Does not add number to .pencilMarks if already in set', (): void => {
        const cell = new Cell();
        cell.addPencilMark(5);
        cell.addPencilMark(5);
        expect(cell.pencilMarks.size).toBe(1);
    });

    it('Does not add number to .pencilMarks if already in set', (): void => {
        const cell = new Cell();
        cell.addPencilMark(5);
        cell.addPencilMark(5);
        expect(cell.pencilMarks.size).toBe(1);
    });
});

describe('removePencilMark', (): void => {
    it('Deletes an existing pencil mark', (): void => {
        const cell = new Cell();
        cell.addPencilMark(5);
        cell.removePencilMark(5);
        expect(cell.pencilMarks.size).toBe(0);
    });

    it('Does nothing if trying to delete a non-existant pencil mark', (): void => {
        const cell = new Cell();
        cell.addPencilMark(5);
        cell.removePencilMark(6);
        expect(cell.pencilMarks.has(5)).toBe(true);
        expect(cell.pencilMarks.size).toBe(1);
    });
});
