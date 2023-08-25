const Screen = require("./screen");

class Cursor {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.gridColor = 'black';
    this.cursorColor = 'yellow';
    this.selection = [];
  }

  resetBackgroundColor() {
    if (this.selection.find((element) => element.row === this.row && element.col === this.col)) {
      Screen.setBackgroundColor(this.row, this.col, 'cyan');
    } else {
      Screen.setBackgroundColor(this.row, this.col, this.gridColor);
    }
  }

  setBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.cursorColor);
  }

  up = () => {
    // Move cursor up
    if (this.row > 0) {
      this.resetBackgroundColor();
      this.row--;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  down = () => {
    // Move cursor down
    if (this.row < this.numRows - 1) {
      this.resetBackgroundColor();
      this.row++;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  left = () => {
    // Move cursor left
    if (this.col > 0) {
      this.resetBackgroundColor();
      this.col--;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  right = () => {
    // Move cursor right
    if (this.col < this.numCols - 1) {
      this.resetBackgroundColor();
      this.col++;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  static swapFruits(grid, fruit1, fruit2) {
    if (((fruit1.row === fruit2.row) && (fruit1.col === fruit2.col + 1)) || ((fruit1.row === fruit2.row) && (fruit1.col === fruit2.col - 1)) || ((fruit1.row === fruit2.row + 1) && (fruit1.col === fruit2.col)) || ((fruit1.row === fruit2.row - 1) && (fruit1.col === fruit2.col))) {
      let save = grid[fruit1.row][fruit1.col];

      grid[fruit1.row][fruit1.col] = grid[fruit2.row][fruit2.col];
      grid[fruit2.row][fruit2.col] = save;
    }
  }

  selectFruit(grid, fruit) {
    this.selection.push(fruit);
    Screen.setBackgroundColor(this.row, this.col, 'cyan');
    Screen.render();
  }
}


module.exports = Cursor;
