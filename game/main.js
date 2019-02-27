var userDevice = WURFL.form_factor,
    game;

var gameConfig = {
    gravity: 650
}

function createGame() {
    game = new Phaser.Game(window.innerWidth, 360, Phaser.AUTO);
    game.parent = 'game-container';
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