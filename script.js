import Player from './player.js'

window.addEventListener('load', function () {
    const game = document.getElementById('game');
    const player = new Player(game.offsetWidth, game.offsetHeight, document.getElementById("player"))
    let lastTime
    function update(time) {
        if (lastTime != null) {
            const delta = time - lastTime
            player.update(input, delta)
            colMan.checkAllCollision()
            // console.log(playerAABB.checkCollision(blackAABB))
        }
        lastTime = time
        window.requestAnimationFrame(update)
    }


    class InputHandler {
        constructor() {
            this.keys = [];

            window.addEventListener("keydown", e => {
                console.log(e.key)
                if ((e.key === "d" ||
                    e.key === "a" ||
                    e.key === "w" ||
                    e.key === "s")
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key)
                }

            })
            window.addEventListener("keyup", e => {
                if ((e.key === "d" ||
                    e.key === "a" ||
                    e.key === "w" ||
                    e.key === "s")) {
                    this.keys.splice(this.keys.indexOf(e.key), 1)

                }

            })
        }
    }

    //if passing in entities other than player, use their html element
    class AABBItem {
        constructor(entity, type) {
            if (entity instanceof Player) {
                this.elem = document.getElementById("player")
                this.id = "player"; // for debug name
                this.width = entity.width;
                this.height = entity.height;
                entity.AABB = this
                this.entity = entity;
                this.grounded = false
            } else {
                this.elem = entity
                let rect = entity.getBoundingClientRect();
                this.id = entity.id;
                this.width = rect.right - rect.left;
                this.height = rect.bottom - rect.top;
            }
            this.type = type
            this.debug = null
            this.name = null;
            this.debugX = null;
            this.debugY = null;
        }


        get x() {
            let rect = this.elem.getBoundingClientRect();
            return rect.left;
        }
        set x(value) {
            if (this.id === "player") {
                this.elem.style.setProperty("--xCoord", Math.floor(value))
            }
        }
        get y() {
            let rect = this.elem.getBoundingClientRect();
            return rect.top;
        }
        set y(value) {
            if (this.id === "player") {
                this.elem.style.setProperty("--yCoord", Math.floor(value))
            }
        }

        checkCollision(other) {
            return (
                (this.x + this.width) > other.x &&
                this.x < (other.x + other.width) &&
                this.y < (other.y + other.height) &&
                (this.y + this.height) > other.y
            )
        }
        collisionSide(other) {
            const dx = (this.x + this.width / 2) - (other.x + other.width / 2);
            const dy = (this.y + this.height / 2) - (other.y + other.height / 2);
            const width = (this.width + other.width) / 2;
            const height = (this.height + other.height) / 2;
            const crossWidth = width * dy;
            const crossHeight = height * dx;

            if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
                if (crossWidth > crossHeight) {
                    return crossWidth > -crossHeight ? 'bottom' : 'left';
                } else {
                    return crossWidth > -crossHeight ? 'right' : 'top';
                }
            }
            return null;
        }

        addToDebug() {
            this.debug = document.getElementById('collisiondebug');
            this.name = document.createElement('p');
            this.debugX = document.createElement('p')
            this.debugY = document.createElement('p')
            let debugH = document.createElement('p')
            let debugW = document.createElement('p')
            this.name.textContent = this.id
            this.debugX.textContent = "X: " + this.x
            this.debugY.textContent = "Y: " + this.y
            debugH.textContent = "height: " + this.height
            debugW.textContent = "width: " + this.width
            this.debug.appendChild(this.name)
            this.name.appendChild(this.debugY)
            this.name.appendChild(this.debugX)
            this.name.appendChild(debugH)
            this.name.appendChild(debugW)
        }
        updateDebug() {

            this.debugY.textContent = "Y: " + this.y
            this.debugX.textContent = "X: " + this.x
        }
    }

    class CollisionManager {
        constructor() {
            this.entities = [];
        }
        addEntity(entity) {
            this.entities.push(entity)
            console.log("PUSHED: " + entity.id)
        }

        checkAllCollision() {
            let playerCol = false
            for (let i = 0; i < this.entities.length; i++) {
                for (let j = i + 1; j < this.entities.length; j++) {
                    if (this.entities[i] !== this.entities[j]) {
                        if (this.entities[i].checkCollision(this.entities[j])) {

                            console.log(this.entities[i].id + " collided with: " + this.entities[j].id)


                            if  (this.entities[i].type === "character" &&
                                (this.entities[j].type === "environment" ||
                                 this.entities[j].type === "platform")) {
                                const env = this.entities[j];
                                const char = this.entities[i];

                                if (char.id === "player") { playerCol = true }

                                if (char.collisionSide(env) === "top") {
                                    if (char.entity.vy >= 0) {
                                        char.y = env.y - char.height
                                        console.log('top', env.id)
                                        char.grounded = true
                                    }
                                }
                                if (env.type === "environment") {
                                    if (char.collisionSide(env) === "right") {
                                        console.log('right', env.id)
                                        char.x = env.x + env.width
                                    } else if (char.collisionSide(env) === "left") {
                                        console.log('left', env.id)
                                        char.x = env.x - char.width
                                    } else if (char.collisionSide(env) === "bottom") {
                                        console.log('bot', env.id)
                                        char.y = env.y + env.height
                                        char.entity.vy += 1
                                    }
                                }

                            }
                        }
                    }
                }
            }
            if (!playerCol) {
                player.AABB.grounded = false
            }
        }
    }



    const blackBox = document.getElementById('ground');
    const platform = document.getElementById('platform');
    const blackAABB = new AABBItem(blackBox, "environment")
    const platAABB = new AABBItem(platform, "platform")
    const playerAABB = new AABBItem(player, "character")
    const colMan = new CollisionManager()
    colMan.addEntity(playerAABB)
    colMan.addEntity(blackAABB)
    colMan.addEntity(platAABB)

    const input = new InputHandler()
    window.requestAnimationFrame(update)
})
