//Resolution is the side length of the grid squares, any grid variables are responsive to resolution 
var resolution = 10;

/*What state the swap button is on, default is 0 "Random Grid" with solid grid displayed,
1 is "Solid Grid" with random grid displayed*/
var swapButtonState=0;
/*What state the pause button is on, default is 0 "Unpaused" with "Pause" displayed,
1 is "Paused" with "Resume" displayed*/
var pauseButtonState=0;

/*SelectedAnt is a global element to keep track of which ant has been selected, default to zero
this is used in the rotateAnt() and selectAnt() functions*/
var selectedAnt=0;

//Declaring variables
var gridArray;
var gridXSize;
var gridYSize;
var ant;
var cycleSpeed;
var numSlider;

/*NOTE: If more ants are wanted only need to add colors to the two following arrays and adjust
the slider limit on the index page*/

//Creating color array to be used in ant class as CSS color codes
var colorArray=["red","orange","yellow","lawngreen","dodgerblue","darkorchid"];
/*Creating color array to be used in the select and rotate functions,
this corresponds to colorArray but show the layman's word for the color selection*/
var colorArrayUser=["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];

//AntArray is used to store the created ant objects, added during the multiple ants mod
var antArray=[];

//Keeps track of how many ants have been placed on the grid
var currentNumAnts=0;

/*GetNumAnts linked to user controlled slider2 on the index page , 
keeps track of how many ants will be placed on the grid*/
var getNumAnts;

//Keeping track of number of movements made by ant
var numOfCycles = 0;

//Flag for whether or not the ant has been placed on the grid
var antPlacedFlag=false;

//Flag for when to change cycle speed to cycle count
var antStarted = false;

//Flag for when program has gone out of bounds
var programComplete=false;


/*Class for objects residing in the 2-dimensional array, only attribute they have is .ind which acts as 
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
    //Returns x coordinate in terms of the grid array indexes rather than pixels
    getGridX(){
        var gridX=this.x/resolution;
        return gridX;
    }
    //Returns y coordinate in terms of the grid array indexes rather than pixels
    getGridY(){
        var gridY=this.y/resolution;
        return gridY;
    }
    /*Below are the drawSquare methods, they draw a color filled square that's of side length 
    side, and an appropriately directed arrow based on resolution as well, also sets the 
    direction of the ant object
    
    Parameters:
        x: ants x-coordinate in pixels
        y: ants y-coordinate in pixels
        color: ants grid color, can use the colorArray or hard-code this parameter
        side: side length of the square in pixels
    */
    
    //Draw square with north arrow
    drawSquareNorth(x,y,color,side){
        fill(color);
        rect(x,y,side,side);
        line(x+(side*.5), y+(side*.9), x+(side*.5), y+(side*.1));
        line(x+(side*.1), y+(side*.5), x+(side*.5), y+(side*.1));
        line(x+(side*.5), y+(side*.1), x+(side*.9), y+(side*.5)); 
        this.direction=0;   
    }
    //Draw square with south arrow
    drawSquareSouth(x,y,color,side){
        fill(color);
        rect(x,y,side,side);
        line(x+(side*.5), y+(side*.9), x+(side*.5), y+(side*.1));
        line(x+(side*.1), y+(side*.5), x+(side*.5), y+(side*.9));
        line(x+(side*.5), y+(side*.9), x+(side*.9), y+(side*.5)); 
        this.direction=180;   
    }
    //Draw square with east arrow
    drawSquareEast(x,y,color,side){
        fill(color);
        rect(x,y,side,side);
        line(x+(side*.1), y+(side*.5), x+(side*.9), y+(side*.5));
        line(x+(side*.9), y+(side*.5), x+(side*.5), y+(side*.9));
        line(x+(side*.5), y+(side*.1), x+(side*.9), y+(side*.5));
        this.direction=90;    
    }
    //Draw square with west arrow
    drawSquareWest(x,y,color,side){
        fill(color);
        rect(x,y,side,side);
        line(x+(side*.1), y+(side*.5), x+(side*.9), y+(side*.5));
        line(x+(side*.1), y+(side*.5), x+(side*.5), y+(side*.1));
        line(x+(side*.5), y+(side*.9), x+(side*.1), y+(side*.5)); 
        this.direction=270;   
    }
}


