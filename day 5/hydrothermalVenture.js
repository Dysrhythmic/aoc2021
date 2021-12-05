const fs = require('fs');
const path = require('path');

function getLineCoords(lineSegments) {
    const lineCoords = [];
    for (lineSegment of lineSegments) {
        lineCoords.push({
            x1: lineSegment[0][0],
            y1: lineSegment[0][1],
            x2: lineSegment[1][0],
            y2: lineSegment[1][1]
        });
    }
    return lineCoords;
}

function getGridSize(lineCoords) {
    const coordValues = [];
    lineCoords.forEach(line => coordValues.push(Object.values(line)));
    return Math.max(...coordValues.flat());
}

function makeGrid(gridSize) {
    const grid = [];
    for (let i = 0; i <= gridSize; i++) {
        const gridRow = [];
        for (let i = 0; i <= gridSize; i++) { gridRow.push('.') }
        grid.push(gridRow)
    }
    
    return grid;
}

function updateGrid(grid, coords) {
    const [ x, y ] = coords;

    if (grid[y][x] === '.') {
        grid[y][x] = 1;
    }
    else { grid[y][x]++ }
}

function* generateXValues(line) {
    const xLength = line.x1 - line.x2;
    let x;

    for (let i = 0; i <= Math.abs(xLength); i++) {
        if (xLength < 0) { x = line.x1 + i; }
        else { x = line.x2 + i; }
        
        yield x;
    }
}

function* generateYValues(line) {
    const yLength = line.y1 - line.y2;
    let y;

    for (let i = 0; i <= Math.abs(yLength); i++) {
        if (yLength < 0) { y = line.y1 + i; }
        else { y = line.y2 + i; }

        yield y;
    }
}

function mapLinesToGrid(grid, lineCoords, includeDiagonals) {
    for (line of lineCoords) {
        if (line.x1 === line.x2) {
            let yGen = generateYValues(line);
            let y = yGen.next().value;
            while (y !== undefined) {
                updateGrid(grid, [line.x1, y]);
                y = yGen.next().value;
            }
        }
        else if (line.y1 === line.y2) {
            let xGen = generateXValues(line);
            let x = xGen.next().value
            while (x !== undefined) {
                updateGrid(grid, [x, line.y1]);
                x = xGen.next().value;
            }
        }
        else {
            if (includeDiagonals) {
                let coordDif = Math.abs(line.x1 - line.x2);
                for (let i = 0; i <= coordDif; i++) {
                    let x;
                    let y;
    
                    if (line.x1 < line.x2) {
                        x = line.x1 + i;
                        if (line.y1 < line.y2) { y = line.y1 + i; }
                        else { y = line.y1 - i; }
                    }
                    else {
                        x = line.x2 + i;
                        if (line.y2 < line.y1) { y = line.y2 + i; }
                        else { y = line.y2 - i; }
                    }
        
                    updateGrid(grid, [x, y])
                }
            }
        }
    }
}

function countOverlaps(grid) {
    let count = 0;
    for (row of grid) {
        for (num of row) {
            num > 1 && count++;
        }
    }
    return count;
}

function displayGrid(grid) {
    for (row of grid) {
        console.log(row.join(''))
    }
}

const report = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n');
const lineSegments = report.map(reportLine => reportLine.split(' -> ').map(coords => coords.split(',').map(coord => Number(coord))));

const lineCoords = getLineCoords(lineSegments);
const gridSize = getGridSize(lineCoords);

let grid = makeGrid(gridSize);
mapLinesToGrid(grid, lineCoords, false);
// displayGrid(grid)
console.log('Part 1:', countOverlaps(grid));

grid = makeGrid(gridSize);
mapLinesToGrid(grid, lineCoords, true);
// displayGrid(grid)
console.log('Part 2:', countOverlaps(grid));
