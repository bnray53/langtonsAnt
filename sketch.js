var resolution = 20;
var gridArray;
var numOfObjects = 0;
var gridXSize;
var gridYSize;
var antPlacedFlag=false;
var ant;


function setup() {
    // put setup code here
    createCanvas(800, 400);
    background(100);
    gridXSize = width / resolution;
    gridYSize = height / resolution;

    createGrid();
}

function draw() {
    //Put ant movement here if enough ants have been placed
    if(antPlacedFlag){
    
    }
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
    var fx=x;
    var fy=y;
    //Had to place fill above rect in the if statements to fix off by one
    //error in the first row.
    var indicator;
    var rand = floor(random(0, 2));
    if (rand == 1) {
        fill("black");
        rect((fx * resolution), (fy * resolution), resolution, resolution);
        indicator = "black";
        gridArray[fx][fy] = new GridContent(indicator);
    } else {
        fill("white");
        rect((fx * resolution), (fy * resolution), resolution, resolution);
        indicator = "white";
        gridArray[fx][fy] = new GridContent(indicator);
    }
    
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
        if(!antPlacedFlag){
            console.log("Inside canvas area");
            var mouseClickX=mouseX-(mouseX%resolution);
            var mouseClickY=mouseY-(mouseY%resolution);
            //this rect should be associated with ant objects so we can move it
            //fill("red");
           // rect(mouseClickX, mouseClickY, resolution, resolution);
            //Call constructor with pixel x and y using mouseClickX and mouseClickY
            //and then when needed get the grid coordinates from Ant class functions
            ant=new Ant(mouseClickX, mouseClickY);
            ant.drawSquare(mouseClickX, mouseClickY);
            console.log(mouseX, mouseY);
            console.log(mouseClickX, mouseClickY);
            console.log("Ant object: "+ ant.x, ant.y);
                var tempx=ant.getGridX();
                var tempy=ant.getGridY();
                console.log(tempx, tempy);
            console.log(mouseClickX/resolution, mouseClickY/resolution);
            console.log(gridArray[(mouseClickX/resolution)][((mouseClickY)/resolution)].ind);
            antPlacedFlag=true;
        }    
    }else {
    //If user is outside canvas  
        console.log("Please click inside the canvas area");
    }
}

function myFunction(){
    console.log("inside myFunction");
}

class Ant{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    //getGridY
    getGridX(){
        var gridX=this.x/resolution;
        return gridX;
    }
    //getGridX
    getGridY(){
        var gridY=this.y/resolution;
        return gridY;
    }
    //drawSquare/change posistion send pixels not grid points
    drawSquare(x,y){
        fill("red");
        rect(x,y,resolution,resolution);
    }


}