function setup() {
    /*NOTE: canvas dimensions should be able to be divided evenly by resolution if you want grid squares that fill
    the canvas equally*/
    
    //Creating canvas
    /*Updated version, keeps the dimensions of the canvas divisible by the resolution,
    this gives an whole number of grid squares that are displayed instead of fractional grid squares.
    The hard coded numbers are used to keep the canvas from using the whole screen*/
    var myCanvas = createCanvas(((floor((window.innerWidth-50)/resolution))*resolution), ((floor((window.innerHeight-125)/resolution))*resolution));
    //Setting myCanvas to DOM id="myContainer"
    myCanvas.parent("myContainer");
    background(100);
    //Gives variables in terms of array indexes rather than pixels
    gridXSize = width / resolution;
    gridYSize = height / resolution;

    //Cycle speed slider
    numSlider=document.getElementById("slider1");
    //Ant count slider
    numslider2=document.getElementById("slider2");
    //Drawing initial grid
    createGrid();
}

function draw() {
    //The two sliders are in the draw function so any changes made to them is reflected in real time

    //Set cycleSpeed to slider value
    cycleSpeed = floor(numSlider.value);
    //Set getNumAnts to slider2 value
    getNumAnts=numslider2.value;

    //Display number of ants
    document.getElementById("cell4").innerHTML=numslider2.value;

    //If program is in bounds
    if(!programComplete){
        //Change cycle speed to cycle count after startAnt() has started
        if(!antStarted){
            document.getElementById("cell1").innerHTML = "Time Between Cycles";
            if(cycleSpeed>10){
                document.getElementById("cell2").innerHTML = cycleSpeed+"ms";
            }else{
                document.getElementById("cell2").innerHTML = "Gone to Plaid";
            }    
        }else{
            document.getElementById("cell1").innerHTML = "Cycle Count";
        }
    }
}

/*windowResized() is a P5.js function, this reloads the page when screen/browser size changes. This in turn causes
the reloaded program to be drawn responsively to new screen/browser size

NOTE: window.location="index.html" was used as it was the only method that would be able to reload 
the page consistently, all other more standard ways of reload the page from within a javascript program 
failed repeatedly*/
function windowResized(){
    window.location="index.html";
}

/*swapGrid() is called on swapButton click, this changes the word displayed on swapButton,
 swapButtonState, calls createGrid, and redraws any ants that were placed before the button was clicked*/
function swapGrid(){
    //Draws random grid
    if(swapButtonState==0){
        document.getElementById("swapButton").innerHTML = "Solid Grid";
        swapButtonState=1;
        createGrid();

        //Redrawing any ants already placed
        if(currentNumAnts>0){
            for(i=0;i<=currentNumAnts-1;i++){
                antArray[i].drawSquareNorth(antArray[i].x,antArray[i].y,colorArray[i],resolution);
            }
        }
        return;
     //Draws solid grid   
    }if(swapButtonState==1){
        document.getElementById("swapButton").innerHTML = "Random Grid";
        swapButtonState=0;
        createGrid();

        //Redrawing any ants already placed
        if(currentNumAnts>0){
            for(i=0;i<=currentNumAnts-1;i++){
                antArray[i].drawSquareNorth(antArray[i].x,antArray[i].y,colorArray[i],resolution);
            }
        }
        return;
    } 
}

/*NOTE: createGrid() function is only called during setup() function and swapGrid() function,
 fillGrid() function is only called during createGrid() function*/

