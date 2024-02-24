export default class Player {
    constructor(gameWidth, gameHeight, playerElem) {
        this.playerElem = playerElem
        this.id = 'player'
        this.speed = 0
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.width = playerElem.clientWidth;
        this.height = playerElem.clientHeight;
        this.y = gameHeight - this.height
        this.vy = 0
        this.gravity = 0.02;
        this.backgroundScroll = 0;
    }

    get x() {
        return parseFloat(getComputedStyle(this.playerElem).getPropertyValue("--xCoord"));
    }
    set x(value) {
        // console.log(value)
        this.playerElem.style.setProperty("--xCoord", Math.floor(value))


        //scrolling logic
        /* if (value < 545 && value > 365) {
            this.playerElem.style.setProperty("--xCoord", Math.floor(value))
        } else {
            if (value > 500) {
                this.ScrollGameRight();
            } else {
                this.ScrollGameLeft();
            }
        } */
    }

    get y() {
        return parseFloat(getComputedStyle(this.playerElem).getPropertyValue("--yCoord"));
    }
    set y(value) {
        this.playerElem.style.setProperty("--yCoord", Math.floor(value))
    }


    update(value, delta) {
       /*  if (this.playerElem.style.backgroundPositionX==="0px"){
        this.playerElem.style.backgroundPositionX = "32px"}
        else this.playerElem.style.backgroundPositionX="0px"
        // console.log("Relative pos:", this.relativePlayerPosition) */;

        const horizontalSpeed = 0.5;
        const jumpVelocity = -3;

        if (value.keys.indexOf('d') > -1) {
            this.playerElem.style.transform = 'scaleX(1)'
            this.speed = horizontalSpeed

        } else if (value.keys.indexOf('a') > -1) {
            this.playerElem.style.transform = 'scaleX(-1)'
            this.speed = -horizontalSpeed

        } else this.speed = 0


        if ((value.keys.indexOf('w') > -1 
          || value.keys.indexOf(' ') > -1) && (this.onGround())) {
            this.vy = jumpVelocity
            this.AABB.grounded = false
           // console.log("JUMPING!")
        }
        if (value.keys.indexOf('s') > -1) {
            this.crouch = true
           // console.log("JUMPING!")
        } else this.crouch = false;

        //horizontal movement
        this.x += this.speed * delta
        if (this.x <= 0) this.x = 0;


        //old scrolling logic
        //if (this.x <= 365) this.x = 366;
        //if (this.x >= 545) this.x = 544;
        
        if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width

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


    //scrolling logic
   /*  ScrollGameRight() {
        // console.log("scrolling right..")
        let gameObjects = document.querySelectorAll("#game .gameObject");
        gameObjects.forEach(function(elem) {
            let currentLeft = parseFloat(window.getComputedStyle(elem).left);
            let newLeft = currentLeft - 10;
            elem.style.left = newLeft + "px";
        });
        // scroll background
        let backgroundDiv = document.getElementById("background");
        this.backgroundScroll += 1.1
        backgroundDiv.style.backgroundPositionX = `${this.backgroundScroll}%`
    }

    ScrollGameLeft() {
        // console.log("scrolling left..")
        let gameObjects = document.querySelectorAll("#game .gameObject");
        gameObjects.forEach(function(elem) {
            let currentLeft = parseFloat(window.getComputedStyle(elem).left);
            let newLeft = currentLeft + 10;
            elem.style.left = newLeft + "px";
        });
        // scroll background
        let backgroundDiv = document.getElementById("background");
        this.backgroundScroll -= 1.1
        backgroundDiv.style.backgroundPositionX = `${this.backgroundScroll}%`
    } */
}
