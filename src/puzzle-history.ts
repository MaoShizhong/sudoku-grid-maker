import { Cell } from './cell';
import { SudokuPuzzle } from './types';

export class PuzzleHistory {
    #currentGridStateIndex = 0;
    #gridStates: SudokuPuzzle[];

    constructor(startingGridState: SudokuPuzzle) {
        const startingGridStateCopy =
            PuzzleHistory.#deepClone(startingGridState);
        this.#gridStates = [startingGridStateCopy];
    }

    get gridStatesCount(): number {
        return this.#gridStates.length;
    }

    get currentGridState(): SudokuPuzzle {
        return PuzzleHistory.#deepClone(
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

    recordNewGridState(gridState: SudokuPuzzle): void {
        const gridStateCopy = PuzzleHistory.#deepClone(gridState);
        this.#currentGridStateIndex++;
        this.#gridStates.splice(
            this.#currentGridStateIndex,
            Infinity,
            gridStateCopy
        );
    }

    static #deepClone(grid: SudokuPuzzle): SudokuPuzzle {
        const clonedGridWithPojos = structuredClone(grid);
        const clonedGridWithCells = clonedGridWithPojos.map((row): Cell[] => {
            return row.map((obj): Cell => new Cell(obj));
        });
        return clonedGridWithCells;
    }
}
