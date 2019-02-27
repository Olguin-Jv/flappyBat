stage = {};
stage.level1 = function () { };
var batAnims,
    batTween,
    fastWing,
    jumpButton,
    obstacles,
    keyZ,
    jumpTimer = 0,
    canMove = true,
    isDead = false,
    reload = false,
    canCollide = true,
    timeOut,
    bat;

// var mydata = JSON.parse('testTile');


stage.level1.prototype = {
    preload: function () {
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.load.image('bird', './img/gameAssets/bluebird-upflap.png');

        this.load.tilemap('level-1', './assets/levels/lvl1/level-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('backLayer-2', './assets/enviroment/backLayer-2.png')
        this.load.image('clouds-1', './assets/enviroment/clouds-1.png')
        this.load.image('tree-1', './assets/enviroment/tree-1.png')
        this.load.image('box-tiles', './assets/enviroment/box-tiles.png')


        // this.load.atlas('bat', './assets/bat/bird_atlas.png', './assets/bat/bird_atlas.json');
        this.load.atlas('bat', './assets/bat/bat-atlas.png', './assets/bat/bat-atlas.json');
        // this.load.physics('physicsData', './assets/bat/sprites.json');
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.scale.pageAlignHorizontally = true;
        this.stage.disableVisibilityChange = true;

        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

        //VARIABLES
        this.centerX = this.game.width / 2;
        this.centerY = this.game.height / 2;
        this.speed = 200;
        canMove = true;
        isDead = false;
        //VARIABLES

        this.map = this.add.tilemap('level-1');
        this.map.addTilesetImage('clouds-1');
        this.map.addTilesetImage('tree-1');
        this.map.addTilesetImage('backLayer-2');
        this.map.addTilesetImage('box-tiles');

        this.mountains = this.map.createLayer('backLayer-2');
        this.mountains.scrollFactorX = .50;

        this.clouds = this.map.createLayer('clouds-1');
        this.clouds.scrollFactorX = .65;

        this.clouds = this.map.createLayer('clouds-2');
        this.clouds.scrollFactorX = .75;

        this.trees = this.map.createLayer('tree-1');
        this.trees.scrollFactorX = .9;

        obstacles = this.map.createLayer('obstacles');
        this.map.setCollisionBetween(1, 11, true, 'obstacles');

        //BAT!!!
        this.bat = this.add.sprite(64, this.centerY, 'bat');
        this.bat.anchor.setTo(.5);
        this.bat.scale.setTo(.75);

        game.physics.enable(this.bat)

        this.bat.body.gravity.y = gameConfig.gravity;
        this.bat.body.setSize(35, 60, 55, 15);
        this.bat.body.collideWorldBounds = true;
        bat = this.bat;

        this.bat.animations.add("fly", ['bat_0', 'bat_2', 'bat_1']);
        fastWing = this.bat.animations.add("fast-wing", ['bat_0', 'bat_2', 'bat_1', 'bat_0', 'bat_2', 'bat_1', 'bat_0', 'bat_2', 'bat_1']);
        fastWing.onComplete.add(normalFly, this);
        this.bat.animations.add('death', ['bat_3']);
        this.bat.animations.play('fly', 5, true);
        batAnims = this.bat.animations; //add all animations to a global variable

        batTween = game.add.tween(this.bat).to({ angle: 45 }, 1000, "Linear", false, 0, 0, false);


        game.camera.follow(this.bat);
        game.world.setBounds(0, 0, this.map.width * this.map.tileWidth, this.map.height * this.map.tileHight)


        keyZ = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        keyZ.onDown.add(restartPosition, this);


        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpButton.onDown.add(upJump, this);

        keyUP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keyUP.onDown.add(upJump, this);

        function normalFly() {
            batAnims.play('fly', 5, true);

        }

        function upJump() {
            if (canMove) {
                batAnims.play('fast-wing', 25, false);

                this.bat.angle = 45;
                this.bat.body.angle = 45;
                this.bat.body.velocity.y = -275;
            }
        }

    },
    resize: function () {
        game.scale.setGameSize(window.innerWidth, 360);
        this.centerX = this.game.width / 2;
        this.centerY = this.game.height / 2;
        console.log(this.game.width);
    },
    center: function (elem, pos) {

        switch (pos) {
            case 'horizontal':
                elem.x = this.centerX;
                break;
            case 'center':
                elem.x = this.centerX;
                elem.y = this.centerY;
                break;
            default:
                break;
        }

    },
    elemData: function (elem) {
        console.log(`<<X ${elem.x}>><<Y ${elem.y}>> `);
    },
    startGame: function () {

    },
    update: function () {

        game.physics.arcade.collide(this.bat, obstacles, function () {
            if (canCollide) {
                console.log('column death')
                death();
            }
        });

        if (this.bat.body.blocked.up || this.bat.body.blocked.down) {
            if (canCollide) {
                console.log('bounds death');
                death();
            }
        };

        // if (this.bat.body.blocked.right) {
        //     alert('win');
        // };

        if (this.bat.angle >= 0) {
            this.bat.angle -= 1.5;
        }

        if (canMove) {
            this.bat.body.velocity.x = +this.speed;
        } else {
            this.bat.body.velocity.x = 0;
        }

    },
    render: function () {
        game.debug.body(this.bat);
    }
}

function death() {
    if (!isDead && !reload) {
        canMove = false;
        isDead = true;
        reload = true;
        canCollide = false;
        batAnims.play('death', 3, true);
        bat.angle = 20;
        console.log('death');
        bat.body.velocity.y = -275;
        game.camera.shake(0.005, 250);

        timeOut = setTimeout(function () {
            console.log('restart position')
            // restartPosition();
        }, 2000)
    }
}

function restartPosition() {
    console.log('restart position')
    clearTimeout(timeOut);
    reload = false;
    canMove = true;
    isDead = false;
    bat.angle = 0;
    batAnims.play('fly');
    bat.x = 64;
    bat.y = game.world.height / 2;
    setTimeout(function () {
        canCollide = true;
    }, 50);
}

//To-Do List:
/**
 * PROGRAMACIÓN:
 * -detener el movimiento del juego al perder.
 * -añadir algún efecto al perder (charlar con DG)
 * -al saltar agregar una animación donde el personaje aletee más rápido
 *
 * DISEÑO:
 * -ajustar tamaños de imágenes para poder crear el tileMap correctamente
 * -rediseñar y organizar los directorios y archivos.
 * -diseñar HUD
 * -diseñar menú inicial
 * -diseñar qué se mostrará al perder
 *
 * GENERAL:
 * -añadir contador de puntaje
 * -
 */