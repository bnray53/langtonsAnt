//resolution is the side length of the grid squares, any grid variables are responsive to resolution 
var resolution = 10;

//what setting the swap button is on default is 0 "Random Grid" with solid grid displayed, 1 is "Solid Grid" with random grid displayed
var swapButtonState=0;

var pauseButtonState=0;

//declaring variables
var gridArray;
var gridXSize;
var gridYSize;
var ant;
var cycleSpeed;
var numSlider;

//CMAC Creating color array to be used in ant class
var colorArray=["red","orange","yellow","lawngreen","dodgerblue","darkorchid"];
//Added with rotate and select function
var colorArrayUser=["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];
//MAC creating ant array
var antArray=[];
//MAC
var currentNumAnts=0;
//MAC getNumAnts will be linked to user controled slider on the index page 
//MAC linked succesfully 10/31 1147hrs
var getNumAnts;

//keeping track of number of movements made by ant
var numOfCycles = 0;

//flag for whether or not the ant has been placed on the grid
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
    //CMAC add color parameter instead of hard coding "red"
    //draw square with north arrow
    //SAR adding side parameter instaead of referring to side
    drawSquareNorth(x,y,color,side){
        fill(color);
        rect(x,y,side,side);
        line(x+(side*.5), y+(side*.9), x+(side*.5), y+(side*.1));
        line(x+(side*.1), y+(side*.5), x+(side*.5), y+(side*.1));
        line(x+(side*.5), y+(side*.1), x+(side*.9), y+(side*.5)); 
        this.direction=0;   
    }
    //draw square with south arrow
    drawSquareSouth(x,y,color,side){
        fill(color);
        rect(x,y,side,side);
        line(x+(side*.5), y+(side*.9), x+(side*.5), y+(side*.1));
        line(x+(side*.1), y+(side*.5), x+(side*.5), y+(side*.9));
        line(x+(side*.5), y+(side*.9), x+(side*.9), y+(side*.5)); 
        this.direction=180;   
    }
    //draw square with east arrow
    drawSquareEast(x,y,color,side){
        fill(color);
        rect(x,y,side,side);
        line(x+(side*.1), y+(side*.5), x+(side*.9), y+(side*.5));
        line(x+(side*.9), y+(side*.5), x+(side*.5), y+(side*.9));
        line(x+(side*.5), y+(side*.1), x+(side*.9), y+(side*.5));
        this.direction=90;    
    }
    //draw square with west arrow
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
    /* canvas dimensions should be able to be divided evenly by resolution if you want grid squares that fill
    the canvas equally*/
    
    //old version
    //var myCanvas = createCanvas(window.innerWidth-50, window.innerHeight-125);
    //New version, keeps the diminsions of the canvas divisible by the resolution, this gives an whoole number of grid squares
    var myCanvas = createCanvas(((floor((window.innerWidth-50)/resolution))*resolution), ((floor((window.innerHeight-125)/resolution))*resolution));
    //setting myCanvas to DOM id="myContainer"
    myCanvas.parent("myContainer");
    background(100);
    //Gives variables in terms of array indexes rather than pixels
    gridXSize = width / resolution;
    gridYSize = height / resolution;
    
    //Creating Slider
   /* numSlider = createSlider(1, 450, 150, 0);
    numSlider.position(width / 2-55, height + 50);
    numSlider.style("width", "150px");*/

    //Cycle speed slider
    numSlider=document.getElementById("slider1");
    //Ant count slider
    numslider2=document.getElementById("slider2");
    //Drawing initial grid
    createGrid();
}

function draw() {
    //Set cycleSpeed to slider value
    cycleSpeed = floor(numSlider.value);
    //MAC setting user inputted num of ants 
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
            //disable ant count slider
            numslider2.disabled=true;
        }
    }
}

function windowResized(){
    //only way found to consistantly reload page
    window.location="index.html";
}


