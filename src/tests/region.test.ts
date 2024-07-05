import { Cell } from '../cell';
import { Region } from '../region';
import { SudokuNumber } from '../types';

describe('Region class instantiation', (): void => {
    it('can only instantiate when given 9 cells', (): void => {
        const cells: Cell[] = [];
        for (let i = 0; i < 9; i++) {
            cells.push(new Cell());
        }
        expect((): Region => new Region(...cells)).not.toThrow();
    });

    it('throws if not given 9 cells', (): void => {
        const cells: Cell[] = [];
        for (let i = 0; i < 5; i++) {
            cells.push(new Cell());
        }
        expect((): Region => new Region(...cells)).toThrow(
            Region.CELL_COUNT_ERROR
        );
    });

    it('throws if given multiple cells with the same non-null value', (): void => {
        const cells: Cell[] = [];
        for (let i = 0; i < 9; i++) {
            cells.push(new Cell(3));
        }
        expect((): Region => new Region(...cells)).toThrow(
            Region.DUPLICATE_NUMBERS_ERROR
        );
    });
});

describe('canPlaceNumber', (): void => {
    const cells: Cell[] = [new Cell()];
    for (let i = 1; i <= 8; i++) {
        cells.push(new Cell(i as SudokuNumber));
    }
    const region = new Region(...cells);

    it('allows placing number if no region cell with that value', ():void => {
        expect(region.canPlaceNumber(9)).toBe(true);
    });

    it('disallows placing number if already a region cell with that value', ():void => {
        expect(region.canPlaceNumber(4)).toBe(false);
    });
});
