document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const bgTwo = document.querySelector('.bgTwo')
    const poodle = document.createElement('div')
    let poodleLeftSpace = 50
    let startPoint = 150
    let poodleBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId 
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0
    

    function createPoodle() {
        grid.appendChild(poodle)
        poodle.classList.add('poodle')
        poodleLeftSpace = platforms[0].left
        poodle.style.left = poodleLeftSpace + 'px'
        poodle.style.bottom = poodleBottomSpace + 'px'

    }
   
    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i =0; i < platformCount; i++) {
            let platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if (poodleBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            poodleBottomSpace += 20
            poodle.style.bottom = poodleBottomSpace + 'px'
            if (poodleBottomSpace > startPoint + 200) {
                fall()
            }
        },30)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function () {
            poodleBottomSpace -= 5
            poodle.style.bottom = poodleBottomSpace + 'px'
            if (poodleBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (poodleBottomSpace >= platform.bottom) &&
                    (poodleBottomSpace <= platform.bottom + 15) &&
                    ((poodleLeftSpace + 60) >= platform.left) &&
                    (poodleLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('Landed')
                    startPoint = poodleBottomSpace
                    jump()
                }
            })

        },30)
    }

    function newBackGround (element,background) {
        element.style.backgroundImage = "url("+background+")";
     }
    

    function gameOver() {
        console.log('Game Over')
        isGameOver = true
        newBackGround (grid, "/eee.gif")
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }

        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)

    }

    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }

    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (poodleLeftSpace >= 0) {
                poodleLeftSpace -= 5
                 poodle.style.left = poodleLeftSpace + 'px'
            } else moveRight()
        },30)
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval (leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true 
        rightTimerId = setInterval(function () {
            if (poodleLeftSpace <= 340) {
                poodleLeftSpace += 5
                poodle.style.left = poodleLeftSpace + 'px'
            } else moveLeft
        },30)
    }

    function moveStraight () {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start() {
        if (!isGameOver){
            createPlatforms()
            createPoodle()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup',control)
        }
    }
    //attach button
    start()

})