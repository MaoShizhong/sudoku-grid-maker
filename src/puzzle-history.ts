import { Cell } from './cell';
import { CellProps, SudokuPuzzle } from './types';

export class PuzzleHistory {
    #currentGridStateIndex = 0;
    #gridStates: string[];

    static #toCellGrid(gridState: string): Cell[][] {
        const pojoGrid: CellProps[][] = JSON.parse(gridState);
        const cellGrid = pojoGrid.map((row): Cell[] => {
            return row.map((obj) => new Cell(obj));
        });
        return cellGrid;
    }

    constructor(startingGridState: SudokuPuzzle) {
        const startingGridStateCopy = JSON.stringify(startingGridState);
        this.#gridStates = [startingGridStateCopy];
    }

    get gridStatesCount(): number {
        return this.#gridStates.length;
    }

    get currentGridState(): SudokuPuzzle {
        return PuzzleHistory.#toCellGrid(
            this.#gridStates[this.#currentGridStateIndex]
        );
    }

    toPreviousGridState(): SudokuPuzzle {
        const hasPreviousGridState = this.#currentGridStateIndex > 0;
        if (hasPreviousGridState) {
            this.#currentGridStateIndex--;
        }

        return this.currentGridState;
    }

    toNextGridState(): SudokuPuzzle {
        const hasNextGridState =
            this.#currentGridStateIndex < this.gridStatesCount - 1;
        if (hasNextGridState) {
            this.#currentGridStateIndex++;
        }

        return this.currentGridState;
    }

    reset(): void {
        this.#currentGridStateIndex = 0;
        this.#gridStates = [this.#gridStates[0]];
    }

    recordNewGridState(gridState: SudokuPuzzle): void {
        const gridStateCopy = JSON.stringify(gridState);
        this.#currentGridStateIndex++;
        this.#gridStates.splice(
            this.#currentGridStateIndex,
            Infinity,
            gridStateCopy
        );
    }
}
