import Player from './player.js'

window.addEventListener('load', function () {
    const game = document.getElementById('game');
    const player = new Player(game.offsetWidth,game.offsetHeight,document.getElementById("player"))
    let lastTime
    function update(time) {
        if (lastTime != null) {
            const delta = time - lastTime
            player.update(input)
        }
        lastTime = time
        window.requestAnimationFrame(update)
    }

    console.log('yp')


    class InputHandler {
        constructor() {
            this.keys = [];

            window.addEventListener("keydown", e => {
                console.log(e.key)
                if ((e.key === "d" ||
                     e.key === "a" ||
                     e.key === "w" || 
                     e.key === "s" ) 
                     && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key)
                }

            })
            window.addEventListener("keyup", e => {
                if ((e.key === "d" ||
                     e.key === "a" ||
                     e.key === "w" || 
                     e.key === "s" )) {
                    this.keys.splice(this.keys.indexOf(e.key), 1)
             
                }

            })
        }
    }


    const input = new InputHandler()
    window.requestAnimationFrame(update)
})