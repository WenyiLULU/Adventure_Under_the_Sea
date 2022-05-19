// --- get elements ---
const homeScreen = document.getElementById('start-screen');
const gameBoard = document.getElementById('game-board');
const gameOverBoard = document.getElementById('game-over-screen');
const levelUpScreen = document.getElementById('levelup-screen');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-button');
const restartBtn = document.getElementById('restart');
const continuBtn = document.getElementById('continu');
const goBackBtn = document.getElementById('goback');
const volumeUpBtn = document.getElementById('up');
const volumeDownBtn = document.getElementById('down');
const volumeMute = document.getElementById('mute');

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
const shark = new Image();
shark.src = './image/d3_shark.png'
const fishPlayer = new Image();
fishPlayer.src = './image/p2_fish.png';
const jellyfishImg = new Image();
jellyfishImg.src = './image/d2_jellyfish.png';
const heart = new Image();
heart.src = './image/life_heart.png';

//--- music control ---
const startMusic = document.getElementById('start-music');
const bgMusic = document.getElementById('background-music');
const levelupMusic = new Audio('./music/levelup.mp3');
const gameOverSound = new Audio('./music/game-over.mp3');
const biteSound = new Audio('./music/bite-short.mp3');
soundVolume = 0.1;

// --- animate control ---
let animationId;
let gameOver = false;
let level = 1;
const levelScreenX = canvas.width / 4;
const levelScreenY = canvas.height / 4;
const levelScreenW = canvas.width / 2;
const levelScreenH = canvas.height / 2;

// --- scores and life ---
let score = 0;
let bestScore = 0;
let life = 3;
let playerInfo = {};

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
        this.jellyfishSpeedR = 0.5;
        this.jellyfishSpeedD = 1;
    }
    move (){
        if(this.xPos + this.fishW > canvas.width + playerW*2|| this.xPos < -(jellyfishWidth)){
            this.jellyfishSpeedR *= -1}
    
        this.xPos += this.jellyfishSpeedR;
        if(this.yPos + this.fishH > canvas.height*3/4 || this.yPos < 0){
            this.jellyfishSpeedD *= -1;
        } 
        this.yPos += this.jellyfishSpeedD;
    }
}
let jellyfishArray = [];

