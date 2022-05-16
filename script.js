// --- get elements ---
const gameBoard = document.getElementById('game-board')
const gameOverBoard = document.getElementById('game-over-screen')
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-button');
const restartBtn = document.getElementById('restart');

// --- imput images ---
const bgImg = new Image();
bgImg.src = './image/bg_underSea.jpg';
const goImg = new Image();
goImg.src = './image/game_over_screan.jpg';
const shrimp = new Image();
shrimp.src = './image/p1_shrimp.png';
const plankton = new Image();
plankton.src = './image/f1_plankton.png';
const fishS = new Image();
fishS.src = './image/d2_fish.png';
const fishL = new Image();
fishL.src = './image/d2_big_fish.png';
const fishPlayer = new Image();
fishPlayer.src = './image/p2_fish.png';
const jellyfishImg = new Image();
jellyfishImg.src = './image/d2_jellyfish.png';


// --- animate control ---
let animationId;
let gameOver = false;
const scoreLevel = [6, 16]

// --- scores and life ---
let score = 0;
let bestScore = 0;
let life = 3;

// --- player setting ---
let playerH = 80;
let playerW = 80;
let playerX = (canvas.width - playerW) / 2;
let playerY = canvas.height - 200;

// --- danger fish setting ---
let fishHeight = 100;
let fishWidth = 150;
const fishSpeed = -3;
let fishArray = [];
const jellyfishHeight = 200;
const jellyfishWidth = 100;
let jellyfishSpeedR = 0.5;
let jellyfishSpeedD = 1;


// --- food setting ---
const planktonHeight = 50;
const planktonWeight = 50;
const planktonSpeed = 2;

// --- dangers ---
class Fish {
    constructor(){
        this.fishW = fishWidth;
        this.fishH = fishHeight;
        this.xPos = canvas.width;
        this.yPos = Math.floor(Math.random()*(canvas.height - this.fishH));
    }
    move (){
        this.xPos += fishSpeed;
    }
}

class Jellyfish {
    constructor(){
        this.fishW = jellyfishWidth;
        this.fishH = jellyfishHeight;
        this.xPos = -(jellyfishWidth);
        this.yPos = Math.floor(Math.random()*(canvas.height/4));
    }
    move (){
        if(this.xPos + this.fishW > canvas.width || this.xPos < -(jellyfishWidth)){
            jellyfishSpeedR *= -1}
    
        this.xPos += jellyfishSpeedR;
        if(this.yPos + this.fishH > canvas.height*3/4 || this.yPos < 0){
            jellyfishSpeedD *= -1;
        } 
        this.yPos += jellyfishSpeedD;
    }
}
let jellyfishArray = [];

// --- foods ---
class Plankton {
    constructor(){
        this.planktonH = planktonHeight;
        this.planktonW = planktonWeight;
        this.xPos = Math.floor(Math.random()*(canvas.width - this.planktonW));
        this.yPos = -(this.planktonH);
    }
    move (){
        this.yPos += planktonSpeed;
    }
}
let foodsArray = [new Plankton];

