# Sudoku Grid Maker

A playable sudoku grid maker (not generator). Supports pencil marks and grid history for undo/redo.

## Install

```bash
npm install sudoku-grid-maker
```

## Usage

```javascript
// CJS
const Sudoku = require('sudoku-grid-maker');

// ESM
import Sudoku from 'sudoku-grid-maker';

// create new empty grid
const sudoku = new Sudoku();

// create new populated grid
const initialCellValues = [
    // 2D array of rows of 1-9 or null
];
const sudoku = new Sudoku(initialCellValues);

sudoku.addNumber({ newNumber: 6, row: 2, column: 0 });
sudoku.removeNumber({ row: 2, column: 0 });
sudoku.undo();
sudoku.addPencilMark({ number: 9, row: 0, column: 0 });
sudoku.removePencilMark({ number: 9, row: 0, column: 0 });
sudoku.redo();
```

## Methods

### constructor(startingValues?)

#### startingValues (optional)

A 9x9 2D array containing the numbers 1-9 or null, representing the starting cell values of the grid. If not provided, all cells will be initialised with null values. Any cells that start with number values will be locked (cannot edit values/pencil marks).

### addNumber({ newNumber, row, column })

Set a cell's value to a number (1-9). This will clear the target cell's pencil marks, and will remove any matching pencil marks from any cell in the same box/row/column as the target cell.

Calling this method will first clear any grid history states after the current history index, then record a new grid history state.

#### addNumber.newNumber

The new number value for the cell.

#### addNumber.row

The target cell's row index (0-8).

#### addNumber.column

The target cell's column index (0-8).

### removeNumber({ row, column })

Sets a cell's value to null.

Calling this method will first clear any grid history states after the current history index, then record a new grid history state.

#### removeNumber.row

The row number (0-8) of the cell to remove the value of (set to null).

#### removeNumber.column

The column number (0-8) of the cell to remove the value of (set to null).

### addPencilMark({ number, row, column })

Adds a number (1-9) to a cell's pencil marks, but only if it is empty (null value) or does not already have the pencil mark.

Calling this method will first clear any grid history states after the current history index, then record a new grid history state.

#### addPencilMark.number

The number to add to pencil marks.

#### addPencilMark.row

The target cell's row index (0-8).

#### addPencilMark.column

The target cell's column index (0-8).

### removePencilMark({ number, row, column })

Removes the specified pencil mark from a cell.

Calling this method will first clear any grid history states after the current history index, then record a new grid history state.

#### removePencilMark.number

The pencil mark number to remove.

#### removePencilMark.row

The target cell's row index (0-8).

#### removePencilMark.column

The target cell's column index (0-8).

### undo()

Changes the current grid state to the previously recorded grid state (if one exists).

### redo()

Changes the current grid state to the next recorded grid state (if one exists).

### reset()

Resets the current grid to the original grid state and wipes the rest of the grid history.
