import Sudoku from '../sudoku';

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
            const emptyGrid = new Sudoku().grid;

            const sudoku = new Sudoku();
            const firstGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).toEqual(firstGridStateInHistory.grid);
            expect(sudoku.rows).toEqual(firstGridStateInHistory.rows);
            expect(sudoku.columns).toEqual(firstGridStateInHistory.columns);
            expect(sudoku.boxes).toEqual(firstGridStateInHistory.boxes);

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            const secondGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).not.toEqual(emptyGrid);
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

            expect(sudoku.grid).toEqual(emptyGrid);
            expect(sudoku.grid).toEqual(sudoku.history.currentGridState.grid);
            expect(sudoku.rows).toEqual(sudoku.history.currentGridState.rows);
            expect(sudoku.columns).toEqual(
                sudoku.history.currentGridState.columns
            );
            expect(sudoku.boxes).toEqual(sudoku.history.currentGridState.boxes);
        });

        it('maintains the first grid state if already at first', (): void => {
            const sudoku = new Sudoku();
            const emptyGrid = new Sudoku().grid;

            sudoku.undo();
            expect(sudoku.grid).toEqual(emptyGrid);

            sudoku.undo();
            expect(sudoku.grid).toEqual(emptyGrid);
        });

        it('does not change grid state count when undoing', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            expect(sudoku.history.gridStatesCount).toBe(2);

            sudoku.undo();
            expect(sudoku.history.gridStatesCount).toBe(2);

            sudoku.undo();
            expect(sudoku.history.gridStatesCount).toBe(2);
        });
    });

    describe('redo', (): void => {
        it('sets active grid state to next in history if available', (): void => {
            const sudoku = new Sudoku();
            const emptyGrid = new Sudoku().grid;

            sudoku.addNumber({ newNumber: 9, row: 3, column: 5 });
            const secondGridState = structuredClone(sudoku.grid);

            sudoku.undo();
            sudoku.redo();
            expect(sudoku.grid).not.toEqual(emptyGrid);
            expect(secondGridState).not.toEqual(emptyGrid);
            expect(sudoku.grid).toEqual(secondGridState);
        });

        it('maintains the latest grid state if already at latest', (): void => {
            const sudoku = new Sudoku();
            const emptyGrid = new Sudoku().grid;

            sudoku.addNumber({ newNumber: 9, row: 3, column: 5 });
            const secondGridState = structuredClone(sudoku.grid);

            sudoku.redo();
            expect(sudoku.grid).not.toEqual(emptyGrid);
            expect(sudoku.grid).toEqual(secondGridState);
        });

        it('does not change grid state count when redoing', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            expect(sudoku.history.gridStatesCount).toBe(2);

            sudoku.undo();
            sudoku.redo();
            expect(sudoku.history.gridStatesCount).toBe(2);
        });
    });

    describe('Recording new grid states after undoing', (): void => {
        it('removes all proceeding grid states in history if recording new grid state after undoing', (): void => {
            const emptyGrid = new Sudoku().grid;
            const sudoku = new Sudoku();
            sudoku.addNumber({ newNumber: 5, row: 0, column: 0 });
            const gridStateAfterFirstNumberAdded = structuredClone(
                sudoku.history.currentGridState
            );
            sudoku.undo();
            sudoku.addPencilMark({ number: 8, row: 1, column: 1 });

            expect(sudoku.history.gridStatesCount).toBe(2);
            expect(sudoku.grid).not.toEqual(emptyGrid);
            expect(sudoku.grid).not.toEqual(
                gridStateAfterFirstNumberAdded.grid
            );
            expect(sudoku.grid).toEqual(sudoku.history.currentGridState.grid);
        });
    });
});
