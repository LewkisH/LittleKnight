import { bitmapObjects, generateWorld} from "./generateWorld.js";
import { readBitmap } from "./bitmapReader.js";

window.addEventListener('load', async function () {
    // let objectArray = getObjectArray(); This will come from bitmapReader.js currently just a sample value

    // Populate the (bitmapObjects) array with sample objects
    /* const newObject = {
        objectType: "platform",
        x: 0,
        y: 0,
        width: 5,
        height: 5,
    };
    const newObject2 = {
        objectType: "platform",
        x: 50,
        y: 5,
        width: 5,
        height: 5,
        bitmapObjects.push(newObject, newObject2);
    }; */

   let objArr = await readBitmap("assets/test69.bmp")
    console.log(objArr)

    // Add it to bitmapObjects


    let gameWorldElem = document.getElementById('gameWorld');


    generateWorld(objArr, gameWorldElem);
});











// import Player from './player.js'
    // let lastTime;
    // let isPaused = false;
    // let update;
// window.addEventListener('load', function () {
//     let pausedPlayerState = null;
//     const game = document.getElementById('game');
//     const player = new Player(game.offsetWidth, game.offsetHeight, document.getElementById("player"))
//     // let lastTime
//    const gameLoop = function(time) {
//         if (!isPaused) {
//             if (lastTime != null) {
//                 const delta = time - lastTime
//                 player.update(input, delta)
//                 colMan.checkAllCollision()
//                 // console.log(playerAABB.checkCollision(blackAABB))
//             }
//             lastTime = time
//             window.requestAnimationFrame(gameLoop)
//         }
//     }

//     class InputHandler {
//         constructor() {
//             this.keys = [];

//             window.addEventListener("keydown", e => {
//                 console.log(e.key)
//                 if ((e.key === "d" ||
//                     e.key === "a" ||
//                     e.key === "w" ||
//                     e.key === "s" ||
//                     e.key === " ")
//                     && this.keys.indexOf(e.key) === -1) {
//                     this.keys.push(e.key)
//                 }

//             })
//             window.addEventListener("keyup", e => {
//                 if ((e.key === "d" ||
//                     e.key === "a" ||
//                     e.key === "w" ||
//                     e.key === "s" ||
//                     e.key === " ")) {
//                     this.keys.splice(this.keys.indexOf(e.key), 1)

//                 }

//             })
//         }
//     }

//     class Enemy {
//         constructor(enemyElem) {
//             this.enemyElem = enemyElem;
//             this.speed = 0;

//         }
//     }

//     //if passing in entities other than player, use their html element
//     class AABBItem { //class to turn any object into a collidable.
//         constructor(entity, type) {
//             if (entity instanceof Player) {
//                 this.elem = document.getElementById("player")
//                 this.id = "player"; // for debug name
//                 this.width = entity.width;
//                 this.height = entity.height;
//                 entity.AABB = this
//                 this.entity = entity;
//                 this.grounded = false
//             } else {
//                 this.elem = entity
//                 let rect = entity.getBoundingClientRect();
//                 this.id = entity.id;
//                 this.width = rect.right - rect.left;
//                 this.height = rect.bottom - rect.top;
//             }
//             this.type = type
//             this.debug = null
//             this.name = null;
//             this.debugX = null;
//             this.debugY = null;
//         }


//         get x() {
//             let rect = this.elem.getBoundingClientRect();
//             return rect.left;
//         }
//         set x(value) {
//             if (this.id === "player") {
//                 this.elem.style.setProperty("--xCoord", Math.floor(value))
//             }
//         }
//         get y() {
//             let rect = this.elem.getBoundingClientRect();
//             return rect.top;
//         }
//         set y(value) {
//             if (this.id === "player") {
//                 this.elem.style.setProperty("--yCoord", Math.floor(value))
//             }
//         }

//         //did we collide with 'other' entity?
//         checkCollision(other) {
//             return (
//                 (this.x + this.width) > other.x &&
//                 this.x < (other.x + other.width) &&
//                 this.y < (other.y + other.height) &&
//                 (this.y + this.height) > other.y
//             )
//         }
//         //calculates which side of 'other' entity did current object collide with
//         collisionSide(other) {
//             const dx = (this.x + this.width / 2) - (other.x + other.width / 2);
//             const dy = (this.y + this.height / 2) - (other.y + other.height / 2);
//             const width = (this.width + other.width) / 2;
//             const height = (this.height + other.height) / 2;
//             const crossWidth = width * dy;
//             const crossHeight = height * dx;

//             if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
//                 if (crossWidth > crossHeight) {
//                     return crossWidth > -crossHeight ? 'bottom' : 'left';
//                 } else {
//                     return crossWidth > -crossHeight ? 'right' : 'top';
//                 }
//             }
//             return null;
//         }

