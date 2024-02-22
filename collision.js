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
    constructor() {
        this.entities = [];
    }
    addEntity(entity) {
        this.entities.push(entity)
        console.log("PUSHED: " + entity.type)

    }

    //checks collisions between all objects.
    checkAllCollision() {
        let playerCol = false;
        for (let i = 0; i < this.entities.length; i++) {
            for (let j = i + 1; j < this.entities.length; j++) {
                playerCol = this.handlePlayerCollision(i, j, playerCol)
            }
        }

    }



    handlePlayerCollision(i, j, playerCol) {
        let char;
        let env;
        if (this.entities[i].type === "character" &&
            (this.entities[j].type === "solid" ||
                this.entities[j].type === "platform")) {
            if (this.entities[i].id === "player") {
                 char = this.entities[i];
                 env = this.entities[j];
            }

            if (this.entities[i].checkCollision(this.entities[j])) {
                
                console.log(this.entities[i].id + " collided with: " + this.entities[j].id)

                playerCol = true

                if (char.collisionSide(env) === "top") {
                    console.log(`top collision: PLAYER: ${char.x};${char.y}, ENV: ${env.x};${env.y}`)
                    if (char.entity.crouch && env.type === "platform") {

                    } else if (char.entity.vy >= 0) {
                        console.log("TRAAAAAAAAAAAAAAA", playerCol)
                        char.entity.vy = 0;
                        char.y = env.y - char.height
                        console.log('top', env.id, char.height, env.y)
                        char.grounded = true
                    }
                } else if (char.collisionSide(env) === "right") {
                    // console.log(`right collision: PLAYER: X:${char.x};Y:${char.y}, ENV: X:${env.x};Y:${env.y}`)

                    if (char.entity.vy > 0 && env.type === "platform") {
                        char.x = env.x + env.width
                    } else if (env.type === "solid") {

                        char.x = env.x + env.width
                    }

                } else if (char.collisionSide(env) === "left") {
                    //console.log(`left collision: PLAYER: X:${char.x};Y:${char.y}, ENV: X:${env.x};Y:${env.y}`)

                    if (char.entity.vy > 0 && env.type === "platform") {
                        char.x = env.x - char.width
                    } else if (env.type === "solid") {

                        char.x = env.x - char.width
                    }
                }
                if (env.type !== "platform") {
                    if (char.collisionSide(env) === "bottom") {
                        //console.log(`bottom collision: PLAYER: X:${char.x};Y:${char.y}, ENV: X:${env.x};Y:${env.y}`)
                        // console.log('bot', env.id)
                        char.y = env.y + env.height
                        char.entity.vy += 1
                    }
                }
            }
            
            
            
            if (!playerCol && char !== undefined) {//if player has not collided with anything this frame then player is no longer grounded.
                char.grounded = false
            }
            return (playerCol)
        }

    }
}