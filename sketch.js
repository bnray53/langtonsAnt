var resolution = 8;
var gridArray;
var numOfCycles = 0;
var gridXSize;
var gridYSize;
var antPlacedFlag=false;
var ant;

class GridContent {
    constructor(ind) {
        this.ind = ind;
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
        line(x+(resolution*.5), y+(resolution*.9), x+(resolution*.5), y+(resolution*.1));
        line(x+(resolution*.1), y+(resolution*.5), x+(resolution*.5), y+(resolution*.1));
        line(x+(resolution*.5), y+(resolution*.1), x+(resolution*.9), y+(resolution*.5)); 
        this.direction=0;   
    }
    //draw square with south arrow
    drawSquareSouth(x,y){
        fill("red");
        rect(x,y,resolution,resolution);
        line(x+(resolution*.5), y+(resolution*.9), x+(resolution*.5), y+(resolution*.1));
        line(x+(resolution*.1), y+(resolution*.5), x+(resolution*.5), y+(resolution*.9));
        line(x+(resolution*.5), y+(resolution*.9), x+(resolution*.9), y+(resolution*.5)); 
        this.direction=180;   
    }
    //draw square with east arrow
    drawSquareEast(x,y){
        fill("red");
        rect(x,y,resolution,resolution);
        line(x+(resolution*.1), y+(resolution*.5), x+(resolution*.9), y+(resolution*.5));
        line(x+(resolution*.9), y+(resolution*.5), x+(resolution*.5), y+(resolution*.9));
        line(x+(resolution*.5), y+(resolution*.1), x+(resolution*.9), y+(resolution*.5));
        this.direction=90;    
    }
    //draw square with west arrow
    drawSquareWest(x,y){
        fill("red");
        rect(x,y,resolution,resolution);
        line(x+(resolution*.1), y+(resolution*.5), x+(resolution*.9), y+(resolution*.5));
        line(x+(resolution*.1), y+(resolution*.5), x+(resolution*.5), y+(resolution*.1));
        line(x+(resolution*.5), y+(resolution*.9), x+(resolution*.1), y+(resolution*.5)); 
        this.direction=270;   
    }
}


function setup() {
    // put setup code here
    var myCanvas = createCanvas(1200, 450);
    myCanvas.parent("myContainer");
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
}

function fillGrid(x, y) {
    var fx=x;
    var fy=y;
    var indicator;
    fill("white");
    rect((fx * resolution), (fy * resolution), resolution, resolution);
    indicator = 1;
    gridArray[fx][fy] = new GridContent(indicator);
    //below gives black and white squares, keep for future reference
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
    return;
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
                    gridArray[ant.getGridX()][ant.getGridY()].ind=0;                    
                    refillGrid();
                    ant.x=ant.x+resolution;
                    ant.drawSquareEast(ant.x,ant.y);
                }else{
                    gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    refillGrid();
                    ant.x=ant.x-resolution;
                    ant.drawSquareWest(ant.x,ant.y);
                }
            }
            else if(ant.direction==90){
                if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                    gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    refillGrid();
                    ant.y=ant.y+resolution;
                    ant.drawSquareSouth(ant.x,ant.y);
                }else{
                    gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    refillGrid();
                    ant.y=ant.y-resolution;
                    ant.drawSquareNorth(ant.x,ant.y);
                }
            }
            else if(ant.direction==180){
                if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                    gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    refillGrid();
                    ant.x=ant.x-resolution;
                    ant.drawSquareWest(ant.x,ant.y);
                }else{
                    gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    refillGrid();
                    ant.x=ant.x+resolution;
                    ant.drawSquareEast(ant.x,ant.y);
                }
            }
            else if(ant.direction==270){
                if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                    gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                    refillGrid();
                    ant.y=ant.y-resolution;
                    ant.drawSquareNorth(ant.x,ant.y);
                }else{
                    gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    refillGrid();
                    ant.y=ant.y+resolution;
                    ant.drawSquareSouth(ant.x,ant.y); 
                }
            }else{
                console.log("Error in ant brain");
            }
            numOfCycles++;
            document.getElementById("cell2").innerHTML=numOfCycles;
            setTimeout(myFunction, 20);   
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