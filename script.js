import { bitmapObjects, generateWorld } from "./generateWorld.js";
import { readBitmap } from "./bitmapReader.js";
import Player from './player.js'
import { AABBItem, CollisionManager } from "./collision.js";
let lastTime;
let isPaused = false;
let update;

window.addEventListener('load', async function () {



    //    let objArr = await readBitmap("assets/level0bitmap.bmp")
    const game = document.getElementById('gameWorld');
    const player = new Player(game.offsetWidth, game.offsetHeight, document.getElementById("player"))
    const playerAABB = new AABBItem(player, "character")
    const colMan = new CollisionManager(playerAABB)
    //colMan.addEntity(playerAABB)


    let objArr = await readBitmap("assets/bmpbruh.bmp")


    let gameWorldElem = document.getElementById('gameWorld');

    generateWorld(objArr, gameWorldElem, colMan);

    // Initial vertical Scroll value
    let gameWorldWrapper = document.getElementById('gameWorldWrapper');
    gameWorldWrapper.scrollTop = player.y;
    let pausedPlayerState = null;
    // let lastTime
    const gameLoop = function (time) {
        if (!isPaused) {
            if (lastTime != null) {
                const delta = time - lastTime
                player.update(input, delta)
                colMan.checkAllCollision()
                // console.log(playerAABB.checkCollision(blackAABB))
            }
            lastTime = time
            window.requestAnimationFrame(gameLoop)
        }
    }

    class InputHandler {
        constructor() {
            this.keys = [];

            window.addEventListener("keydown", e => {
                //console.log(e.key)
                if ((e.key === "d" ||
                    e.key === "a" ||
                    e.key === "w" ||
                    e.key === "s" ||
                    e.key === " ")
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key)
                }

            })
            window.addEventListener("keyup", e => {
                if ((e.key === "d" ||
                    e.key === "a" ||
                    e.key === "w" ||
                    e.key === "s" ||
                    e.key === " ")) {
                    this.keys.splice(this.keys.indexOf(e.key), 1)

                }

            })
        }
    }

    class Enemy {
        constructor(enemyElem) {
            this.enemyElem = enemyElem;
            this.speed = 0;

        }
    }

    //if passing in entities other than player, use their html element



    const input = new InputHandler()
    window.requestAnimationFrame(gameLoop)
    // Pause game
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            isPaused = !isPaused;
            togglePauseMenu(isPaused);
            if (isPaused) {
                pausedPlayerState = {
                    velocity: player.velocity,
                    position: player.position
                }
            } else {
                if (pausedPlayerState) {
                    player.velocity = pausedPlayerState.velocity;
                    player.position = pausedPlayerState.position;
                }
                lastTime = performance.now();
                window.requestAnimationFrame(gameLoop)
            }
        }
    });



    function togglePauseMenu(isPaused) {
        let pauseMenu = document.getElementById("pauseMenu");
        pauseMenu.style.display = isPaused ? "flex" : "none";

        const restartButton = document.querySelector(".restart");
        const continueButton = document.querySelector(".continue");
        if (isPaused) {
            restartButton.addEventListener('click', handleRestart);
            continueButton.addEventListener('click', handleContinue);
        } else {
            restartButton.removeEventListener('click', handleRestart);
            continueButton.removeEventListener('click', handleContinue);
        }
    }

    function handleContinue() {
        console.log("Continue was pressed");
        togglePauseMenu(false);
        isPaused = false;
        lastTime = performance.now();
        window.requestAnimationFrame(gameLoop);
    }


    function handleRestart() {
        console.log("Restart was pressed");
        // Still needs functionality *TODO
    }
});












//window.addEventListener('load', function () {