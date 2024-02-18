export default class Player {
    constructor(gameWidth, gameHeight, playerElem) {
        this.playerElem = playerElem
        this.speed = 0
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.width = playerElem.clientWidth;
        this.height = playerElem.clientHeight;
        this.y = gameHeight - this.height
        this.vy = 0
        this.gravity = 0.02;
    }

    get x() {
        return parseFloat(getComputedStyle(this.playerElem).getPropertyValue("--xCoord"));
    }
    set x(value) {
        this.playerElem.style.setProperty("--xCoord", Math.floor(value))
    }

    get y() {
        return parseFloat(getComputedStyle(this.playerElem).getPropertyValue("--yCoord"));
    }
    set y(value) {
        this.playerElem.style.setProperty("--yCoord", Math.floor(value))
    }


    update(value, delta) {

        const horizontalSpeed = 0.5;
        const jumpVelocity = -3;

        if (value.keys.indexOf('d') > -1) {
            this.playerElem.style.transform = 'scaleX(1)'
            this.speed = horizontalSpeed

        } else if (value.keys.indexOf('a') > -1) {
            this.playerElem.style.transform = 'scaleX(-1)'
            this.speed = -horizontalSpeed

        } else this.speed = 0


        if (value.keys.indexOf('w') > -1 && (this.onGround())) {
            this.vy = jumpVelocity
            this.AABB.grounded = false
           // console.log("JUMPING!")
        }

        //horizontal movement
        this.x += this.speed * delta
        if (this.x < 0) this.x = 0;
        else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width

        //vertical movement
        this.y += this.vy/2 * (delta)
        if (!this.onGround()) {
            this.vy += this.gravity/2 * (delta)
        } else { this.vy = 0 }
        if (this.y > this.gameHeight - this.height) {
            this.y = this.gameHeight - this.height
        }

    }
    onGround() {
        if (this.AABB.grounded) return true;
        return this.y >= this.gameHeight - this.height
    }
}