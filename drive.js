let mainLoop = null;
let deltaTimeSec = 0.01;
let redDot = null;
let dotSpeed = 500;
let obstacleSpeed = 200;
let left = false;
let right = false;
let up = false;
let down = false;
let currentLeftPosition = null;
let currentTopPosition = null;
let fromTop = 0;
let mainContainer = null;
let obstacles = [];
let holeHeight = 400;
let screenDensity = 0.2;
let timePlaying = 0;


(function () {
    mainContainer = document.getElementById('mainContainer');
    redDot = document.getElementById('redDot');

    document.getElementById('startGame').onclick = () => {
        startGame();
    }

    document.getElementById('pauseGame').onclick = () => {
        pauseGame();
    }

    document.getElementById('resumeGame').onclick = () => {
        pauseGame();
    }

    window.addEventListener('keydown', (event) => {
        if (event.keyCode === 37) {
            left = true;
        } else if (event.keyCode === 39) {
            right = true;
        } else if (event.keyCode === 38) {
            up = true;
        } else if (event.keyCode === 40) {
            down = true;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.keyCode === 37) {
            left = false;
        } else if (event.keyCode === 39) {
            right = false;
        } else if (event.keyCode === 38) {
            up = false;
        } else if (event.keyCode === 40) {
            down = false;
        }
    });

    currentLeftPosition = 20;
    currentTopPosition = (mainContainer.offsetHeight / 2) - (redDot.offsetHeight / 2);

    redDot.style.left = currentLeftPosition + 'px';
    redDot.style.top = currentTopPosition + 'px';


})();

function mainLoopTick(deltaTime) {
    if (left && !right) {
        currentLeftPosition -= dotSpeed * deltaTime;

        if (currentLeftPosition <= 0) {
            currentLeftPosition = 0;
        }

    } else if (right && !left) {
        currentLeftPosition += dotSpeed * deltaTime;

        if (currentLeftPosition >= (mainContainer.offsetWidth - redDot.offsetWidth)) {
            currentLeftPosition = mainContainer.offsetWidth - redDot.offsetWidth;
        }
    }

    if (up && !down) {
        currentTopPosition -= dotSpeed * deltaTime;

        if (currentTopPosition <= fromTop) {
            currentTopPosition = fromTop;
        }
    } else if (down && !up) {
        currentTopPosition += dotSpeed * deltaTime;

        if (currentTopPosition >= (mainContainer.offsetHeight - redDot.offsetHeight)) {
            currentTopPosition = (mainContainer.offsetHeight - redDot.offsetHeight);
        }
    }

    obstacles.forEach((element, index) => {
        let newPosition = (parseFloat(element.style.left) - obstacleSpeed * deltaTime);
        let obstacleWidth = parseFloat(element.style.width);

        if (index === obstacles.length - 1) {
            let showObstacle = mainContainer.offsetWidth - mainContainer.offsetWidth * screenDensity;

            if (newPosition < showObstacle) {
                createObstacle();
            }
        }

        if (newPosition < -obstacleWidth) {
            element.parentElement.removeChild(element);
            obstacles.splice(index, 1);

            screenDensity = Math.max(0.05, screenDensity - 0.002);

        } else {
            element.style.left = newPosition + 'px';
        }

    });

    obstacles.forEach((element) => {
        if (isBoxCollision(redDot, element)) {
            clearInterval(mainLoop);

            mainLoop = null;
            document.getElementById('you-lose').classList.remove('hidden');
        }
    });

    timePlaying = timePlaying + deltaTime;

    document.getElementsByClassName('time-playing')[0].innerHTML = timePlaying.toFixed(2) + ' sec';



    redDot.style.left = currentLeftPosition + 'px';
    redDot.style.top = currentTopPosition + 'px';
}

function startGame() {
    if (mainLoop !== null) {
        return
    }

    timePlaying = 0;

    obstacles.forEach((element) => {
        element.parentElement.removeChild(element);
    });

    obstacles = [];

    screenDensity = 0.2;

    currentLeftPosition = 20;
    currentTopPosition = (mainContainer.offsetHeight / 2) - (redDot.offsetHeight / 2); 

    createObstacle();

    mainLoop = setInterval(() => {
        mainLoopTick(deltaTimeSec);
    }, deltaTimeSec * 1000);

    document.getElementById('pauseGame').classList.remove('hidden');
    document.getElementById('resumeGame').classList.add('hidden');
    document.getElementById('you-lose').classList.add('hidden');
}

function pauseGame() {
    if (mainLoop !== null) {
        clearInterval(mainLoop);

        document.getElementById('pauseGame').classList.add('hidden');
        document.getElementById('resumeGame').classList.remove('hidden');

        mainLoop = null;
    } else {
        mainLoop = setInterval(() => {
            mainLoopTick(deltaTimeSec);
        }, deltaTimeSec * 1000);

        document.getElementById('pauseGame').classList.remove('hidden');
        document.getElementById('resumeGame').classList.add('hidden');
    }
}

function isBoxCollision(a, b) {

    return !(
        ((parseFloat(a.style.top, 10) + a.offsetHeight) < parseFloat(b.style.top, 10)) ||
        (parseFloat(a.style.top, 10) > (parseFloat(b.style.top, 10) + b.offsetHeight)) ||
        ((parseFloat(a.style.left, 10) + a.offsetWidth) < parseFloat(b.style.left, 10)) ||
        (parseFloat(a.style.left, 10) > (parseFloat(b.style.left, 10) + b.offsetWidth))
    );
}

function getRandomFloat(max) {
    return Math.random() * max;
}

function createObstacle() {
    let randomHolePosition = getRandomFloat(mainContainer.offsetHeight - holeHeight);
    let topHeight = randomHolePosition;
    let bottomTop = holeHeight + randomHolePosition;
    let bottomHeight = mainContainer.offsetHeight - bottomTop;

    let obstacleTop = document.getElementById('obstacle-template').cloneNode();
    let obstacleBottom = document.getElementById('obstacle-template').cloneNode();

    obstacleTop.removeAttribute('id');
    obstacleTop.style.width = '20px';
    obstacleTop.style.display = 'block';
    obstacleTop.style.left = mainContainer.offsetWidth + 'px';
    obstacleTop.style.top = '0';
    obstacleTop.style.height = topHeight + 'px';

    obstacleBottom.removeAttribute('id');
    obstacleBottom.style.width = '20px';
    obstacleBottom.style.display = 'block';
    obstacleBottom.style.left = mainContainer.offsetWidth + 'px';
    obstacleBottom.style.top = bottomTop + 'px';
    obstacleBottom.style.height = bottomHeight + 'px';

    mainContainer.appendChild(obstacleTop);
    mainContainer.appendChild(obstacleBottom);

    obstacles.push(obstacleTop, obstacleBottom);
}