import Sudoku from '../sudoku';
import { showsSameCellStates } from './test-util';

describe('History', (): void => {
    describe('Grid state history array', (): void => {
        it('appends new history grid state upon change to puzzle grid', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            expect(sudoku.history.gridStatesCount).toBe(2);

            sudoku.removeNumber({ row: 1, column: 1 });
            expect(sudoku.history.gridStatesCount).toBe(3);

            sudoku.addPencilMark({ number: 2, row: 2, column: 2 });
            expect(sudoku.history.gridStatesCount).toBe(4);

            sudoku.addPencilMark({ number: 2, row: 2, column: 2 });
            expect(sudoku.history.gridStatesCount).toBe(5);
        });

        it('currentState returns grid state pointed to by current history index', (): void => {
            const sudoku = new Sudoku();
            const firstGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).toEqual(firstGridStateInHistory.grid);
            expect(sudoku.rows).toEqual(firstGridStateInHistory.rows);
            expect(sudoku.columns).toEqual(firstGridStateInHistory.columns);
            expect(sudoku.boxes).toEqual(firstGridStateInHistory.boxes);

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            const secondGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).toEqual(secondGridStateInHistory.grid);
            expect(sudoku.rows).toEqual(secondGridStateInHistory.rows);
            expect(sudoku.columns).toEqual(secondGridStateInHistory.columns);
            expect(sudoku.boxes).toEqual(secondGridStateInHistory.boxes);
        });

        test('grid state history stores deep clones of the respective active puzzle grid states', (): void => {
            const sudoku = new Sudoku();
            const firstGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).not.toBe(firstGridStateInHistory.grid);
            expect(sudoku.rows).not.toBe(firstGridStateInHistory.rows);
            expect(sudoku.columns).not.toBe(firstGridStateInHistory.columns);
            expect(sudoku.boxes).not.toBe(firstGridStateInHistory.boxes);

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            const secondGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).not.toBe(secondGridStateInHistory.grid);
            expect(sudoku.rows).not.toBe(secondGridStateInHistory.rows);
            expect(sudoku.columns).not.toBe(secondGridStateInHistory.columns);
            expect(sudoku.boxes).not.toBe(secondGridStateInHistory.boxes);
        });
    });

    describe('undo', (): void => {
        it('sets active grid state to previous in history if available', (): void => {
            const sudoku = new Sudoku();
            const emptyGrid = new Sudoku().grid;

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            sudoku.undo();

            expect(showsSameCellStates(sudoku.grid, emptyGrid)).toBe(true);
            expect(
                showsSameCellStates(
                    sudoku.grid,
                    sudoku.history.currentGridState.grid
                )
            ).toBe(true);
            expect(
                showsSameCellStates(
                    sudoku.rows,
                    sudoku.history.currentGridState.rows
                )
            ).toBe(true);
            expect(
                showsSameCellStates(
                    sudoku.columns,
                    sudoku.history.currentGridState.columns
                )
            ).toBe(true);
            expect(
                showsSameCellStates(
                    sudoku.boxes,
                    sudoku.history.currentGridState.boxes
                )
            ).toBe(true);
        });
    });

    describe('redo', (): void => {
        it.skip('sets active grid state to next in history if available', (): void => {});
    });
});