// --- foods ---
class Plankton {
    constructor(kind){
        this.planktonH = planktonHeight;
        this.planktonW = planktonWeight;
        this.xPos = Math.floor(Math.random()*(canvas.width - this.planktonW));
        this.yPos = -(this.planktonH);
        this.kind = kind;
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
    if(score <= 5){
        ctx.drawImage(shrimp, playerX, playerY, playerW, playerH);
    }else if (score > 5 && score <= 15) {   
        ctx.drawImage(fishPlayer, playerX, playerY, playerW, playerH);
    }else {
        ctx.drawImage(fishL, playerX, playerY, playerW, playerH);
    }
}

// --- draw big fish ---
function drawFish(){
    const nextFish = [];
    fishArray.forEach(fish => {
        fish.move();
        const {xPos, yPos, fishW, fishH} = fish;
        if (score <= 5) {
            ctx.drawImage(fishS, xPos, yPos, fishW, fishH);
        } else if (score > 5 && score <= 15){
            fish.fishW = fishWidth * 1.1
            fish.fishH = fishHeight * 1.2
            ctx.drawImage(fishL, xPos, yPos, fishW, fishH);
        } else {
            fish.fishW = fishWidth * 3.5
            fish.fishH = fishHeight * 2.5
            ctx.drawImage(shark, xPos, yPos, fishW, fishH);
        }

        if (xPos > -(fishW)) {
            nextFish.push(fish);
        }
        if (playerX <= xPos + fishW / 4 * 2 && playerX + playerW / 4 * 3 >= xPos && 
            playerY + playerH / 4 * 3 >= yPos && playerY <= yPos + fishH / 4 * 3) {
                gameOver = true;
                bgMusic.pause();
                gameOverSound.play();
                
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
            bgMusic.pause();
            gameOverSound.play();
        }
    })
    jellyfishArray = nextJellyfish;   
}

// --- draw foods ---
function drawPlankton(){
    const nexPlankton = [];
    foodsArray.forEach(food => {
        food.move();
        const {xPos, yPos, planktonW, planktonH, kind} = food;
        if(kind === 'shrimp'){
            ctx.drawImage(shrimp, xPos, yPos, planktonW, planktonH);      
        } else if(kind === 'fish'){
            ctx.drawImage(fishS, xPos, yPos, planktonW, planktonH);      
        } else{
            ctx.drawImage(plankton, xPos, yPos, planktonW, planktonH);
        }
        
        if (playerX <= xPos + planktonW && playerX + playerW -10 >= xPos && 
            playerY + playerH >= yPos && playerY + 10 <= yPos + planktonH) {
                biteSound.play();
                if(kind === 'plankton'){score += 1;}
               else if(kind === 'shrimp') {score += 2;}
               else{score +=3}
                playerH *= 1.05;
                playerW *= 1.05;
            } else {
                if (yPos > -planktonH) {
                    nexPlankton.push(food);
                }
            }
    })
    foodsArray = nexPlankton; 
}
function drawRandomFood(){
    if(level > 2){
        if(Math.floor(Math.random()*5) === 4){
            foodsArray.push(new Plankton('fish'))
        }else{
        foodsArray.push(new Plankton('shrimp'))
        }       
    }else if(level > 1){
        if(Math.floor(Math.random()*4) === 3){
            foodsArray.push(new Plankton('shrimp'))
        }else{
        foodsArray.push(new Plankton('plankton'))
        } 
    }
    else{
        foodsArray.push(new Plankton('plankton'))
    }
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
    ctx.font = "30px Allerta Stencil";
    ctx.fillStyle = "navy";
    ctx.fillText(`Score : ${score}`, 1000, 50);
    ctx.closePath();
  }

// --- draw life ---
function drawLife(){
    let heartX = 30;
    for (let i=0; i<life; i+=1){
        ctx.drawImage(heart, heartX, 30, 50, 50);
        heartX += 55;
    }
}

// --- animate ---
function animate(){
    drawBackground()
    drawPlayer()
    if(score <= 15){
        if (animationId % 130 === 0) {
            fishArray.push(new Fish)
        }
    } else {
        if (animationId % 300 === 0) {
            fishArray.push(new Fish)
        }
    }
    
    if (animationId % 100 === 0) {
        drawRandomFood()
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
    } 
    else if ((level === 1 && score > 5) || (level === 2 && score > 15)){
        cancelAnimationFrame(animationId)
        drawLevelUp()
    }
    else {
        if(level > 1) {
            drawLife()
            drawJellyfish()
        }
        animationId = requestAnimationFrame(animate);
    }
}

// --- game status ---
function startGame(){
    gameBoard.style.display = "block";
    startMusic.pause();
    bgMusic.play()
    animate()
}
function gameOverScreen(){
    window.setTimeout(()=> {
        gameBoard.style.display = "none";
        gameOverBoard.style.visibility= "visible";
        gameOverBoard.querySelector('#score').innerHTML = `Your score is ${score}`
        gameOverBoard.querySelector('#record').innerHTML = `Your record is ${bestScore}.`
    }, 1000)
}
function drawLevelUp(){
    bgMusic.pause();
    levelupMusic.play();
        
    level += 1;
    let playerImage, dangerImage
    window.setTimeout(()=> {
        if(level <= 2){
            playerImage = `<image src=${fishPlayer.src} alt="fish" style="height: 50px; width: 70px"/>`;
            dangerImage = `<image src=${fishL.src} alt="big fish" style="height: 50px; width: 70px"/>`;
            levelUpScreen.querySelector('#life').innerHTML = `You will have 3 points of life. <<image src=${heart.src} alt="big fish" style="height: 50px; width: 50px"/>>`
        }else {
            playerImage = `<image src=${fishL.src} alt="big fish" style="height: 50px; width: 70px"/>`;
            dangerImage = `<image src=${shark.src} alt="shark" style="height: 50px; width: 70px"/>`;
            levelUpScreen.querySelector('#life').innerHTML = `Be attention to your points of life.`
        }

        levelUpScreen.style.visibility = "visible";
        levelUpScreen.querySelector('#new-player').innerHTML = `Now you evolve to < ${playerImage}>`
        levelUpScreen.querySelector('#new-danger1').innerHTML = `Be careful of < <image src="./image/d2_jellyfish.png" alt="jellyfish" style="height: 60px; width: 40px"/> >! It will make you lose 1 point of life. `
        levelUpScreen.querySelector('#new-danger2').innerHTML = `ATTENTION : If you get catched by <${dangerImage}>, you will DIE !`
    }, 500)
}
function reset(){
    gameOver = false;
    fishArray = [];
    foodsArray = [];
    jellyfishArray = [];   
    level = 1;
    score = 0;
    life = 3;
    playerH = 80;
    playerW = 80;
    gameOverBoard.style.visibility= "hidden";
}
function restartGame(){
    reset()
    startGame()
}
function continu(){
    levelUpScreen.style.visibility="hidden";
    fishArray = [];
    foodsArray = [];
    playerH = 80;
    playerW = 100;
    levelupMusic.pause();
    levelupMusic.currentTime = 0;
    bgMusic.play();
    jellyfishArray.push(new Jellyfish)
    animate()
}
function goBack(){
    startMusic.play();
    gameBoard.style.display = "none";
    gameOverBoard.style.visibility= "hidden";
    levelUpScreen.style.visibility="hidden";
    homeScreen.querySelector('#fin-score').innerHTML = `Your score is ${score}`
    homeScreen.querySelector('#last-record').innerHTML = `Your record is ${bestScore}.`
    reset()
}
function setVolume(){
    startMusic.volume = soundVolume;
    bgMusic.volume = soundVolume;
    biteSound.volume = soundVolume;
    levelupMusic.volume = soundVolume;
    gameOverSound.volume = soundVolume;
}

// --- local storage ---
const addPlayer = (event) => {
    event.preventDefault(); // to stop the form submission    
    playerInfo[document.getElementById('player-name').value] = bestScore; 
    
    document.querySelector('form').reset();
    console.log('added', {playerInfo})
    // saving in local storage
    localStorage.setItem('playerList', JSON.stringify(playerInfo))
}

// --- listeners ---
window.addEventListener("load", () => {
    gameBoard.style.display = "none";
    gameOverBoard.style.visibility= "hidden";
    levelUpScreen.style.visibility="hidden";
    setVolume();
    startMusic.play();

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
    });
    continuBtn.addEventListener("click", () => {
        continu();
    });
    goBackBtn.addEventListener("click", () => {
        goBack();
    });
    volumeUpBtn.addEventListener("click", () => {
        soundVolume += 0.1;
        setVolume()
    })
    volumeDownBtn.addEventListener("click", () => {
        soundVolume -= 0.1;
        setVolume()
    })
    volumeMute.addEventListener("click", () => {
        if(soundVolume != 0){
            soundVolume = 0;
            volumeMute.innerHTML = "ON";
        }
        else{
            soundVolume = 0.3;
            volumeMute.innerHTML = "OFF";
        };
        setVolume()
    })
    document.getElementById('save').addEventListener('click', addPlayer)
  });