
//board
let board; 
let boardWidth = 360; 
let boardHeight = 640; 
let context; 

//bird 
let birdWidth = 34; //how big is the bird? 
let birdHeight = 24; //width/height ratio = 408/228 = 17/12 
let birdX = boardWidth/8; //where should we drop the bird? 
let birdY = boardHeight/2; 
let birdImg; 

let bird = {
    x : birdX, 
    y : birdY, 
    width: birdWidth, 
    height : birdHeight
}

//pipes
let pipeArray = []; 
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8 
let pipeHeight = 512; 
let pipeX = boardWidth; 
let pipeY = 0; 

let topPipeImg; 
let bottomPipeImg;

//physics 
let velocityX = -2; //pipe moving left speed 
let velocityY = 0; //bird jump speed 
let gravity = 0.4; 

//game over -> update(), placePipes() will not work. 
let gameOver = false; 
let score = 0; 

window.onload = function() {
    //element with id board corresponds to the canvas tag in html 
    board = document.getElementById("board"); 
    board.height = boardHeight; 
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board 

    //draw flappy bird. use green rectangle as proxy 
    // context.fillStyle = "green"; 
    // context.fillRect(bird.x, bird.y, bird.width, bird.height); 

    //load image to replace the rectangle above 
    birdImg = new Image(); 
    birdImg.src = "./flappybird.png"; 
    birdImg.onload = function() {
        // draw flappybird on the green rect 
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 
    }

    // load top and bottom pipe 
    topPipeImg = new Image(); 
    topPipeImg.src = "./toppipe.png"; 

    bottomPipeImg = new Image(); 
    bottomPipeImg.src = "./bottompipe.png"; 

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBird); //make bird jump when spacebar

}

//main game loop. update canvas 
function update() {
    requestAnimationFrame(update); 
    if (gameOver) { 
        return; 
    }
    context.clearRect(0, 0, board.width, board.height); //clear prev frame

    //bird 
    velocityY += gravity; 
    // bird.y += velocityY; 
    bird.y = Math.max(bird.y + velocityY, 0); //bird jumps up, limit bird to top of canvas 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 

    // case of bird falling to bottom 
    if (bird.y > board.height) {
        gameOver = true; 
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i]; 
        pipe.x += velocityX; //pipe moves 
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); 
        
        // increment score if bird passes right side of pipe 
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because two pipes exist! so for a set of pipe score is 0.5*2 = 1
            pipe.passed = true; 
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true; 
        }
    }

    //clear pipes that have gone off screen. (if right side of the pipe go off canvas) 
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from array 
    }

    //score 
    context.fillStyle = "white"; 
    context.font = "45px sans-serif"; 
    context.fillText(score, 5, 45); //score at x=5 y=45. top left 

    //game over text 
    if (gameOver) {
        context.fillText("GAME OVER", 5, 90); 
    }
}

function placePipes() {
    if (gameOver) { 
        return; 
    }
    //shift y position of pipe up. see 3/4 of pipe 
    //(0-1) * pipeHeight/2
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 -256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); 
    let openingSpace = board.height/4; 

    let topPipe = {
        img : topPipeImg, 
        x : pipeX, 
        y : randomPipeY, 
        width : pipeWidth, 
        height : pipeHeight, 
        passed : false 
    } 
    pipeArray.push(topPipe); 

    let bottomPipe = {
        img : bottomPipeImg, 
        x : pipeX, 
        y : randomPipeY + pipeHeight + openingSpace, 
        width : pipeWidth, 
        height : pipeHeight, 
        passed : false 
    }
    pipeArray.push(bottomPipe); 
}

function moveBird(e) { //keyevent
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" ) {
        //jump 
        velocityY = -6; 

        //reset game. all properties to default values. 
        if (gameOver) {
            bird.y = birdY; 
            pipeArray = []; 
            score = 0; 
            gameOver = false; 
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
            a.x + a.width > b.x && 
            a.y < b.y + b.height && 
            a.y + a.height > b.y; 
}