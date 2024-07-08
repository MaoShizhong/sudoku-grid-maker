import { Cell } from '../cell';
import { Region } from '../region';
import { CellValue } from '../types';

// Cells' .value is a getter. No public properties.
// .toEqual matcher will always return true for two "different" grid states
export function showsSameCellStates(
    a: Cell[][] | Region[],
    b: Cell[][] | Region[]
): boolean {
    const [cellValuesA, cellValuesB] = [
        toCellValueArray(a),
        toCellValueArray(b),
    ];
    return cellValuesA.toString() === cellValuesB.toString();
}

function toCellValueArray(arr: Cell[][] | Region[]): CellValue[] {
    const flatArr = arr.flat();
    if (flatArr[0] instanceof Region) {
        return (flatArr as Region[])
            .map((region) => region.cells)
            .flat()
            .map((cell) => cell.value);
    } else {
        return (flatArr as Cell[]).map((cell) => cell.value);
    }
}
