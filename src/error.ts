import { PlacementErrorDetails } from './types';

export class PlacementError extends Error implements PlacementErrorDetails {
    isAlreadyInRow;
    isAlreadyInColumn;
    isAlreadyInBox;

    constructor({
        isAlreadyInRow,
        isAlreadyInColumn,
        isAlreadyInBox,
    }: PlacementErrorDetails) {
        super('Cannot place number');
        this.isAlreadyInRow = isAlreadyInRow;
        this.isAlreadyInColumn = isAlreadyInColumn;
        this.isAlreadyInBox = isAlreadyInBox;
    }
}
