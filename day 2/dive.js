const fs = require('fs');
const path = require('path');

function* getInstructions() {
    // Parse each line from the input as an array element.
    const instructions = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n');
    for (const instruction of instructions) {
        // Yield each element from the parsed input.
        yield instruction;
    }
}

function followInstructions1() {
    // Carry out instructions from part 1.
    const instructions = getInstructions()
    // Get the first line from the instructions.
    let instruction = instructions.next().value
    let horizontalPos = 0;
    let depth = 0;
    
    // Loop until there are no further instructions.
    while (instruction !== undefined) {
        // Pull the direction and distance from the instruction element.
        const [ direction, distance ] = instruction.split(' ');
        switch (direction) {
            case 'forward':
                // HorizontalPos increases when moving forward by the distance.
                horizontalPos += Number(distance);
                break;
            case 'up':
                // Depth decreases when moving up by the distance.
                depth -= Number(distance);
                break;
            case 'down':
                // Depth increases when moving down by the distance.
                depth += Number(distance);
                break;
        }
        // Get the next instruction.
        instruction = instructions.next().value
    }
    // Return the final horizontalPos and depth.
    return [horizontalPos, depth]
}

function followInstructions2() {
    // Carry out instructions from part 2.
    const instructions = getInstructions()
    let instruction = instructions.next().value
    let horizontalPos = 0;
    let depth = 0;
    // Aim is a new value to track that is used for determining the depth.
    let aim = 0;
    
    while (instruction !== undefined) {
        const [ direction, distance ] = instruction.split(' ');
        switch (direction) {
            case 'forward':
                // When moving forward depth will increase by the aim multiplied by the distance.
                horizontalPos += Number(distance);
                depth += (aim * Number(distance));
                break;
            case 'up':
                // When moving up the aim decreases by the distance.
                aim -= Number(distance);
                break;
            case 'down':
                // When moving down the aim increases by the distance.
                aim += Number(distance);
                break;
        }
        instruction = instructions.next().value
    }
    return [horizontalPos, depth]
}

const [ horizontalPos, depth ] = followInstructions1();
console.log("Part 1:", horizontalPos * depth);

const [ horizontalPos2, depth2 ] = followInstructions2();
console.log("Part 2:", horizontalPos2 * depth2);
