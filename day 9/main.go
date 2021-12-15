package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"sort"
	"strings"
)

func main() {
	input := strings.Fields(getInput("./input.txt"))

	hm := newHeightMap(input)
	fmt.Println("Part One:", calcRisk(hm.getLowPoints()))

	basinSizes := hm.getBasinSizes()
	sort.Ints(basinSizes)
	product := basinSizes[len(basinSizes)-1] * basinSizes[len(basinSizes)-2] * basinSizes[len(basinSizes)-3]
	fmt.Println("Part Two:", product)
}

func getInput(path string) string {
	// return a string of the file contents from a given path
	file, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println("Error reading file:", err)
		os.Exit(1)
	}

	return string(file)
}
