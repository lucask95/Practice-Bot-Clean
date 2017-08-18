$(document).ready(function(){
    $("#startBtn").click(startCleaning);
});

// -----------------------------------------------------//
// Classes
// -----------------------------------------------------//

class grid {
    // class variables:
    // grid (2d array of tiles), dirtyTiles (array of tiles), rows, cols
    constructor(rows, cols) {
        this.grid = [];
        this.rows = rows;
        this.cols = cols;
        this.dirtyTiles = [];
        this.populateGrid(rows, cols);
    }

    populateGrid(rows, cols) {
        for (var i = 0; i < rows; i++) {
            var row = [];
            for (var j = 0; j < cols; j++) {
                var temp = new tile(.25, i, j);
                // having a dirty tiles list helps with pathfinding
                if (temp.dirty == true)
                    this.dirtyTiles.push(temp);
                row.push(temp);
            }
            this.grid.push(row);
        }
    }
}

class tile {
    // class variables:
    // i, j, dirty (boolean)
    constructor(p, i, j) {
        // p = probability that cell is dirty
        if (Math.random() <= p)
            this.dirty = true;
        else
            this.dirty = false;
        this.i = i;
        this.j = j;
    }
}

class bot {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

// -----------------------------------------------------//
// Global Variables
// -----------------------------------------------------//

var myGrid;
var myBot;
var inProgress = false;

// -----------------------------------------------------//
// Algorithm
// -----------------------------------------------------//

// findPath() takes in a grid and returns
// the list of tiles to clean, in order.
// ex: return [
//     [0,1] // go to tile 0,1 first
//     [1,3] // go to tile 1,3 second
//     [3,4] // go to tile 3,4 third
// ];
// uses the greedy algorithm of finding nearest dirty tile
function findPath() {
    var dirtyTiles = myGrid.dirtyTiles;
    var startingLength = dirtyTiles.length;
    var tilePath = [];

    // for each dirty tile, find the nearest dirty tile via manhattan length
    for (var i = 0; i < startingLength; i++) {
        var minDistance = 100;
        var closestTile;
        var closestTileIndex;
        var tempDistance = 0;

        // check all other tiles that are not yet in path
        for (var j = 0; j < dirtyTiles.length; j++) {
            if (i == 0) {
                // find dirty tile nearest to bot
                tempDistance  = Math.abs(dirtyTiles[j].i - myBot.i);
                tempDistance += Math.abs(dirtyTiles[j].j - myBot.j);
            }
            else {
                // find nearest dirty tile to current tile
                tempDistance  = Math.abs(dirtyTiles[j].i - tilePath[i-1].i);
                tempDistance += Math.abs(dirtyTiles[j].j - tilePath[i-1].j);
            }

            // if tile being checked is closer than current closest tile
            // then replace closest tile
            if (tempDistance < minDistance) {
                minDistance = tempDistance;
                closestTile = dirtyTiles[j];
                closestTileIndex = j;
            }
        }

        // add nearest dirty tile to path and remove it from the array of tiles
        // that are not yet in the path
        tilePath.push(closestTile);
        dirtyTiles.splice(closestTileIndex, 1);
    }

    return tilePath;
}

// -----------------------------------------------------//
// Initialization
// -----------------------------------------------------//

function renderGrid() {
    // create classtext var here so it does not keep getting deleted and recreated
    var classtext = "";
    $("#renderArea").html("");

    // for each tile in the grid, render it on the page
    for (var i = 0; i < myGrid.rows; i++) {
        for (var j = 0; j < myGrid.cols; j++) {
            // render plain or dirty tile
            if (myGrid.grid[i][j].dirty == true)
                classtext = "tile dirty";
            else
                classtext = "tile";
            $("#renderArea").append("<span class=\""+classtext+"\" id="+i+"_"+j+"></span>");

            // position tile. 15 pixel offset is purely aesthetic
            $("#"+i+"_"+j).css({
                "top": (i*64+15)+"px",
                "left": (j*64+15)+"px"
            });
        } // end of cols loop
    } // end of rows loop
}

function renderBot() {
    // randomize bot's starting position
    var botRow = Math.floor(Math.random()*myGrid.rows);
    var botCol = Math.floor(Math.random()*myGrid.cols);
    var text = "<img src=\"bot.png\" id=\"botImage\">";
    var tileId = "#"+botRow+"_"+botCol;
    myBot = new bot(botRow, botCol);

    // get position of tile at bot's coordinates and draw bot in the same place
    $("#renderArea").append(text);
    $("#botImage").css({
        "top": ($(tileId).css("top")),
        "left": ($(tileId).css("left"))
    });
}

function startCleaning() {
    var rows = parseInt($("#rowsIn").val());
    var cols = parseInt($("#colsIn").val());
    if (rows < 3 || cols < 3) {
        $("#moveLog").html("Grid must be at least 3x3");
        return;
    }
    myGrid = new grid(rows, cols);
    renderGrid();
    renderBot();
    findPath();
}
