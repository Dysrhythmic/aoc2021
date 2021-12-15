package main

import (
	"fmt"
	"os"
	"strconv"
)

type heightMap [][]point

type point struct {
	value     int
	coords    []int
	inBasin   bool
	neighbors []*point
}

func newHeightMap(input []string) heightMap {
	heightMap := [][]point{}

	// create points from the input and put them in the heightMap
	for i, line := range input {
		row := []point{}

		for j, char := range line {
			if n, err := strconv.Atoi(string(char)); err == nil {
				p := point{
					value:     n,
					coords:    []int{i, j},
					inBasin:   false,
					neighbors: []*point{},
				}
				row = append(row, p)
			} else {
				fmt.Println("Error converting characters:", err)
				os.Exit(1)
			}
		}

		heightMap = append(heightMap, row)
	}

	// for each point, update its "neighbors" property with pointers to adjacent points
	for i, row := range heightMap {
		for j := range row {
			if i > 0 {
				row[j].neighbors = append(row[j].neighbors, &heightMap[i-1][j])
			}
			if i < len(heightMap)-1 {
				row[j].neighbors = append(row[j].neighbors, &heightMap[i+1][j])
			}
			if j > 0 {
				row[j].neighbors = append(row[j].neighbors, &heightMap[i][j-1])
			}
			if j < len(row)-1 {
				row[j].neighbors = append(row[j].neighbors, &heightMap[i][j+1])
			}
		}
	}

	return heightMap
}

func (hm heightMap) getLowPoints() []point {
	lowPoints := []point{}

	for _, row := range hm {
		for _, point := range row {
			isLowPoint := false

			// 9 is the greatest height value possible
			// so it is impossible for it to be a lowpoint
			// we can skip these
			if point.value == 9 {
				continue
			}

			// if it isn't lower than any of its neighbors we break early
			for _, neighbor := range point.neighbors {
				if isLowPoint = point.value < (*neighbor).value; !isLowPoint {
					break
				}
			}

			if isLowPoint {
				lowPoints = append(lowPoints, point)
			}
		}
	}

	return lowPoints
}

func calcRisk(points []point) int {
	risk := 0

	for _, point := range points {
		risk += point.value + 1
	}

	return risk
}

func (hm heightMap) getBasinSizes() []int {
	// start with each low point and map out its basin
	lowPoints := hm.getLowPoints()
	basinSizes := []int{}

	for _, p := range lowPoints {
		basinSize := len(hm.mapBasin(p))
		basinSizes = append(basinSizes, basinSize)
	}

	return basinSizes
}

func (hm heightMap) mapBasin(p point) []point {
	basin := []point{}
	queue := []point{p}

	// as long as there are points to check in the queue
	// pop a point off the front of the queue to check
	for len(queue) > 0 {
		p := queue[0]
		queue = queue[1:]

		// must use the coordinates to access the points current state in the heightMap
		// instead of check the inBasin property of the copy (p) which can become out of sync
		if p.value < 9 && !hm[p.coords[0]][p.coords[1]].inBasin {
			// update the point in the heightMap instead of the copy (p)
			hm[p.coords[0]][p.coords[1]].inBasin = true
			basin = append(basin, p)

			// add its neighbors to the queue to be checked next
			for _, neighbor := range p.neighbors {
				queue = append(queue, *neighbor)
			}

		}
	}

	return basin
}
