
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
let pipeHeight = 52; 
let pipeX = boardWidth; 
let pipeY = 0; 

let topPipeImg; 
let bottomPipeImg; 

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
    setInterval(placePipes, 1500); 
}

//main game loop 
function update() {
    requestAnimationFrame(update); 
    context.clearRect(0, 0, board.width, board.height); //clear prev frame

    //bird 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i]; 
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); 
        
    }
}

function placePipes() {
    let topPipe = {
        img : topPipeImg, 
        x : pipeX, 
        y : pipeY, 
        width : pipeWidth, 
        height : pipeHeight, 
        passed : false 
    }

    pipeArray.push(topPipe); 
}