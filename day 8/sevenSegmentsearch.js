const fs = require('fs');
const path = require('path');

function getCommonSegmentCount(key, patternMap, patternToCheck) {
    let commonSegments = 0;
    for (segment of patternMap.get(key)) { patternToCheck.includes(segment) && commonSegments++; }
    return commonSegments;
}

function mapPatterns(signalPatterns) {
    const patternMap = new Map();
    const unknownPatterns = []
    for (pattern of signalPatterns) {
        switch (pattern.length) {
            case 2:
                patternMap.set(1, pattern);
                break;
            case 3:
                patternMap.set(7, pattern);
                break;
            case 4:
                patternMap.set(4, pattern);
                break;
            case 5:
                unknownPatterns.push(pattern)
                break;
            case 6: 
                unknownPatterns.push(pattern)
                break;
            case 7:
                patternMap.set(8, pattern);
                break;
            default:
                console.log('Pattern length outside expected range')
        }
    }

    for (pattern of unknownPatterns) {
       const commonWith1 = getCommonSegmentCount(1, patternMap, pattern);
       const commonWith4 = getCommonSegmentCount(4, patternMap, pattern);
       if (pattern.length === 6 && commonWith1 === 2 && commonWith4 === 3) { patternMap.set(0, pattern) }
       else if (pattern.length === 5 && commonWith1 === 1 && commonWith4 === 2) { patternMap.set(2, pattern) }
       else if (pattern.length === 5 && commonWith1 === 2 && commonWith4 === 3) { patternMap.set(3, pattern) }
       else if (pattern.length === 5 && commonWith1 === 1 && commonWith4 === 3) { patternMap.set(5, pattern) }
       else if (pattern.length === 6 && commonWith1 === 1 && commonWith4 === 3) { patternMap.set(6, pattern) }
       else if (pattern.length === 6 && commonWith1 === 2 && commonWith4 === 4) { patternMap.set(9, pattern) }
    }
    return patternMap;
}

function decodeOutput(patternMap, output) {
    const decodedOutput = new Map();
    for (pattern of patternMap) {
        for (outputPattern of output) {
            if (pattern[1].length === outputPattern.length) {
                let match = false;
                const segments = pattern[1].split('');
                for (segment of segments) {
                    if (outputPattern.includes(segment)) { match = true; }
                    else { 
                        match = false;
                        break;
                    }
                }
                match && decodedOutput.set(outputPattern, pattern[0]);
            }
        }
    }
    return decodedOutput;
}

function getMatchCount(entries, limitCount=true) {
    let matchCount = 0;
    for (entry of entries) { 
        const decodedOutput = decodeOutput(mapPatterns(entry.signalPatterns), entry.output);
        if (limitCount) {
            for (decodedPattern of decodedOutput) { 
                if (decodedPattern[1] !== 1 && decodedPattern[1] !== 4 && decodedPattern[1] !== 7 && decodedPattern[1] !== 8) {
                    decodedOutput.delete(decodedPattern[0]);
                }
            }
        }
        for (decodedPattern of decodedOutput) { entry.output.forEach(outputPattern => outputPattern === decodedPattern[0] && matchCount++) }
    }
    return matchCount;
}

function getDisplaySum(entries) {
    const displays = [];
    for (entry of entries) {
        const decodedOutput = decodeOutput(mapPatterns(entry.signalPatterns), entry.output);
        const display = [];
        entry.output.forEach(outputPattern => {
            display.push(decodedOutput.get(outputPattern))
        });
        displays.push(Number(display.join('')))
    }
    return displays.reduce((acc, display) => acc + display)
}

const entries = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n').map(entry => {
    const [ signalPatterns, output ] = entry.split(' | ');
    return { signalPatterns: signalPatterns.split(' '), output: output.split(' ') }
});

console.log('Part 1:', getMatchCount(entries));
console.log('Part 2:', getDisplaySum(entries));
