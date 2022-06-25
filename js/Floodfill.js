import Queue from './Queue.js'

const DEFAULT_WIDTH = 64
const DEFAULT_HEIGHT = 64
// let count = 0
// let blocksAnimated = []
// let fillColor

export default class Floodfill {
    constructor() {
        this.map = new Array(64).fill(0).map(() => new Array(64).fill(0))
        this.blocksAnimated = []
        this.fillColor
        this.count = 0
    }
    
    performAnimation() {
        if (this.count < this.blocksAnimated.length) this.blocksAnimated[this.count].block.style.backgroundColor = this.fillColor;
        this.count++
    
        if (this.count < this.blocksAnimated.length) requestAnimationFrame(this.performAnimation.bind(this));
    }
    
    fillBFS(start, col, blocks) {
        this.fillColor = col
        let blockNum = 0 
        let startX
        let startY
        // fill 2-d array
        for (let y = 0; y < DEFAULT_HEIGHT; y++) {
            for (let x = 0; x < DEFAULT_WIDTH; x++) {
                if (blocks[blockNum].classList.contains('start')) {
                    startX = x
                    startY = y
                }
                this.map[x][y] = {
                    block: blocks[blockNum], 
                    xcoord: x,
                    ycoord: y,
                }
                blockNum++
            }
        }
        
        let visited = []
        const q = new Queue()
        q.enqueue(this.map[startX][startY])
        
        while (!q.isEmpty()) {
            const curr = q.dequeue()
            if (!visited.includes(curr) && !curr.block.classList.contains('edge')) {
                //store the set block in array to animate later
                this.blocksAnimated.push(curr)
                visited.push(curr)
                if (curr.xcoord+1 < DEFAULT_WIDTH) q.enqueue(this.map[curr.xcoord+1][curr.ycoord])
                if (curr.xcoord-1 >= 0) q.enqueue(this.map[curr.xcoord-1][curr.ycoord])
                if (curr.ycoord+1 < DEFAULT_HEIGHT) q.enqueue(this.map[curr.xcoord][curr.ycoord+1])
                if (curr.ycoord-1 >= 0) q.enqueue(this.map[curr.xcoord][curr.ycoord-1])
            }
        }
        this.performAnimation()
    }
}