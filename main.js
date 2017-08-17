$(document).ready(function(){
    $("#startBtn").click(startCleaning);
});

// -----------------------------------------------------//
// Classes
// -----------------------------------------------------//

class grid {
    constructor(rows, cols) {
        this.grid = [];
        this.rows = rows;
        this.cols = cols;
        this.populateGrid(rows, cols);
    }

    populateGrid(rows, cols) {
        for (var i = 0; i < rows; i++) {
            var row = [];
            for (var j = 0; j < cols; j++) {
                var temp = new tile(.25, i, j);
                row.push(temp);
            }
            this.grid.push(row);
        }
    }
}

class tile {
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
// Algorithm
// -----------------------------------------------------//

// TODO: Implement greedy algorithm: nearest neighbor

// -----------------------------------------------------//
// Initialization
// -----------------------------------------------------//

var myGrid;
var myBot;
var inProgress = false;

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
}
