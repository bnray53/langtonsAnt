//resolution is the side length of the grid squares, any grid variables are responsive to resolution 
var resolution = 8;

//declaring variables
var gridArray;
var gridXSize;
var gridYSize;
var ant;
var cycleSpeed;

//keeping track of number of movements made by ant
var numOfCycles = 0;

//flag if the ant has been placed on the grid
var antPlacedFlag=false;

//flag for when to change cycle speed to cycle count
var antStarted = false;

//flag for when program has gone out of bounds
var programComplete=false;


/*Class for objects residing in the 2-dimensional array, only atrribute they have is .ind which acts as 
an on/off or 1/0 indicator of the grid's state*/
class GridContent {
    constructor(ind) {
        this.ind = ind;
    }
}

/*Class for ant object, has only three attributes x and y location based in pixels and one of four direction
based on 0 degrees as north*/

//Default direction is north
class Ant{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.direction=0;
    }
    //returns x coordinate in terms of the grid array indexes rather than pixels
    getGridX(){
        var gridX=this.x/resolution;
        return gridX;
    }
    //returns y coordinate in terms of the grid array indexes rather than pixels
    getGridY(){
        var gridY=this.y/resolution;
        return gridY;
    }
    /*Below are the drawSquare methods, they draw a red filled rectangle thats of side length 
    resolution, and an appropriately directed arrow based on resolution as well, also sets the 
    direction of the ant object*/

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
    /* canvas dimensions should be able to be divided evenly by resolution if you want grid squares that fill
    the canvas equally*/
    var myCanvas = createCanvas(1200, 480);
    //setting myCanvas to DOM id="myContainer"
    myCanvas.parent("myContainer");
    background(100);
    //Gives variables in terms of array indexes rather than pixels
    gridXSize = width / resolution;
    gridYSize = height / resolution;

    //Creating Slider
    numSlider = createSlider(1, 450, 150, 0);
    numSlider.position(width / 2 - 40, height + 50);
    numSlider.style("width", "150px");

    //Drawing initial grid
    createGrid();
}

function draw() {
    //Set cycleSpeed to slider value
    cycleSpeed = floor(numSlider.value());

    //If program is in bounds
    if(!programComplete){
        //Change cycle speed to cycle count after startAnt() has started
        if(!antStarted){
            document.getElementById("cell1").innerHTML = "Cycle Speed";
            if(cycleSpeed>10){
                document.getElementById("cell2").innerHTML = cycleSpeed;
            }else{
                document.getElementById("cell2").innerHTML = "Gone to Plaid";
            }    
        }else{
            document.getElementById("cell1").innerHTML = "Cycle Count";
        }
    }
}

//Creating two-dimensional array
function createGrid() {
    gridArray = [];
    for (i = 0; i < gridXSize; i++) {
        gridArray[i] = [];
        for (j = 0; j < gridYSize; j++) {
            fillGrid(i, j);
        }
    }
}

/*Creating white grid squares with respect to pixels and creating our "state" object 
in each cell that is initially set to 1 for white.*/
function fillGrid(x, y) {
    var fx=x;
    var fy=y;
    var indicator;
    fill("white");
    rect((fx * resolution), (fy * resolution), resolution, resolution);
    indicator = 1;
    gridArray[fx][fy] = new GridContent(indicator);

    /*below gives black and white squares, keep for future reference, or
    if ever want to start langton's ant on a non white grid*/

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
        //If the user has placed the ant
        if(!antPlacedFlag){
            /*converting the mouseClick pixel coordinates to the correct pixel coordinates for the 
            square that was clicked on. This gives a "snapping" effect for grid selection*/
            var mouseClickX=mouseX-(mouseX%resolution);
            var mouseClickY=mouseY-(mouseY%resolution);
            //Call Ant constructor with pixel x and y using mouseClickX and mouseClickY
            ant=new Ant(mouseClickX, mouseClickY);
            /*Create default square facing north and set antPlaced flag to true so
            that this section is only run once*/            
            ant.drawSquareNorth(ant.x, ant.y);
            antPlacedFlag=true;
        }    
    }else {
        //If user is outside canvas  
        console.log("Please click inside the canvas area");
    }
}