//         //displays x,y,height,width under game window
//         addToDebug() {
//             this.debug = document.getElementById('collisiondebug');
//             this.name = document.createElement('p');
//             this.debugX = document.createElement('p')
//             this.debugY = document.createElement('p')
//             let debugH = document.createElement('p')
//             let debugW = document.createElement('p')
//             this.name.textContent = this.id
//             this.debugX.textContent = "X: " + this.x
//             this.debugY.textContent = "Y: " + this.y
//             debugH.textContent = "height: " + this.height
//             debugW.textContent = "width: " + this.width
//             this.debug.appendChild(this.name)
//             this.name.appendChild(this.debugY)
//             this.name.appendChild(this.debugX)
//             this.name.appendChild(debugH)
//             this.name.appendChild(debugW)
//         }

//         //put this in game loop to update moveable objects' coordinates when debugging
//         updateDebug() {

//             this.debugY.textContent = "Y: " + this.y
//             this.debugX.textContent = "X: " + this.x
//         }
//     }


//     class CollisionManager { // put all collidable objects into the manager
//         constructor() {
//             this.entities = [];
//         }
//         addEntity(entity) {
//             this.entities.push(entity)
//             //console.log("PUSHED: " + entity.id)
//         }

//         //checks collisions between all objects.
//         checkAllCollision() {
//             let playerCol = false;
//             for (let i = 0; i < this.entities.length; i++) {
//                 for (let j = i + 1; j < this.entities.length; j++) {
//                     playerCol = this.handlePlayerCollision(i, j, playerCol)
//                 }
//             }

//             if (!playerCol) {//if player has not collided with anything this frame then player is no longer grounded.
//                 player.AABB.grounded = false
//             }
//         }



//         handlePlayerCollision(i, j, playerCol) {
//             if (this.entities[i].type === "character" &&
//                 (this.entities[j].type === "environment" ||
//                     this.entities[j].type === "platform")) {

//                 if (this.entities[i].checkCollision(this.entities[j])) {
//                     // console.log(this.entities[i].id + " collided with: " + this.entities[j].id)

//                     const char = this.entities[i];
//                     const env = this.entities[j];
//                     if (char.id === "player") { playerCol = true }

//                     if (char.collisionSide(env) === "top") {
//                         if (char.entity.crouch && env.type === "platform"){
                            
//                         } else if (char.entity.vy >= 0) {
//                             char.entity.vy = 0;
//                             char.y = env.y - char.height
//                             console.log('top', env.id)
//                             char.grounded = true
//                         }
//                     } else if (char.collisionSide(env) === "right") {
//                         console.log('right', env.id)
//                         if (char.entity.vy > 0 && env.type === "platform") {
//                                char.x = env.x + env.width
//                         }
                        
//                     } else if (char.collisionSide(env) === "left") {
//                         //  console.log('left', env.id)
//                         console.log(char.x,env.x)
//                         if (char.entity.vy > 0 && env.type === "platform") {
//                             char.x = env.x - char.width
//                         }
//                     }
//                     if (env.type !== "platform") {
//                         if (char.collisionSide(env) === "bottom") {
//                             // console.log('bot', env.id)
//                             char.y = env.y + env.height
//                             char.entity.vy += 1
//                         }
//                     }
//                 }


//             }
//             return (playerCol)

//         }
//     }

//     const blackBox = document.getElementById('ground');
//     const platform = document.getElementById('platform');
//     const blackAABB = new AABBItem(blackBox, "environment")
//     const platAABB = new AABBItem(platform, "platform")
//     const playerAABB = new AABBItem(player, "character")
//     const colMan = new CollisionManager()
//     colMan.addEntity(playerAABB)
//     colMan.addEntity(blackAABB)
//     colMan.addEntity(platAABB)

//     const input = new InputHandler()
//     window.requestAnimationFrame(gameLoop)
//     // Pause game
//     window.addEventListener("keydown", function(e) {
//         if (e.key === "Escape") {
//             isPaused = !isPaused;
//             togglePauseMenu(isPaused);
//             if (isPaused) {
//                 pausedPlayerState = {
//                     velocity: player.velocity,
//                     position: player.position
//                 }
//             } else {
//                 if (pausedPlayerState) {
//                     player.velocity = pausedPlayerState.velocity;
//                     player.position = pausedPlayerState.position;
//                 }
//                 lastTime = performance.now();
//                 window.requestAnimationFrame(gameLoop)
//             }
//         }
//     });
// })


// function togglePauseMenu(isPaused) {
//     let pauseMenu = document.getElementById("pauseMenu");
//     pauseMenu.style.display = isPaused ? "flex" : "none";

//     const restartButton = document.querySelector(".restart");
//     const continueButton = document.querySelector(".continue");
//     if (isPaused) {
//         restartButton.addEventListener('click', handleRestart);
//         continueButton.addEventListener('click', handleContinue);
//     } else {
//         restartButton.removeEventListener('click', handleRestart);
//         continueButton.removeEventListener('click', handleContinue);
//     }
// }

// function handleContinue() {
//     console.log("Continue was pressed");
//     togglePauseMenu(false);
//     isPaused = false;
//     lastTime = performance.now();
//     window.requestAnimationFrame(gameLoop);
// }


// function handleRestart() {
//     console.log("Restart was pressed");
//     // Still needs functionality *TODO
// }