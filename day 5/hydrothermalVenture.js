const fs = require('fs');
const path = require('path');

function getLineCoords(lineSegments) {
    // Convert the 3D array into an array of objects to make for easier manipulation
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
    // Get the largest coordinate value to determine the size of the grid
    // needed to map all coordinates
    const coordValues = [];
    lineCoords.forEach(line => coordValues.push(Object.values(line)));
    return Math.max(...coordValues.flat());
}

function makeGrid(gridSize) {
    // Create a matrix that is size gridSize x gridSize
    // where each item is set to a . by default.
    const grid = [];
    for (let i = 0; i <= gridSize; i++) {
        const gridRow = [];
        for (let i = 0; i <= gridSize; i++) { gridRow.push('.') }
        grid.push(gridRow)
    }
    
    return grid;
}

function updateGrid(grid, coords) {
    // Given a coordinate pair and a grid,
    // either change the grid from its default value of . to a 1
    // or increment the number if it is no longer a default value
    const [ x, y ] = coords;

    if (grid[y][x] === '.') {
        grid[y][x] = 1;
    }
    else { grid[y][x]++ }
}

function* generateXValues(line) {
    // Generate the x values between x1 and x2 to be called when mapping the lines
    const xLength = line.x1 - line.x2;
    let x;

    for (let i = 0; i <= Math.abs(xLength); i++) {
        if (xLength < 0) { x = line.x1 + i; }
        else { x = line.x2 + i; }
        
        yield x;
    }
}

function* generateYValues(line) {
    // Generate the y values between y1 and y2 to be called when mapping the lines
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
            // If the x coordinates are the same then we only need to increment the y values
            // until the target is reached.
            let yGen = generateYValues(line);
            let y = yGen.next().value;
            while (y !== undefined) {
                updateGrid(grid, [line.x1, y]);
                y = yGen.next().value;
            }
        }
        else if (line.y1 === line.y2) {
            // If the y coordinates are the same then we only need to increment the x values
            // until the target is reached.
            let xGen = generateXValues(line);
            let x = xGen.next().value
            while (x !== undefined) {
                updateGrid(grid, [x, line.y1]);
                x = xGen.next().value;
            }
        }
        else {
            // Only part 2 wants to include mapping the diagonals that overlap so a flag is used
            if (includeDiagonals) {
                // Since the slope for the input coordinates are all equal to 1,
                // x1 - x2 === y1 - y2
                // so either can be used for the distance between points.
                let coordDif = Math.abs(line.x1 - line.x2);
                for (let i = 0; i <= coordDif; i++) {
                    // For a number of times equal to the distance between the points,
                    // each value will either need to be incremented or decremented depending on
                    // if the other coordinate is greater than or less than it.
                    let x;
                    let y;
                    // I chose to start with the coordinate pair which has the lowest x value.
                    if (line.x1 < line.x2) {
                        x = line.x1 + i;
                        // Check if the cooresponding y value is less than or greater than the other y value
                        // and add or subtract accordingly.
                        if (line.y1 < line.y2) { y = line.y1 + i; }
                        else { y = line.y1 - i; }
                    }
                    else {
                        x = line.x2 + i;
                        if (line.y2 < line.y1) { y = line.y2 + i; }
                        else { y = line.y2 - i; }
                    }
                    // Update the grid with the new x and y values that represent the next point closest to the target.
                    updateGrid(grid, [x, y])
                }
            }
        }
    }
}

function countOverlaps(grid) {
    // Count the number of points in which more than 1 line intersect.
    let count = 0;
    for (row of grid) {
        for (num of row) {
            num > 1 && count++;
        }
    }
    return count;
}

function displayGrid(grid) {
    // Print out the matrix as a string
    for (row of grid) {
        console.log(row.join(''))
    }
}

const report = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n');
// Create a 3d array:
//      Each (x, y) pair are put into an array to represent a point.
//      Each set of coordinate pairs are put into an array to represent the starting and ending points of the line segments.
//      Each of these sets for mapping a line segment are put into an array.
const lineSegments = report.map(reportLine => reportLine.split(' -> ').map(coords => coords.split(',').map(coord => Number(coord))));

const lineCoords = getLineCoords(lineSegments);
const gridSize = getGridSize(lineCoords);

let grid = makeGrid(gridSize);
mapLinesToGrid(grid, lineCoords, false);
// displayGrid(grid) <--- Warning the grid is massive
console.log('Part 1:', countOverlaps(grid));

grid = makeGrid(gridSize);
mapLinesToGrid(grid, lineCoords, true);
// displayGrid(grid) <--- Warning the grid is massive
console.log('Part 2:', countOverlaps(grid));
