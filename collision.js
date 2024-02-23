const gameWorld = document.getElementById('gameWorldWrapper')
const wrapperRect = gameWorld.getBoundingClientRect();
console.log(gameWorld)
export class AABBItem { //class to turn any object into a collidable.
    constructor(entity, type) {
        if (entity.id === 'player') {
            console.log(entity)
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
        const rect = this.elem.getBoundingClientRect();
        return rect.left + gameWorld.scrollLeft - wrapperRect.left



        /*  let rect = this.elem.getBoundingClientRect();
         //console.log(this.elem, rect.left)
         return rect.left; */
    }
    set x(value) {
        if (this.id === "player") {
            this.elem.style.setProperty("--xCoord", Math.floor(value))
        }
    }
    get y() {
        let rect = this.elem.getBoundingClientRect();
        return rect.top + gameWorld.scrollTop - wrapperRect.top;
    }
    set y(value) {
        if (this.id === "player") {
            this.elem.style.setProperty("--yCoord", Math.floor(value))
        }
    }

    //did we collide with 'other' entity?
    checkCollision(other) {
        return (
            (this.x + this.width) > other.x &&
            this.x < (other.x + other.width) &&
            this.y < (other.y + other.height) &&
            (this.y + this.height) > other.y
        )
    }
    //calculates which side of 'other' entity did current object collide with
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

    //displays x,y,height,width under game window
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

    //put this in game loop to update moveable objects' coordinates when debugging
    updateDebug() {

        this.debugY.textContent = "Y: " + this.y
        this.debugX.textContent = "X: " + this.x
    }
}


export class CollisionManager { // put all collidable objects into the manager
    constructor(player) {
        this.player = player
        this.entities = [];
    }
    addEntity(entity) {
        this.entities.push(entity)
        console.log("PUSHED: " + entity.type)

    }

    //checks collisions between all objects and player.
    checkAllCollision() {
        let playerCol = false;
        for (let i = 0; i < this.entities.length; i++) {

            playerCol = this.handlePlayerCollision(this.player, this.entities[i], playerCol)

        }

    }



    handlePlayerCollision(player, env, playerCol) {
        //console.log(player.id + " checking: " + env.id)
        if ((env.type === "solid" || env.type === "platform")) {

            if (player.checkCollision(env)) {

                //console.log(player.id + " collided with: " + env.id)

                playerCol = true

                if (player.collisionSide(env) === "top") {
                    //console.log(`top collision: PLAYER: ${player.x};${player.y}, ENV: ${env.x};${env.y}`)
                    if (player.entity.crouch && env.type === "platform") {

                    } else if (player.entity.vy >= 0) {
                        player.entity.vy = 0;
                        player.y = env.y - player.height
                        console.log('top', env.id, player.height, env.y)
                        player.grounded = true
                    }
                } else if (player.collisionSide(env) === "right") {
                    // console.log(`right collision: PLAYER: X:${player.x};Y:${player.y}, ENV: X:${env.x};Y:${env.y}`)

                    if (player.entity.vy > 0 && env.type === "platform") {
                        player.x = env.x + env.width
                    } else if (env.type === "solid") {

                        player.x = env.x + env.width
                    }

                } else if (player.collisionSide(env) === "left") {
                    //console.log(`left collision: PLAYER: X:${player.x};Y:${player.y}, ENV: X:${env.x};Y:${env.y}`)

                    if (player.entity.vy > 0 && env.type === "platform") {
                        player.x = env.x - player.width
                    } else if (env.type === "solid") {

                        player.x = env.x - player.width
                    }
                }
                if (env.type !== "platform") {
                    if (player.collisionSide(env) === "bottom") {
                        //console.log(`bottom collision: PLAYER: X:${player.x};Y:${player.y}, ENV: X:${env.x};Y:${env.y}`)
                        player.y = env.y + env.height
                        player.entity.vy += 1
                    }
                }
            }
            if (playerCol === false) {//if player has not collided with anything this frame then player is no longer grounded.
                player.grounded = false
            }
            return (playerCol)
        }

    }
}