//Creating two-dimensional array that will be represented by a grid of clickable squares
function createGrid() {
    gridArray = [];
    for (i = 0; i < gridXSize; i++) {
        gridArray[i] = [];
        for (j = 0; j < gridYSize; j++) {
            fillGrid(i, j);
        }
    }
}

/*Creating white or random grid squares with size being respect to pixels and creating "state" object 
in each cell that is initially set to 1 for white, and 1 or 0 for random. 
grid being solid or random is subject to swapButtonState*/
function fillGrid(x, y) {
    var fx=x;
    var fy=y;
    var indicator;
    //Drawing solid grid
    if(swapButtonState==0){
        fill("white");
        rect((fx * resolution), (fy * resolution), resolution, resolution);
        indicator = 1;
        gridArray[fx][fy] = new GridContent(indicator);
    }
    //Drawing random grid
    else if(swapButtonState==1){
        var rand = floor(random(0, 2));
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
        }
    }
    return;
}

//Based on mouse-press event
function mousePressed() {
    //If the user is inside canvas  
    if((mouseX>0&&(mouseX<width))&&(mouseY>0&&(mouseY<height))){    
        //If all ants have not yet been placed
        if(currentNumAnts<getNumAnts){    
            /*Converting the mouseClick pixel coordinates to the correct pixel coordinates for the 
            square that was clicked on. This gives a "snapping" effect for grid selection*/
            var mouseClickX=mouseX-(mouseX%resolution);
            var mouseClickY=mouseY-(mouseY%resolution);
            
            /*Push new ant object into antArray, Ant constructor called with pixel x and y
             using mouseClickX and mouseClickY*/
            antArray.push(new Ant(mouseClickX, mouseClickY));
            /*Create default square facing north, using currentNumAnts as parameter for all attributes*/            
            antArray[currentNumAnts].drawSquareNorth(antArray[currentNumAnts].x, antArray[currentNumAnts].y,colorArray[currentNumAnts],resolution);
           
            //Increase the number of ants currently on grid
            currentNumAnts++;

            //If the current number of ants matches the number of ants the user selected on slider2
            if(currentNumAnts==getNumAnts){
                //This flag will now allow the startAnt() function to run
                antPlacedFlag=true;
                //Initializing cell5 content
                document.getElementById("cell5").innerHTML="Red Ant Selected. &nbsp; Direction: 0"
            }
        }    
    }else {
        //If user is outside canvas  
        console.log("Please click inside the canvas area to place ants");
    }
}