// --- draw background ---
function drawBackground(){
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

// --- draw player ---
function drawPlayer(){
    if(playerX + playerW > canvas.width){
        playerX = canvas.width - playerW;
    }
    if(playerY + playerH > canvas.height){
        playerY = canvas.height - playerH;
    }
    if(score < 6){
        ctx.drawImage(shrimp, playerX, playerY, playerW, playerH);
    }else{   
        ctx.drawImage(fishPlayer, playerX, playerY, playerW, playerH);
    }
}

// --- draw big fish ---
function drawFish(){
    const nextFish = [];
    fishArray.forEach(fish => {
        fish.move();
        const {xPos, yPos, fishW, fishH} = fish;
        if (score < 6) {
            ctx.drawImage(fishS, xPos, yPos, fishW, fishH);
        } else {
            fish.fishW = fishWidth * 1.1
            fish.fishH = fishHeight * 1.2
            ctx.drawImage(fishL, xPos, yPos, fishW, fishH);
        }

        if (xPos > -fishW) {
            nextFish.push(fish);
        }
        if (playerX <= xPos + fishW / 3 * 2 && playerX + playerW / 3 * 2 >= xPos && 
            playerY + playerH / 3 * 2 >= yPos && playerY <= yPos + fishH / 3 * 2) {
                gameOver = true;
            }
    })
    fishArray = nextFish;   
}

function drawJellyfish(){
    const nextJellyfish = [];
    jellyfishArray.forEach(jellyfish => {
        jellyfish.move();
        const {xPos, yPos, fishW, fishH} = jellyfish;
        ctx.drawImage(jellyfishImg, xPos, yPos, fishW, fishH);
       
        if (playerX <= xPos + fishW && playerX + playerW >= xPos && 
            playerY + playerH >= yPos && playerY <= yPos + fishH) {
                life -= 1; 
                jellyfish.xPos += fishW * 2;  
                nextJellyfish.push(jellyfish);
            } else {
                nextJellyfish.push(jellyfish);
            }
        if(life <= 0){
            gameOver = true;
        }
    })
    jellyfishArray = nextJellyfish;   
}

// --- draw foods ---
function drawPlankton(){
    const nexPlankton = [];
    foodsArray.forEach(food => {
        food.move();
        const {xPos, yPos, planktonW, planktonH} = food;
        ctx.drawImage(plankton, xPos, yPos, planktonW, planktonH);
        
        if (playerX <= xPos + planktonW && playerX + playerW -10 >= xPos && 
            playerY + playerH >= yPos && playerY + 10 <= yPos + planktonH) {
               score += 1;
               if(score === 6) {
                   playerH = 80;
                   playerW = 100;
               } else {
                playerH *= 1.05;
                playerW *= 1.05;
               }
            } else {
                if (yPos > -planktonH) {
                    nexPlankton.push(food);
                }
            }
    })
    foodsArray = nexPlankton; 
}

// --- get mouse position ---
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

// --- draw score ---
function drawScore() {
    ctx.beginPath();
    ctx.font = "30px sans-serif";
    ctx.fillStyle = "orange";
    ctx.fillText(`Score : ${score}`, 1000, 50);
    ctx.closePath();
  }

// --- draw life ---
function drawLife(){
    ctx.beginPath();
    ctx.font = "30px sans-serif";
    ctx.fillStyle = "tomato";
    ctx.fillText(`Life : ${life}`, 50, 50);
    ctx.closePath();
}

// --- animate ---
function animate(){
    drawBackground()
    drawPlayer()
    if (animationId % 130 === 0) {
        fishArray.push(new Fish)
    }
    if (animationId % 100 === 0) {
        foodsArray.push(new Plankton)
    }
    drawFish()
    drawPlankton()
    drawScore()
    
    
    if(gameOver){
        if (score > bestScore) {
            bestScore = score;
          }
        cancelAnimationFrame(animationId)
        gameOverScreen()
    } else {
        if(score > 5) {
            drawLife()
            if(jellyfishArray.length < 1) {
                jellyfishArray.push(new Jellyfish)
            }
            drawJellyfish()
        }
        animationId = requestAnimationFrame(animate);
    }
}

// --- game status ---
function startGame(){
    gameBoard.style.display = "block";
    animate()
}
function gameOverScreen(){
    window.setTimeout(()=> {
        gameBoard.style.display = "none";
        //gameOverBoard.style.display = "block";
        gameOverBoard.style.visibility= "visible";
        gameOverBoard.querySelector('#score').innerHTML = `Your score is ${score}`
        gameOverBoard.querySelector('#record').innerHTML = `Your record is ${bestScore}.`
    }, 1000)
}
function restartGame(){
    gameOver = false;
    fishArray = [];
    foodsArray = [];
    jellyfishArray = [];   
    score = 0;
    playerH = 80;
    playerW = 80;
    //gameOverBoard.style.display = "none";
    gameOverBoard.style.visibility= "hidden";

    startGame()
}

// --- listeners ---
window.addEventListener("load", () => {
    gameBoard.style.display = "none";
    //gameOverBoard.style.display = "none";
    gameOverBoard.style.visibility= "hidden";
    startBtn.addEventListener("click", () => {
      startGame();
    }); 

    canvas.addEventListener("mousemove", function(event) { 
        let cRect = canvas.getBoundingClientRect();              
        // Gets the CSS positions along with width/height
        let canvasX = Math.round(event.clientX - cRect.left);        
        // Subtract the 'left' of the canvas from the X/Y
        let canvasY = Math.round(event.clientY - cRect.top);         
        // positions to get make (0,0) the top left of the 
        playerX = canvasX;
        playerY = canvasY;
        
    });

    restartBtn.addEventListener("click", () => {
        restartGame();
    })
  });