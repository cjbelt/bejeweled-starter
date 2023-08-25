const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

  constructor() {

    this.playerTurn = "O";

    // Initialize this
    this.grid = [];

    this.cursor = new Cursor(8, 8);
    Bejeweled.score = 0;
    Bejeweled.pointsEarned = 0;
    Bejeweled.message = `Score: ${Bejeweled.score}`;
    Bejeweled.combo = 0;

    Screen.initialize(8, 8);
    Screen.setGridlines(false);
    Bejeweled.insertFruits(Screen.grid, true);
    Screen.setMessage(Bejeweled.message);

    this.cursor.setBackgroundColor();

    Screen.addCommand('up', 'moves the cursor up', this.cursor.up);
    Screen.addCommand('down', 'moves the cursor down', this.cursor.down);
    Screen.addCommand('left', 'moves the cursor to the left', this.cursor.left);
    Screen.addCommand('right', 'moves the cursor to the right', this.cursor.right);
    Screen.addCommand('return', 'selects the fruit where the cursor is positioned. Select two fruits to swap them', () => this.selectAndSwap(Screen.grid, {row: this.cursor.row, col: this.cursor.col}));
    Screen.render();
  }

  static insertFruits(grid, start = false) {
    const fruits = ["🥝", "🥭", "🥥", "🍋", "🍓", "🍇", "🍊"];

    const checkMatch = function(element, fruit) {
        if (!(grid[element.row - 2] && grid[element.row - 2][element.col] !== " " && grid[element.row - 2][element.col] === fruit && grid[element.row - 1][element.col] === fruit) && !(grid[element.row][element.col - 2] && grid[element.row][element.col - 2] !== " " && grid[element.row][element.col - 2] === fruit && grid[element.row][element.col - 1] === fruit)) {
          grid[element.row][element.col] = fruit;
        } else {
          let randomNum = Math.floor(Math.random() * fruits.length);
          fruit = fruits[randomNum];
          checkMatch(element, fruit);
        }
    }

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === " ") {
          let randomNum = Math.floor(Math.random() * fruits.length);
          let fruit = fruits[randomNum];
          if (start) {
            checkMatch({row, col}, fruit);
          } else {
            grid[row][col] = fruit;
          }
        }
      }
    }

    if (Bejeweled.checkForMatches(grid)) {
      Bejeweled.insertFruits(grid);
    }
  }

  static checkMatch = {
    func: function(grid) {
      let found = false;
      let fruit = " ";
      let count = 0;

      for (let row = 0; row < grid.length; row++) {
        count = 0;
        for (let col = 0; col < grid[row].length; col++) {
          if (grid[row][col] !== " " && grid[row][col] === fruit) {
            count++;
          } else if (found) {
            return cb();
          } else {
            fruit = grid[row][col];
            count = 1;
          }

          if (count === 3) {
            found = true;
            Bejeweled.checkMatch.matchCol = col;
            Bejeweled.checkMatch.matchRow = row;
          }
        }
      }

      fruit = " ";
      count = 0;

      for (let col = 0; col < grid[0].length; col++) {
        count = 0;
        for (let row = 0; row < grid.length; row++) {
          if (grid[row][col] !== " " && grid[row][col] === fruit) {
            count++;
          } else if (found) {
            return cb();
          } else {
            fruit = grid[row][col];
            count = 1;
          }

          if (count === 3) {
            found = true;
            Bejeweled.checkMatch.matchCol = col;
            Bejeweled.checkMatch.matchRow = row;
          }
        }
      }

      return false;
    }
  }

  static checkForMatches(grid) {

    // Fill this in

    // states indicating that a match was found and his location based on the third element
    let found = false;
    let matchCol;
    let matchRow;
    let count = 0;

    // horizontal checking
    for (let row = 0; row < grid.length; row++) {
      let fruit = " ";

      for (let col = 0; col < grid[row].length; col++) {
        if (fruit !== " " && grid[row][col] === fruit) {
          count++;
        } else if (found) {
          // combo of the current match, which is necessary to make the fruits fall
          let combo = count - 3;

          for (let i = matchRow; i >= 0; i--) {
            for (let j = matchCol + combo; j >= matchCol - 2; j--) {
              if (i === 0) {
                grid[i][j] = " ";
              } else {
                grid[i][j] = grid[i - 1][j];
              }
            }
          }

          if (combo > Bejeweled.combo) {
            // highest combo of the move's matches will be displayed
            Bejeweled.combo = combo;
          }

          let pointsEarnedMatch = 50 * (1 + combo);
          Bejeweled.pointsEarned += pointsEarnedMatch;
          Bejeweled.checkForMatches(grid);

          return true;
        } else {
          fruit = grid[row][col];
          count = 1;
        }

        if (count === 3) {
          found = true;
          matchCol = col;
          matchRow = row;
        }
      }
    }

    // vertical checking
    found = false;
    count = 0;

    for (let col = 0; col < grid[0].length; col++) {
      let fruit = " ";

      for (let row = 0; row < grid.length; row++) {
        if (fruit !== " " && grid[row][col] === fruit) {
          count++;
        } else if (found) {
          // combo of the current match, which is necessary to make the fruits fall
          let combo = count - 3;

          for (let i = matchRow + combo; i >= 0; i--) {
            if (i < count) {
              grid[i][matchCol] = " ";
            } else {
              grid[i][matchCol] = grid[i - count][matchCol];
            }
          }

          if (combo > Bejeweled.combo) {
            // highest combo of the move's matches will be displayed
            Bejeweled.combo = combo;
          }

          let pointsEarnedMatch = 50 * (1 + combo);
          Bejeweled.pointsEarned += pointsEarnedMatch;
          Bejeweled.checkForMatches(grid);

          return true;
        } else {
          fruit = grid[row][col];
          count = 1;
        }

        if (count === 3) {
          found = true;
          matchRow = row;
          matchCol = col;
        }
      }
    }

    return false;
  }

  static checkValidMoves(grid) {

    let newGrid = [];

    for (let i = 0; i < grid.length; i++) {
      newGrid.push(grid[i].slice());
    }

    for (let row = 0; row < newGrid.length - 1; row++) {
      for (let col = 0; col < newGrid[row].length - 1; col++) {
        Cursor.swapFruits(newGrid, {row, col}, {row: row + 1, col: col});

        if (checkMatch(newGrid)) {
          return true;
        }

        Cursor.swapFruits(newGrid, {row, col}, {row: row + 1, col: col});
        Cursor.swapFruits(newGrid, {row, col}, {row, col: col + 1});

        if (checkMatch(newGrid)) {
          return true;
        }

        Cursor.swapFruits(newGrid, {row, col}, {row, col: col + 1});
      }
    }

    return false;
  }

  selectAndSwap = (grid, fruit) => {
    this.cursor.selectFruit(grid, fruit);

    const resetBackgroundColor = function() {
      Screen.setBackgroundColor(this.cursor.selection[0].row, this.cursor.selection[0].col, this.cursor.gridColor);
      Screen.setBackgroundColor(this.cursor.selection[1].row, this.cursor.selection[1].col, this.cursor.gridColor);
      Screen.render();
    }

    const resetSelectionColor = resetBackgroundColor.bind(this);
    const swapFruits = Cursor.swapFruits.bind(this, grid, this.cursor.selection[0], this.cursor.selection[1]);

    if (this.cursor.selection.length === 2) {
      Screen.setBackgroundColor(this.cursor.selection[0].row, this.cursor.selection[0].col, 'red');
      Screen.setBackgroundColor(this.cursor.selection[0].row, this.cursor.selection[0].col, 'red');
      swapFruits();

      if (Bejeweled.checkForMatches(grid)) {
        setTimeout(() => {
          setTimeout(() => {
            resetSelectionColor();
            Bejeweled.insertFruits(grid);
            this.cursor.selection = [];
            Bejeweled.score += Bejeweled.pointsEarned;
            Screen.setMessage(`Score: ${Bejeweled.score}  (+${Bejeweled.pointsEarned})  x${Bejeweled.combo + 1} combo`);
            Bejeweled.pointsEarned = 0;
            Bejeweled.combo = 0;

            if (!Bejeweled.checkValidMoves(grid)) {
              Screen.render();
              Screen.quit();
            }

            Screen.render();
          }, 1000);
        }, 1000);
      } else {
        swapFruits();
        resetSelectionColor();
        this.cursor.selection = [];
      }
    }
  }
}

module.exports = Bejeweled;
