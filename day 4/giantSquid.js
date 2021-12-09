const fs = require('fs');
const path = require('path');

function* getBingoData() {
    // Yield each line from the input
    const data = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n');
    for (const line of data) { yield line; }
}

function generateBingoBoards(bingoData) {
    const bingoBoards = [];
    let bingoBoard = [[]],
        colIndex = 0,
        line = bingoData.next().value;

    if (line === '') { line = bingoData.next().value; }
    while (line !== undefined) {
        if (line === '') {
            bingoBoards.push(bingoBoard);
            bingoBoard = [[]];
            colIndex = 0;
        }
        else if (!line.includes(',')) {
            let row = line.split(/\s+/).filter(str => str !== '');
            for (i in row) { bingoBoard[colIndex].push({value: Number(row[i]), marked: false}); }
            colIndex++;
            bingoBoard.length < row.length && bingoBoard.push([]);
        }
        line = bingoData.next().value;
    }
    
    bingoBoards.push(bingoBoard);
    return bingoBoards;
}

function markMatches(num, bingoBoards) {
    for (board of bingoBoards) { 
        for (row of board) {
            for (boardNum of row) {
                if (num === boardNum.value) { boardNum.marked = true; }
            }
        }
    }
}

function checkForBingo(board) {
    for (row of board) {
        // For each row check if the count of marked numbers is equal to the length of the row.
        let markedRowNums = 0;
        for (num of row) {
            num.marked && markedRowNums++;
            // If any row has all of its numbers marked then it has won.
            if (markedRowNums === row.length) { return board; };
        }
    }

    for (let i = 0; i < 5; i++) {
        // For each column check if the count of marked numbers is equal to the length of a row.
        // This assumes the length of a row is equal to the length of a column.
        let markedColNums = 0;
        for (row of board) { 
            // Only check the position of i on each row, limiting it to the numbers
            // for the current column.
            row[i].marked && markedColNums++;
            // If any column has all of its numbers marked then it has won.
            if (markedColNums === row.length) { return board; }
        }
    }
    // Return false if no board has won.
    return false;
}

function getScore(lastNum, board) {
    // The score is the last number called before the board won multiplied by the sum
    // of unmarked numbers on the board.
    const unmarkedSum = board.flat().reduce((acc, num) => !num.marked ? acc + num.value : acc, 0);
    return lastNum * unmarkedSum;
}

const bingoData = getBingoData();
// The first line from the input contain the random numbers to mark on the boards.
const bingoNumbers = bingoData.next().value.split(',').map(str => Number(str));
// Get an array of bingo boards.
const bingoBoards = generateBingoBoards(bingoData);

let winnerCount = 0;
let lastWinningBoard = [];
let lastWinningNum = 0;
for (bingoNum of bingoNumbers) {
    // Since each board is deleted from the bingoBoards array once it has won,
    // we want to stop checking numbers early if all boards have been removed.
    if (bingoBoards.length === 0) { break; }
    markMatches(bingoNum, bingoBoards);
    for (board of bingoBoards) {
        // Check each board for bingo.
        const winningBoard = checkForBingo(board);
        if (winningBoard) {
            // If a winning board is found, delete it from the array of boards to check and
            // update the lastWinningBoard with it since part 2 wants the score of the last
            // board to win.
            lastWinningBoard = bingoBoards.splice(bingoBoards.indexOf(winningBoard), 1);
            // Keep track of the last number called so that it can be used in calculating the score.
            lastWinningNum = bingoNum;
            // Part 1 wants to know the score of the first winner.
            winnerCount++;
            winnerCount === 1 && console.log('Part 1:', getScore(lastWinningNum, lastWinningBoard[0]));
        }
    }
}

console.log('Part 2:', getScore(lastWinningNum, lastWinningBoard[0]));
