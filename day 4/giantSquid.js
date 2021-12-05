const fs = require('fs');
const path = require('path');

function* getBingoData() {
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
        let markedRowNums = 0;
        for (num of row) {
            num.marked && markedRowNums++;
            if (markedRowNums === row.length) { return board; };
        }
    }

    for (let i = 0; i < 5; i++) {
        let markedColNums = 0;
        for (row of board) { 
            row[i].marked && markedColNums++;
            if (markedColNums === row.length) { return board; }
        }
    }
    return false;
}

function getScore(lastNum, board) {
    const unmarkedSum = board.flat().reduce((acc, num) => !num.marked ? acc + num.value : acc, 0);
    return lastNum * unmarkedSum;
}

const bingoData = getBingoData();
const bingoNumbers = bingoData.next().value.split(',').map(str => Number(str));
const bingoBoards = generateBingoBoards(bingoData);

let winnerCount = 0;
let lastWinningBoard = [];
let lastWinningNum = 0;
for (bingoNum of bingoNumbers) {
    if (bingoBoards.length === 0) { break; }
    markMatches(bingoNum, bingoBoards);
    for (board of bingoBoards) {
        const winningBoard = checkForBingo(board);
        if (winningBoard) {
            lastWinningBoard = bingoBoards.splice(bingoBoards.indexOf(winningBoard), 1);
            lastWinningNum = bingoNum;
            winnerCount++;
            winnerCount === 1 && console.log('Part 1:', getScore(lastWinningNum, lastWinningBoard[0]));
        }
    }
}
console.log('Part 2:', getScore(lastWinningNum, lastWinningBoard[0]));
