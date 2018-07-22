var resolution = 20;
var gridArray;
var numOfObjects = 0;
var gridXSize;
var gridYSize;
var antPlacedFlag=false;
var ant;




function setup() {
    // put setup code here
    createCanvas(1200, 460);
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
    var fx=x;
    var fy=y;
    //Had to place fill above rect in the if statements to fix off by one
    //error in the first row.
    var indicator;
    fill("white");
    rect((fx * resolution), (fy * resolution), resolution, resolution);
    indicator = 1;
    gridArray[fx][fy] = new GridContent(indicator);
    //below gives black and white squares
    /*var rand = floor(random(0, 2));
    if (rand == 1) {
        fill("black");
        rect((fx * resolution), (fy * resolution), resolution, resolution);
        indicator = 0;
        gridArray[fx][fy] = new GridContent(indicator);
    } else {
        fill("white");
        rect((fx * resolution), (fy * resolution), resolution, resolution);
        indicator = 1;
        gridArray[fx][fy] = new GridContent(indicator);
    }*/


    
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
            //Call constructor with pixel x and y using mouseClickX and mouseClickY
            //and then when needed get the grid coordinates from Ant class functions
            //default square facing north
            ant=new Ant(mouseClickX, mouseClickY);
            ant.drawSquareNorth(ant.x, ant.y);
            console.log(mouseX, mouseY);
            console.log(mouseClickX, mouseClickY);
            console.log("Ant object: "+ ant.x, ant.y, ant.direction);
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
    if(antPlacedFlag){
            //ant logic
            if(ant.direction==0){
                if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==0){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    }
                    refillGrid();
                    ant.x=ant.x+20;
                    ant.drawSquareEast(ant.x,ant.y);
                }else{
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==0){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    }
                    refillGrid();
                    ant.x=ant.x-20;
                    ant.drawSquareWest(ant.x,ant.y);
                }
            }
            else if(ant.direction==90){
                if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==0){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    }
                    refillGrid();
                    ant.y=ant.y+20;
                    ant.drawSquareSouth(ant.x,ant.y);
                }else{
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==0){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    }
                    refillGrid();
                    ant.y=ant.y-20;
                    ant.drawSquareNorth(ant.x,ant.y);
                }
            }
            else if(ant.direction==180){
                if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==0){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    }
                    refillGrid();
                    ant.x=ant.x-20;
                    ant.drawSquareWest(ant.x,ant.y);
                }else{
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==0){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    }
                    refillGrid();
                    ant.x=ant.x+20;
                    ant.drawSquareEast(ant.x,ant.y);
                }
            }
            else if(ant.direction==270){
                if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==0){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    }
                    refillGrid();
                    ant.y=ant.y-20;
                    ant.drawSquareNorth(ant.x,ant.y);
                }else{
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==0){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    }
                    refillGrid();
                    ant.y=ant.y+20;
                    ant.drawSquareSouth(ant.x,ant.y); 
                }
            }else{
                console.log("Error in ant brain");
            }
            setTimeout(myFunction, 250);   
    }          
}

class Ant{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.direction=0;
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

    //draw square with north arrow
    drawSquareNorth(x,y){
        fill("red");
        rect(x,y,resolution,resolution);
        line(x+10, y+18, x+10, y+2);
        line(x+2, y+10, x+10, y+2);
        line(x+10, y+2, x+18, y+10); 
        this.direction=0;   
    }
    //draw square with south arrow
    drawSquareSouth(x,y){
        fill("red");
        rect(x,y,resolution,resolution);
        line(x+10, y+18, x+10, y+2);
        line(x+2, y+10, x+10, y+18);
        line(x+10, y+18, x+18, y+10); 
        this.direction=180;   
    }
    //draw square with east arrow
    drawSquareEast(x,y){
        fill("red");
        rect(x,y,resolution,resolution);
        line(x+2, y+10, x+18, y+10);
        line(x+18, y+10, x+10, y+18);
        line(x+10, y+2, x+18, y+10);
        this.direction=90;    
    }
    //draw square with west arrow
    drawSquareWest(x,y){
        fill("red");
        rect(x,y,resolution,resolution);
        line(x+2, y+10, x+18, y+10);
        line(x+2, y+10, x+10, y+2);
        line(x+10, y+18, x+2, y+10); 
        this.direction=270;   
    }
}

function refillGrid(){
    for (i = 0; i < gridXSize; i++) {
        for (j = 0; j < gridYSize; j++) {
            if (gridArray[i][j].ind == 1) {
                fill("white");
                rect(i*resolution, j*resolution, resolution, resolution);
            } else {
                fill("black");
                rect(i*resolution, j*resolution, resolution, resolution);
            }
        }
    }    
}