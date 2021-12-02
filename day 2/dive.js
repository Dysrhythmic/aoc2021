const fs = require('fs');
const path = require('path');

function* getInstructions() {
    const instructions = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n');
    for (const instruction of instructions) {
        yield instruction;
    }
}

function followInstructions1() {
    const instructions = getInstructions()
    let instruction = instructions.next().value
    let horizontalPos = 0;
    let depth = 0;
    
    while (instruction !== undefined) {
        const [ direction, distance ] = instruction.split(' ');
        switch (direction) {
            case 'forward':
                horizontalPos += Number(distance);
                break;
            case 'up':
                depth -= Number(distance);
                break;
            case 'down':
                depth += Number(distance);
                break;
        }
        instruction = instructions.next().value
    }

    return [horizontalPos, depth]
}

function followInstructions2() {
    const instructions = getInstructions()
    let instruction = instructions.next().value
    let horizontalPos = 0;
    let depth = 0;
    let aim = 0;
    
    while (instruction !== undefined) {
        const [ direction, distance ] = instruction.split(' ');
        switch (direction) {
            case 'forward':
                horizontalPos += Number(distance);
                depth += (aim * Number(distance));
                break;
            case 'up':
                aim -= Number(distance);
                break;
            case 'down':
                aim += Number(distance);
                break;
        }
        instruction = instructions.next().value
    }

    return [horizontalPos, depth]
}

const [ horizontalPos, depth ] = followInstructions1();
console.log("Part 1: ", horizontalPos * depth);

const [ horizontalPos2, depth2 ] = followInstructions2();
console.log("Part 2: ", horizontalPos2 * depth2);