//startAnt() is called on startButton click
function startAnt(){
    //Timer code, uncomment for testing
    //var start= new Date().getTime();
    
    //try block used to catch when ant goes out of bounds
    try {
        //If the user has placed all ants
        if(antPlacedFlag){

            //Flag for when to change cycle speed to cycle count
            antStarted=true;

            //Start, select, rotate, and swap buttons disabled when startAnt() function is running
            document.getElementById("startButton").disabled=true;
            document.getElementById("selectAntButton").disabled=true;
            document.getElementById("rotateAntButton").disabled=true;
            document.getElementById("swapButton").disabled=true;
            //Ant count slider disabled when startAnt() function is running
            numslider2.disabled=true;
            //Added when with rotate ant functions
            document.getElementById("cell5").innerHTML=" ";
                
                //Ant logic

                //V1.1
                /*Each one of the following statements are very similar. First the ant's current direction is checked, 
                then the state of the current grid is checked, based on the state of the grid the ant will then turn 
                right for 1 and left for 0 (right or left is subjective to the ants current direction)
                the ant will the proceed in that direction for one unit square(responsive to resolution).
                During this operation the ant also switches the color of the grid he started on and 
                calls for the grid to be redrawn so that the grid color changes */

                /*V1.2-optimization, to revert back to V1.1: uncomment refillGrid();, comment out
                the fill() and rect() in all the following statements.
                Results: Averaged over 8 cycles
                    V1.1 With seperate refillGrid(): 216.125ms per cycle
                    V1.2 Without seperate refillGriad(): .25ms per cycle
                    Percent Difference: 199.5378%
                
                Changes made: Instead of redrawing entire grid, just redraw the single changed grid cell.*/

            for(i=0;i<currentNumAnts;i++){
                if(antArray[i].direction==0){
                    if(gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind==1){                                     
                        gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind=0;                    
                        //refillGrid();
                        fill("black");
                        rect(antArray[i].x, antArray[i].y, resolution, resolution);
                        antArray[i].x=antArray[i].x+resolution;
                        antArray[i].drawSquareEast(antArray[i].x,antArray[i].y,colorArray[i],resolution);
                    }else{
                        gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind=1;
                        //refillGrid();
                        fill("white");
                        rect(antArray[i].x, antArray[i].y, resolution, resolution);
                        antArray[i].x=antArray[i].x-resolution;
                        antArray[i].drawSquareWest(antArray[i].x,antArray[i].y,colorArray[i],resolution);
                    }
                }
                else if(antArray[i].direction==90){
                    if(gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind==1){
                        gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind=0;
                        //refillGrid();
                        fill("black");
                        rect(antArray[i].x, antArray[i].y, resolution, resolution);
                        antArray[i].y=antArray[i].y+resolution;
                        antArray[i].drawSquareSouth(antArray[i].x,antArray[i].y,colorArray[i],resolution);
                    }else{
                        gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind=1;
                        //refillGrid();
                        fill("white");
                        rect(antArray[i].x, antArray[i].y, resolution, resolution);
                        antArray[i].y=antArray[i].y-resolution;
                        antArray[i].drawSquareNorth(antArray[i].x,antArray[i].y,colorArray[i],resolution);
                    }
                }
                else if(antArray[i].direction==180){
                    if(gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind==1){
                        gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind=0;
                        //refillGrid();
                        fill("black");
                        rect(antArray[i].x, antArray[i].y, resolution, resolution);
                        antArray[i].x=antArray[i].x-resolution;
                        antArray[i].drawSquareWest(antArray[i].x,antArray[i].y,colorArray[i],resolution);
                    }else{
                        gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind=1;
                    // refillGrid();
                        fill("white");
                        rect(antArray[i].x, antArray[i].y, resolution, resolution);
                        antArray[i].x=antArray[i].x+resolution;
                        antArray[i].drawSquareEast(antArray[i].x,antArray[i].y,colorArray[i],resolution);
                    }
                }
                else if(antArray[i].direction==270){
                    if(gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind==1){
                        gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind=0;
                        //refillGrid();
                        fill("black");
                        rect(antArray[i].x, antArray[i].y, resolution, resolution);
                        antArray[i].y=antArray[i].y-resolution;
                        antArray[i].drawSquareNorth(antArray[i].x,antArray[i].y,colorArray[i],resolution);
                    }else{
                        gridArray[antArray[i].getGridX()][antArray[i].getGridY()].ind=1;
                        //refillGrid();
                        fill("white");
                        rect(antArray[i].x, antArray[i].y, resolution, resolution);
                        antArray[i].y=antArray[i].y+resolution;
                        antArray[i].drawSquareSouth(antArray[i].x,antArray[i].y,colorArray[i],resolution); 
                    }
                }else{
                    //If error in ant logic section
                    console.log("Error in ant brain");
                }
            }
                //Updating the displayed number of cycles
                numOfCycles++;
                document.getElementById("cell2").innerHTML=numOfCycles;

                //Timer code, uncomment for testing
                /*var end= new Date().getTime();
                var seconds= end- start;
                console.log("Milli-seconds Ellapsed:" + seconds);*/

                /*Calling the function again with a small time delay based on user controlled cycleSpeed,
                this or a for loop with a limit is needed so there is no runaway calculations.
                This is subject to pauseButtonState, after program is paused pasueButtonState becomes 1,
                this only allows startAnt to run once when the pause button has been pressed,
                when button is unpaused the program cycles as normal based on cycleSpeed*/
                if(pauseButtonState==1){
                    return;
                }else{
                    setTimeout(startAnt, cycleSpeed);  
                }    
        }
    }catch(err){
        //Flag used to stop the draw function override on cell1 and cell2
        programComplete=true;
        //Displaying program complete and showing total number of cycles complated before termination
        document.getElementById("cell1").innerHTML="Program Complete";
        document.getElementById("cell2").innerHTML="Total Cycles: "+numOfCycles;
    }      
}

