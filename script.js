// --- get elements ---
const gameBoard = document.getElementById('game-board')
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-button');

// --- imput images ---
const bgImg = new Image();
bgImg.src = './image/bg_underSea.jpg';
const goImg = new Image();
goImg.src = './image/game_over_screan.jpg';
const shrimp = new Image();
shrimp.src = './image/p1_shrimp.png';
const plankdon = new Image();
plankdon.src = './image/f1_plankton.png';
const fishS = new Image();
fishS.src = './image/d2_fish.png';

// --- animate control ---
let animationId;
let gameOver = false;

// --- player setting ---
const playerH = 80;
const playerW = 80;
let playerX = (canvas.width - playerW) / 2;
let playerY = canvas.height - 200;

// --- danger fish setting ---
const fishHeight = 80;
const fishWidth = 100;
const fishSpeed = -3;

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

let fishArray = [new Fish];

// --- draw background ---
function drawBackground(){
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

// --- draw player ---
function drawShrimp(){
    if(playerX + playerW > canvas.width){
        playerX = canvas.width - playerW;
    }
    if(playerY + playerH > canvas.height){
        playerY = canvas.height - playerH;
    }
    ctx.drawImage(shrimp, playerX, playerY, playerW, playerH);
}

// --- draw big fish ---
function drawFish(){
    const nextFish = [];
    fishArray.forEach(fish => {
        fish.move();
        const {xPos, yPos, fishW, fishH} = fish;
        ctx.drawImage(fishS, xPos, yPos, fishW, fishH);
        if (xPos > -fishW) {
            nextFish.push(fish);
        }
    })
    fishArray = nextFish;
    console.log(fishArray)
}

// --- get mouse position ---
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

// --- animate ---
function animate(){
    drawBackground()
    drawShrimp()
    if (animationId % 130 === 0) {
        fishArray.push(new Fish)
    }
    drawFish()
    animationId = requestAnimationFrame(animate);
}

// --- start game ---
function startGame(){
    gameBoard.style.display = "block";
    animate()
}

// --- listeners ---
window.addEventListener("load", () => {
    gameBoard.style.display = "none";
    startBtn.addEventListener("click", () => {
      startGame();
    }); 

    canvas.addEventListener("mousemove", function(event) { 
        let cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
        let canvasX = Math.round(event.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
        let canvasY = Math.round(event.clientY - cRect.top);         // positions to get make (0,0) the top left of the 
        playerX = canvasX;
        playerY = canvasY;
        
    });

  });