function swapGrid(){
    if(swapButtonState==0){
        document.getElementById("swapButton").innerHTML = "Solid Grid";
        swapButtonState=1;
        createGrid();
        //MAC
        /*if(antPlacedFlag){
            ant.drawSquareNorth(ant.x, ant.y);
        }*/
        //MAC
        //CMAC Change add color parameter
        if(currentNumAnts>0){
            for(i=0;i<=currentNumAnts-1;i++){
                antArray[i].drawSquareNorth(antArray[i].x,antArray[i].y,colorArray[i],resolution);
            }
        }
        return;
    }if(swapButtonState==1){
        document.getElementById("swapButton").innerHTML = "Random Grid";
        swapButtonState=0;
        createGrid();
        //MAC
        /*if(antPlacedFlag){
            ant.drawSquareNorth(ant.x, ant.y);
        }*/
        //MAC
        //CMAC Change add color parameter
        if(currentNumAnts>0){
            for(i=0;i<=currentNumAnts-1;i++){
                antArray[i].drawSquareNorth(antArray[i].x,antArray[i].y,colorArray[i],resolution);
            }
        }
        return;
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
    if(swapButtonState==0){
        fill("white");
        rect((fx * resolution), (fy * resolution), resolution, resolution);
        indicator = 1;
        gridArray[fx][fy] = new GridContent(indicator);
    }
        /*below gives black and white squares, keep for future reference, or
        if ever want to start langton's ant on a non white grid*/
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
    //if (mouseX < width && mouseY < height) {
    //MAC fixed dimension check
    if((mouseX>0&&(mouseX<width))&&(mouseY>0&&(mouseY<height))){    
        //If the user has placed the ant
        //MACif(!antPlacedFlag){
        //MAC
        if(currentNumAnts<getNumAnts){    
            /*converting the mouseClick pixel coordinates to the correct pixel coordinates for the 
            square that was clicked on. This gives a "snapping" effect for grid selection*/
            var mouseClickX=mouseX-(mouseX%resolution);
            var mouseClickY=mouseY-(mouseY%resolution);
            //Call Ant constructor with pixel x and y using mouseClickX and mouseClickY
            //MACant=new Ant(mouseClickX, mouseClickY);
            //MAC push ant objects into array
            antArray.push(new Ant(mouseClickX, mouseClickY));
            /*Create default square facing north and set antPlaced flag to true so
            that this section is only run once*/            
            //MACant.drawSquareNorth(ant.x, ant.y);
            //MAC
            //CMAC Change add color parameter
            antArray[currentNumAnts].drawSquareNorth(antArray[currentNumAnts].x, antArray[currentNumAnts].y,colorArray[currentNumAnts],resolution);
            //MAC antPlacedFlag=true;
            //MAC
            currentNumAnts++;
            //MAC
            if(currentNumAnts==getNumAnts){
                antPlacedFlag=true;
                //Added when with rotate ant functions
                document.getElementById("cell5").innerHTML="Red Ant Selected. &nbsp; Direction: 0"
            }
        }    
    }else {
        //If user is outside canvas  
        console.log("Please click inside the canvas area to place ants");
    }
}

function startAnt(){
    //Timer code, uncomment for testing
    //var start= new Date().getTime();
    
    //try block used to catch when ant goes out of bounds
    try {
        
        
        //console.log("currentNumAnts"+currentNumAnts);
        //console.log("getNumAnts"+getNumAnts);

        if(antPlacedFlag){
            //flag for when to change cycle speed to cycle count
            antStarted=true;
                //Ant logic
                
                //MAC disbale start button to prevent skipping error
                document.getElementById("startButton").disabled=true;
                document.getElementById("selectAntButton").disabled=true;
                document.getElementById("rotateAntButton").disabled=true;
                document.getElementById("swapButton").disabled=true;
                //Added when with rotate ant functions
                document.getElementById("cell5").innerHTML=" ";
                
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
                    Percent Decrease: 86,350%
                
                Changes made: Instead of redrawing entire grid, just redraw the single changed grid cell.*/

                //Interesting results with (resolution*2)

                //MAC changed all ant. to antArray[i]. and added for loop
                //CMAC Change added color parameter
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

                /*Calling the function again with a small time delay, this or a for loop with a limit is 
                needed so there is no runaway calculations*/
                if(pauseButtonState==1){
                    return;
                }else{
                    setTimeout(startAnt, cycleSpeed);  
                }    
        }
    }catch(err){
        //flag used to stop the draw function override on cell1 and cell2
        programComplete=true;
        //console.log(err);
        document.getElementById("cell1").innerHTML="Program Complete";
        document.getElementById("cell2").innerHTML="Total Cycles: "+numOfCycles;
    }      
}

//
//Below is the new code added for the rotate and select function, variables have been kept isolated for troubleshooting
//

//only run if ants have been placed
//disable buttons once startAnt has been called
//need a global element to keep track of which ant has been selected, default to zero
var selectedAnt=0; 
//re adjusting the size of the ant object for better display in cell5, this is entirely seperate from regular resolution and may be adjusted as needed here
var cellResolution=10;
function selectAnt(){
    if(antPlacedFlag){
        
        selectedAnt++;
        if(selectedAnt==currentNumAnts){
            selectedAnt=0;
        }
        
        document.getElementById("cell5").innerHTML=colorArrayUser[selectedAnt]+" Ant Selected. &nbsp; Direction: "+antArray[selectedAnt].direction;
        
        //Below draws the ant object into cell5
        //Just 1st attempt, may need to adjust coordinates we are sending to match those of cell5
        //1st attempt results in undefined
        //May just need to save the squares as icons and display the icons???
        /*if(antArray[selectedAnt].direction==0){
            //document.getElementById("cell5").innerHTML=antArray[selectedAnt].drawSquareNorth(antArray[selectedAnt].x,antArray[selectedAnt].y,colorArray[selectedAnt],cellResolution);
        }else if(antArray[selectedAnt].direction==90){
            //document.getElementById("cell5").innerHTML=antArray[selectedAnt].drawSquareEast(antArray[selectedAnt].x,antArray[selectedAnt].y,colorArray[selectedAnt],cellResolution);            
        }else if(antArray[selectedAnt].direction==180){
            //document.getElementById("cell5").innerHTML=antArray[selectedAnt].drawSquareSouth(antArray[selectedAnt].x,antArray[selectedAnt].y,colorArray[selectedAnt],cellResolution);         
        }else if(antArray[selectedAnt].direction==270){
           // document.getElementById("cell5").innerHTML=antArray[selectedAnt].drawSquareWest(antArray[selectedAnt].x,antArray[selectedAnt].y,colorArray[selectedAnt],cellResolution);
        }else{
            document.getElementById("cell5").innerHTML="Unable to Draw Selected Ant";
        }*/

        //cycle through ants based on current ants
        
        //display ant in cell5 of the index page 
        //document.getElementById("cell5").innerHTML=selectedAnt;
        
    }
}

function rotateAnt(){
    //"Red Ant Selected. &nbsp; Direction: 0"
    if(antPlacedFlag){
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
            document.getElementById("cell5").innerHTML="Unable to Draw Selected Ant";
        }
    }
    //cycle through the didfferent compass directions
    //rotate the selected ant use the same code as above just offset the direction by 90 degrees
    //update cell5 with new direction
    //update the selected ant object with the new direction
}

function pauseAnt(){
    if(antStarted){
        if(pauseButtonState==0){
            document.getElementById("pauseButton").innerHTML = "Resume";
            pauseButtonState=1;
        }else if(pauseButtonState==1){
            document.getElementById("pauseButton").innerHTML = "Pause";
            pauseButtonState=0;
            startAnt();
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