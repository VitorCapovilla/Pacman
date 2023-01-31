const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animations");
const ghostFrames  = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

let pacman;
let fps = 30;
let oneBlockSize = 20;
let wallColor = '#202057';
let wallSpaceWidth = oneBlockSize / 2;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let speed = 10;
let foodColor = "#FDF59C";
let score = 0;
let lives = 3

let ghosts = [];
let ghostCount = 4;

const DIRECTION_RIGHT = 4
const DIRECTION_UP = 3
const DIRECTION_LEFT = 2
const DIRECTION_BOTTOM = 1

let ghostImageLocations = [
    { x: 0,   y: 0 },
    { x: 176, y: 0 },
    { x: 0,   y: 121 },
    { x: 176, y: 121 },
];

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

];

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize,},
];

let gameLoop = () => {
    update();
    draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

let onGhostCollision = () => {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
    }
};

let update = () => {
    //To do
    pacman.moveProcess()
    pacman.eat();
    for(let i = 0; i < ghosts.length; i++){
        ghosts[i].moveProcess();
    }

    if(pacman.checkGhostCollision(ghosts)){

        restartGame();
    }
};

let restartGame = () => {
    createNewPacman();
    createGhosts();

    lives --;

    if(lives == 0){
        gameOver()
    }
}

let gameOver = () =>{
    clearInterval(gameInterval)
}

let drawLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: " + lives, 100, oneBlockSize * (map.length + 1) + 10);
}

let drawFoods = () => {
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[0].length; j++){
            if(map[i][j] == 2){
                createRect(j * oneBlockSize + oneBlockSize / 2, 
                i * oneBlockSize + oneBlockSize / 2,
                oneBlockSize / 6,
                oneBlockSize / 6,
                foodColor);
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "White";
    canvasContext.fillText("Score: " + score, 0, oneBlockSize * (map.length + 1) + 10);
}

let draw = () => {
    createRect(0,0, canvas.width, canvas.height, "black")
    drawWalls()
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
};

let drawWalls = () => {
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[0].length; j++){
            if(map[i][j] == 1) { // Validação para identificar se é parede ou não
                createRect(
                    j * oneBlockSize,  
                    i * oneBlockSize, 
                    oneBlockSize, 
                    oneBlockSize, 
                    wallColor);
                if(j > 0 && map[i][j - 1] == 1){
                    createRect(
                        j * oneBlockSize, 
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset, 
                        wallSpaceWidth, 
                        wallInnerColor
                    );
                }
                if(j < map[0].length - 1 && map[i][j + 1] == 1){
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if(i > 0 && map[i - 1][j] == 1){
                    createRect(
                        j * oneBlockSize + wallOffset, 
                        i * oneBlockSize,
                        wallSpaceWidth, 
                        wallSpaceWidth + wallOffset, 
                        wallInnerColor
                    );
                }
                if(i < map.length - 1 && map[i + 1][j] == 1){
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
}

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize, 
        oneBlockSize, 
        oneBlockSize,
        oneBlockSize, 
        oneBlockSize / speed
    );
}

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener('keyup', (event) => {
    let k = event.keyCode

    setTimeout(() => {
        if(k == 37 || k == 65){
            //Move Left
            pacman.nextDirection = DIRECTION_LEFT;
        }else if(k == 38 || k == 87){
            //Move Up
            pacman.nextDirection = DIRECTION_UP;
        }else if(k == 39 || k == 68){
            //Move Right
            pacman.nextDirection = DIRECTION_RIGHT;
        }else if(k == 40 || k == 83){
            //Move Bottom
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 0);
});