var world_height = 30;
var world_width = 30;
var startingWorld = [];
for(var i=0; i<world_height; i++){  // create a world of walls
    startingWorld[i] = [];
    for(var j=0; j<world_width; j++){
        startingWorld[i][j] = 1;
    }
}
startingWorld[1][1] = 0;  // empty starting space for pacman
var world = startingWorld.slice().map(function(row){return row.slice()});

var world_score = 0;    // % of playable area

var dict = [
    "empty",
    "wall",
    "coin",
    "cherry"
];

pacman = {
    row: 1,
    col: 1,
    score: 0
};

function randomBlock() {
    var rand = Math.floor(Math.random()*16);
    if(rand == 15) {
        return 3;   // lower chance of cherries
    }
    return Math.floor(rand/5);
}

function genWorld() {
    for(var i=1; i<world_height-1; i++) {
        for(j=1; j<world_width-1; j++) {
            world[i][j] = randomBlock();
        }
    }
    // world[1][1] = 0;
}

function propegateCheck(arr){
    for(var i=0; i<arr.length; i++){  // check left-right, top-bottom
        for(var j=0; j<arr[i].length; j++){
            if(arr[i][j] != 1){
                arr[i-1][j] = world[i-1][j];
                arr[i+1][j] = world[i+1][j];
                arr[i][j-1] = world[i][j-1];
                arr[i][j+1] = world[i][j+1];
            }
        }
    }
    for(i=arr.length-1; i>=0; i--){  // check right-left, bottom-top
        for(j=arr[i].length-1; j>=0; j--){
            if(arr[i][j] != 1){
                arr[i-1][j] = world[i-1][j];
                arr[i+1][j] = world[i+1][j];
                arr[i][j-1] = world[i][j-1];
                arr[i][j+1] = world[i][j+1];
            }
        }
    }
    return arr;
}

function checkWorld(){
    var tempWorld = startingWorld.slice().map(function(row){return row.slice()});
    for(var i=0; i<2; i++){   // once is insufficient for certain complex worlds
        tempWorld = propegateCheck(tempWorld);
    }
    world = tempWorld;
    for(i=0; i<world.length; i++){
        for(var j=0; j<world[i].length; j++){
            if(world[i][j] != 1){
                world_score++;
            }
        }
    }
    world_score /= (world.length-2) * (world[0].length-2);
}

function drawWorld() {
    var divs = "";
    for(var i=0; i<world.length; i++) {
        divs += "<div class='row'>";
        for(var j=0; j<world[i].length; j++) {
            divs += "<div class='" + dict[world[i][j]] + "'></div>"
        }
        divs += "</div>";
    }
    console.log(divs);
    $("#world").html(divs);
    // document.getElementById("world").innerHTML = divs;
}

function drawPacman() {
    $(".pacman").css("left", (pacman["col"]*20)+"px");
    $(".pacman").css("top", (pacman["row"]*24)+"px");
}

function showScore() {
    $("#score").text("Score: "+pacman.score);
}

function movePacman(dir) {      // 0: up, 1: right, 2: down, 3: left
    $(".pacman").css("background-image","url('pacman"+dir+".png')");
    if(dir % 2 == 0) {
        dir--;      // adjust dir to be 1 or -1
        if(world[pacman.row+dir][pacman.col] != 1) {    // don't run into walls
            pacman.row += dir;
        }
    }
    else {
        dir = 2 - dir;      // adjust dir to be 1 or -1
        if(world[pacman.row][pacman.col+dir] != 1) {    // don't run into walls
            pacman.col += dir;
        }
    }
    if(world[pacman.row][pacman.col] == 2) {    // eat a coin
        pacman.score += 1;
    }
    if(world[pacman.row][pacman.col] == 3) {    // eat a cherry
        pacman.score += 50;
    }
    world[pacman.row][pacman.col] = 0;
    drawWorld();
    drawPacman();
    showScore();
}

document.onkeydown = function(e){
    if(e.keyCode >= 37 && e.keyCode <= 40) {     // arrow keys
        movePacman((e.keyCode-2)%4);
    }
}

$(document).ready(function(){
    $(".pacman").css("background-image","url('pacman1.png')");
    while(world_score < 0.5){  // don't have too many walls
        while(world[1][2] == 1 && world[2][1] == 1){  // no isolated starting point
            genWorld();
        }
        checkWorld();
    }
    drawWorld();
    drawPacman();
    showScore();
});