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
        this.relativePlayerPosition = 0;
    }

    get x() {
        return parseFloat(getComputedStyle(this.playerElem).getPropertyValue("--xCoord"));
    }
    set x(value) {
        if (value < 555 && value > 355) {
            this.playerElem.style.setProperty("--xCoord", Math.floor(value))
        } else {
            if (value > 500) {
                this.ScrollGameRight();
            } else {
                this.ScrollGameLeft();
            }
        }
    }

    get y() {
        return parseFloat(getComputedStyle(this.playerElem).getPropertyValue("--yCoord"));
    }
    set y(value) {
        this.playerElem.style.setProperty("--yCoord", Math.floor(value))
    }


    update(value, delta) {
        console.log("Relative pos:", this.relativePlayerPosition);

        const horizontalSpeed = 0.5;
        const jumpVelocity = -3;

        if (value.keys.indexOf('d') > -1) {
            this.playerElem.style.transform = 'scaleX(1)'
            this.speed = horizontalSpeed
            this.relativePlayerPosition += 1;

        } else if (value.keys.indexOf('a') > -1) {
            this.playerElem.style.transform = 'scaleX(-1)'
            this.speed = -horizontalSpeed
            this.relativePlayerPosition -= 1;

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

    ScrollGameRight() {
        console.log("scrolling right..")
        let gameObjects = document.querySelectorAll("#game .gameObject");
        gameObjects.forEach(function(elem) {
            let currentLeft = parseFloat(window.getComputedStyle(elem).left);
            let newLeft = currentLeft - 10;
            elem.style.left = newLeft + "px";
        });
    }

    ScrollGameLeft() {
        console.log("scrolling left..")
        let gameObjects = document.querySelectorAll("#game .gameObject");
        gameObjects.forEach(function(elem) {
            let currentLeft = parseFloat(window.getComputedStyle(elem).left);
            let newLeft = currentLeft + 10;

            elem.style.left = newLeft + "px";
        });

    }
}
