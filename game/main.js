var userDevice = WURFL.form_factor,
    game;

var gameConfig = {
    speed: 175,
    mainSpeed: 175,
    speedAcceleration: 300,
    jump: -275,
    gravity: 650,
    particles: 20,
    particleLifetime: 5000,
    particleMaxScale: .4,
    particleMinScale: .2,
    particlesCant: 30,
    particle: {
        amount: 15,
        lifetime: 5000,
        maxScale: .4,
        minScale: .2,
        gravity: 500,
        maxSpeed: 400,
        minSpeed: 150
        
    }
}

var oldSchool = {
    status: true,
    crtAlpa: .1,
    borderAlpha: .5
}

function createGame() {
    game = new Phaser.Game(window.innerWidth, 360, Phaser.AUTO);
    game.parent = 'game-container';
    game.transparent = true;
    game.resolution = window.devicePixelRatio / window.devicePixelRatio;
    game.state.add('level-1', stage.level1);
    game.state.add('level-2', stage.level2);
    game.state.add('menu', stage.menu);
    game.state.add('testLevel', stage.testLevel);

    game.state.start('menu');
}
 
function detectDevice() {
    
    if (userDevice == 'Desktop') {
        console.log('In desktop - create game');
        var _img = document.getElementById('hero-container');
        _img.style = 'pointer-events: none; display: none;'
        createGame();
    } else {
        console.log(`Can't create game`);
    }

    return;
    
}

detectDevice();
