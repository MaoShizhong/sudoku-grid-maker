import Sudoku from '..';

describe('History', (): void => {
    describe('Grid state history array', (): void => {
        it('appends new history grid state upon change to puzzle grid', (): void => {
            const sudoku = new Sudoku();

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            expect(sudoku.history.gridStatesCount).toBe(2);

            sudoku.removeNumber({ row: 1, column: 1 });
            expect(sudoku.history.gridStatesCount).toBe(3);

            sudoku.togglePencilMark({ number: 2, row: 2, column: 2 });
            expect(sudoku.history.gridStatesCount).toBe(4);

            sudoku.togglePencilMark({ number: 2, row: 2, column: 2 });
            expect(sudoku.history.gridStatesCount).toBe(5);
        });

        it('currentState returns grid state pointed to by current history index', (): void => {
            const emptyGrid = new Sudoku().grid;

            const sudoku = new Sudoku();
            const firstGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).toEqual(firstGridStateInHistory);

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            const secondGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).not.toEqual(emptyGrid);
            expect(sudoku.grid).toEqual(secondGridStateInHistory);
        });

        test('grid state history stores deep clones of the respective active puzzle grid states', (): void => {
            const sudoku = new Sudoku();
            const firstGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).not.toBe(firstGridStateInHistory);

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            const secondGridStateInHistory = sudoku.history.currentGridState;
            expect(sudoku.grid).not.toBe(secondGridStateInHistory);
        });
    });

    describe('undo', (): void => {
        it('sets active grid state to previous in history if available', (): void => {
            const sudoku = new Sudoku();
            const emptyGrid = new Sudoku().grid;

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            sudoku.undo();

            expect(sudoku.grid).toEqual(emptyGrid);
            expect(sudoku.grid).toEqual(sudoku.history.currentGridState);
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

    describe('reset', (): void => {
        it('resets grid state history to starting grid state', (): void => {
            const sudoku = new Sudoku();
            const emptyGrid = new Sudoku().grid;

            sudoku.addNumber({ newNumber: 1, row: 1, column: 1 });
            sudoku.addNumber({ newNumber: 2, row: 2, column: 2 });
            sudoku.addNumber({ newNumber: 3, row: 3, column: 3 });
            sudoku.reset();

            expect(sudoku.grid).toEqual(emptyGrid);
            expect(sudoku.grid).toEqual(sudoku.history.currentGridState);
            expect(sudoku.history.gridStatesCount).toBe(1);
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
            sudoku.togglePencilMark({ number: 8, row: 1, column: 1 });

            expect(sudoku.history.gridStatesCount).toBe(2);
            expect(sudoku.grid).not.toEqual(emptyGrid);
            expect(sudoku.grid).not.toEqual(gridStateAfterFirstNumberAdded);
            expect(sudoku.grid).toEqual(sudoku.history.currentGridState);

            sudoku.addNumber({ newNumber: 3, row: 5, column: 5 });
            sudoku.togglePencilMark({ number: 8, row: 1, column: 1 });
            expect(sudoku.history.gridStatesCount).toBe(4);

            sudoku.undo();
            sudoku.undo();

            sudoku.togglePencilMark({ number: 8, row: 1, column: 1 });
            expect(sudoku.history.gridStatesCount).toBe(3);
            expect(sudoku.grid).toEqual(emptyGrid);
        });
    });
});