//selectAnt() is called on selectButton click
function selectAnt(){
    //If all ants have been placed
    if(antPlacedFlag){       
        selectedAnt++;
        /*Reverting selectedAnt back to zero if it increases above the number of ants on the grid
        selectedAnt is based on antArray index so it will be between 0 and currentNumAnts*/
        if(selectedAnt==currentNumAnts){
            selectedAnt=0;
        }
        //Updateing cell5
        document.getElementById("cell5").innerHTML=colorArrayUser[selectedAnt]+" Ant Selected. &nbsp; Direction: "+antArray[selectedAnt].direction;        
    }
}

//rotateAnt() is called on rotateButton click
function rotateAnt(){
    //If all ants have been placed
    if(antPlacedFlag){
        /*The code below checks the selected ants direction, redraws it 90 degrees to the right [which updates
        its' direction], and updates cell5*/
        if(antArray[selectedAnt].direction==0){
            antArray[selectedAnt].drawSquareEast(antArray[selectedAnt].x,antArray[selectedAnt].y,colorArray[selectedAnt],resolution);
            document.getElementById("cell5").innerHTML=colorArrayUser[selectedAnt]+" Ant Selected. &nbsp; Direction: "+antArray[selectedAnt].direction;
        }else if(antArray[selectedAnt].direction==90){
            antArray[selectedAnt].drawSquareSouth(antArray[selectedAnt].x,antArray[selectedAnt].y,colorArray[selectedAnt],resolution);            
            document.getElementById("cell5").innerHTML=colorArrayUser[selectedAnt]+" Ant Selected. &nbsp; Direction: "+antArray[selectedAnt].direction;
        }else if(antArray[selectedAnt].direction==180){
            antArray[selectedAnt].drawSquareWest(antArray[selectedAnt].x,antArray[selectedAnt].y,colorArray[selectedAnt],resolution);         
            document.getElementById("cell5").innerHTML=colorArrayUser[selectedAnt]+" Ant Selected. &nbsp; Direction: "+antArray[selectedAnt].direction;
        }else if(antArray[selectedAnt].direction==270){
            antArray[selectedAnt].drawSquareNorth(antArray[selectedAnt].x,antArray[selectedAnt].y,colorArray[selectedAnt],resolution);
            document.getElementById("cell5").innerHTML=colorArrayUser[selectedAnt]+" Ant Selected. &nbsp; Direction: "+antArray[selectedAnt].direction;
        }else{
            //If error in above code block
            document.getElementById("cell5").innerHTML="Unable to Draw Selected Ant";
        }
    }
}

/*pauseAnt() is called on pauseButton click, this changes the word displayed on pauseButton,
 pauseButtonState, and calls startAnt() if button has been unpaused*/
function pauseAnt(){
    //If ants still in bound
    if(!programComplete){
        //If startAnt() has been started
        if(antStarted){
            //If paused
            if(pauseButtonState==0){
                document.getElementById("pauseButton").innerHTML = "Resume";
                pauseButtonState=1;
            //If unpaused    
            }else if(pauseButtonState==1){
                document.getElementById("pauseButton").innerHTML = "Pause";
                pauseButtonState=0;
                startAnt();
            }
        } 
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