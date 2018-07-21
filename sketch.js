var resolution = 20;
var gridArray;
var numOfObjects = 0;
var gridXSize;
var gridYSize;


function setup() {
    // put setup code here
    createCanvas(800, 400);
    background(100);
    gridXSize = width / resolution;
    gridYSize = height / resolution;

    createGrid();
}

function draw() {

}

function createGrid() {
    gridArray = [];
    for (i = 0; i < gridXSize; i++) {
        gridArray[i] = [];
        for (j = 0; j < gridYSize; j++) {
            fillGrid(i, j);
        }
    }
    console.log(numOfObjects);
}

function fillGrid(x, y) {
    rect((x * resolution), (y * resolution), resolution, resolution);
    var indicator;
    var rand = floor(random(0, 2));
    if (rand == 1) {
        fill("black");
        indicator = 1;
    } else {
        fill("white");
        indicator = 0;
    }
    gridArray[x][y] = new GridContent(indicator);
    numOfObjects++;
    return;
}

class GridContent {
    constructor(ind) {
        this.ind = ind;
    }
}

//Based on mouse-press event
function mousePressed() {
    //If the user is inside canvas  
    if (mouseX < width && mouseY < height) {
        console.log("Inside canvas area");
        var mouseClickX=mouseX-(mouseX%20);
        var mouseClickY=mouseY-(mouseY%20);
        rect(mouseClickX, mouseClickY, resolution, resolution);
        fill("red");
        console.log(mouseX, mouseY);
        console.log(mouseClickX, mouseClickY);
    }else {
    //If user is outside canvas  
        console.log("Please click inside the canvas area");
    }
}