function startAnt(){
    //Timer code, uncomment for testing
    //var start= new Date().getTime();

    //try block used to catch when ant goes out of bounds
    try {
        //flag for when to change cycle speed to cycle count
        antStarted=true;

        if(antPlacedFlag){
                //Ant logic

                //V1.1
                /*Each one of the following statements are very similar. First the ant's current direction is checked, 
                then the state of the current grid is checked, based on the state of the grid the ant will then turn 
                right for 1 and left for 0 (right or left is subjective to the ants current direction)
                the ant will the proceed in that direction for one unit square(responsive to resolution).
                During this operation the ant also switches the color of the grid he started on and 
                calls for the grid to be redrawn so that the grid color changes */

                /*V1.2-optimization, to revert back to V1.1: uncomment refillGrid();, and comment out
                the fill() and rect() in all the following statements.
                Results: Averaged over 8 cycles
                    V1.1 With seperate refillGrid(): 216.125ms per cycle
                    V1.2 Without seperate refillGriad(): .25ms per cycle
                    Percent Difference: 199.5378%
                    Percent Decrease: 86,350%
                
                Changes made: Instead of redrawing entire grid, just redraw the single changed grid cell.*/


                if(ant.direction==0){
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){                                     
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;                    
                        //refillGrid();
                        fill("black");
                        rect(ant.x, ant.y, resolution, resolution);
                        ant.x=ant.x+resolution;
                        ant.drawSquareEast(ant.x,ant.y);
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                        //refillGrid();
                        fill("white");
                        rect(ant.x, ant.y, resolution, resolution);
                        ant.x=ant.x-resolution;
                        ant.drawSquareWest(ant.x,ant.y);
                    }
                }
                else if(ant.direction==90){
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                        //refillGrid();
                        fill("black");
                        rect(ant.x, ant.y, resolution, resolution);
                        ant.y=ant.y+resolution;
                        ant.drawSquareSouth(ant.x,ant.y);
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                        //refillGrid();
                        fill("white");
                        rect(ant.x, ant.y, resolution, resolution);
                        ant.y=ant.y-resolution;
                        ant.drawSquareNorth(ant.x,ant.y);
                    }
                }
                else if(ant.direction==180){
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                        //refillGrid();
                        fill("black");
                        rect(ant.x, ant.y, resolution, resolution);
                        ant.x=ant.x-resolution;
                        ant.drawSquareWest(ant.x,ant.y);
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                    // refillGrid();
                        fill("white");
                        rect(ant.x, ant.y, resolution, resolution);
                        ant.x=ant.x+resolution;
                        ant.drawSquareEast(ant.x,ant.y);
                    }
                }
                else if(ant.direction==270){
                    if(gridArray[ant.getGridX()][ant.getGridY()].ind==1){
                        gridArray[ant.getGridX()][ant.getGridY()].ind=0;
                        //refillGrid();
                        fill("black");
                        rect(ant.x, ant.y, resolution, resolution);
                        ant.y=ant.y-resolution;
                        ant.drawSquareNorth(ant.x,ant.y);
                    }else{
                        gridArray[ant.getGridX()][ant.getGridY()].ind=1;
                        //refillGrid();
                        fill("white");
                        rect(ant.x, ant.y, resolution, resolution);
                        ant.y=ant.y+resolution;
                        ant.drawSquareSouth(ant.x,ant.y); 
                    }
                }else{
                    //If error in ant logic section
                    console.log("Error in ant brain");
                }
                //Updating the displayed number of cycles
                numOfCycles++;
                document.getElementById("cell2").innerHTML=numOfCycles;

                //Timer code, uncomment for testing
                /*var end= new Date().getTime();
                var seconds= end- start;
                console.log("Milli-seconds Ellapsed:" + seconds);*/

                /*Calling the function again with a small time delay, this or a for loop with a limit is 
                needed so there is no runaway calculations*/
                setTimeout(startAnt, cycleSpeed);  
        }
    }catch(err){
        //flag used to stop the draw function override on cell1 and cell2
        programComplete=true;
        document.getElementById("cell1").innerHTML="Program Complete";
        document.getElementById("cell2").innerHTML="&nbsp;";
    }      
}

//refillGrid() was commented out during V1.2 optimization, keep the code for use in other projects.

//This function redraws the current grid with respects to each grid objects state
/*function refillGrid(){
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
}*/
