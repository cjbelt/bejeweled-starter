const { expect } = require('chai');
const chai = require('chai');

const Cursor = require("../class/cursor.js");
const Screen = require("../class/screen.js");

describe ('Cursor', function () {

  let cursor;

  beforeEach(function() {
    cursor = new Cursor(3, 3);
  });


  it('initializes for a 3x3 grid', function () {
    expect(cursor.row).to.equal(0);
    expect(cursor.col).to.equal(0);
  });

  it('correctly processes down inputs', function () {

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([1, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 0]);
  });

  it('correctly processes up inputs', function () {

    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([1, 0]);

    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);
  });

  it('processes right inputs', function () {

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 1]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 2]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 2]);
  });

  it('processes left inputs', function () {

    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 1]);

    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);
  });

  describe('swapFruits(grid, fruit1, fruit2)', () => {
    context('if the two fruits are adjacents', () => {
      it('should swap fruits positions', () => {
        grid =
        [[" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", "🥭", "🥭", "🥥", "🥭", " ", " "]];

        let fruit1 = {row: 7, col: 5};
        let fruit2 = {row: 7, col: 4};

        Cursor.swapFruits(grid, fruit1, fruit2);

        expect(grid[7][5]).to.equal("🥥");
        expect(grid[7][4]).to.equal("🥭");

        grid =
        [[" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", "🍓", " ", " ", " ", " ", " ", " "],
        [" ", "🫐", " ", " ", " ", " ", " ", " "],
        [" ", "🍓", " ", " ", " ", " ", " ", " "],
        [" ", "🍓", " ", " ", " ", " ", " ", " "]];

        fruit1 = {row: 5, col: 1};
        fruit2 = {row: 4, col: 1};

        Cursor.swapFruits(grid, fruit1, fruit2);

        expect(grid[5][1]).to.equal("🍓");
        expect(grid[4][1]).to.equal("🫐");
      });
    });

    context('if the two fruits are not adjacent', () => {
      it('should does not swap the fruits', () => {
        grid =
        [[" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", "🫐", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", "🍓", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " ", " "]];

        let fruit1 = {row: 1, col: 1};
        let fruit2 = {row: 2, col: 4};

        Cursor.swapFruits(grid, fruit1, fruit2);

        expect(grid[fruit1.row][fruit1.col]).to.equal("🫐");
        expect(grid[fruit2.row][fruit2.col]).to.equal("🍓");
      });
    });
  })

  describe('selectFruit(grid, selection, fruit)', () => {
    it ('should select a fruit from the grid, pushing it to a selection array', () => {
      grid = [[" ", " ", " ", " ", " ", " ", "🥝", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "]];

      cursor.selection = [];
      cursor.selectFruit(grid, {row: 0, col: 6});
      expect(cursor.selection).to.deep.equal([{row: 0, col: 6}]);
    });

    // context('if two fruits are selected', () => {
    //   it('should call swapFruits method', () => {
    //     grid = [[" ", " ", " ", " ", " ", " ", " ", " "],
    //     [" ", " ", " ", " ", " ", " ", " ", " "],
    //     [" ", " ", " ", " ", " ", " ", " ", " "],
    //     [" ", " ", " ", " ", " ", " ", " ", " "],
    //     [" ", " ", " ", " ", " ", " ", " ", " "],
    //     [" ", " ", " ", " ", " ", " ", " ", " "],
    //     [" ", " ", " ", " ", " ", " ", " ", " "],
    //     [" ", " ", " ", "🍊", "🍊", "🥝", "🍊", " "]];

    //     let fruit1 = {row: 7, col: 6};
    //     let fruit2 = {row: 7, col: 5};

    //     cursor.selection = [fruit1];
    //     let spySwap = chai.spy.on(Cursor, 'swapFruits');
    //     cursor.selectFruit(grid, fruit2);
    //     expect(spySwap).to.have.been.called;
    //     expect(grid[fruit1.row][fruit1.col]).to.equal("🥝");
    //   });
    // });
  });
});
