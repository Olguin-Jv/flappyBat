stage = {};
stage.level1 = function () { };
var batAnims,
    batTween,
    fastWing,
    jumpButton,
    obstacles,
    keyZ,
    emitter,
    jumpTimer = 0,
    filterTween,
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
        this.load.image('backLayer-2', './assets/enviroment/backLayer-2.png');
        this.load.image('clouds-1', './assets/enviroment/clouds-1.png');
        this.load.image('tree-1', './assets/enviroment/tree-1.png');
        this.load.image('box-tiles', './assets/enviroment/box-tiles.png');

        this.load.image('crt', './phaser/crt.png');
        this.load.image('border', './phaser/border.png');
        this.load.image('greyBar', './phaser/greyBar.png');
        this.load.script('filter', './phaser/Pixelate.js');

        //particles
        this.load.image('chunk', './assets/enviroment/chunk.png');
        this.load.image('blackStar', './assets/bat/blackStar.png');
        this.load.image('blueStar', './assets/bat/blueStar.png');

        this.load.atlas('bat', './assets/bat/bat-atlas.png', './assets/bat/bat-atlas.json');
        this.load.atlas('coin', './assets/enviroment/coin.png', './assets/enviroment/coin.json');
        // game.load.spritesheet('coin', './assets/enviroment/coin.png', 128, 128, 21);

        // game.load.script('crt', 'https://cdn.jsdelivr.net/npm/pixi-filters@2.6.1/dist/pixi-filters.js');
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.scale.pageAlignHorizontally = true;
        this.stage.disableVisibilityChange = true;

        game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        //VARIABLES
        this.centerX = this.game.width / 2;
        this.centerY = this.game.height / 2;
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
        this.map.setCollisionBetween(1, 12, true, 'obstacles');

        ///COINS
        this.coins = game.add.group();
        this.coins.enableBody = true;

        this.map.createFromObjects('coins', 361, 'coin', 0, true, true, this.coins);
        this.coins.callAll('animations.add', 'animations', 'spin', Phaser.Animation.generateFrameNames('coin_', 0, 20), 10, true);
        this.coins.callAll('animations.play', 'animations', 'spin');




        //BAT!!!
        this.bat = this.add.sprite(64, this.centerY, 'bat');
        this.bat.anchor.setTo(.5);
        this.bat.scale.setTo(.75);

        game.physics.enable(this.bat)

        this.bat.body.gravity.y = gameConfig.gravity;
        this.bat.body.setSize(35, 60, 55, 15);
        this.bat.body.collideWorldBounds = true;
        //BAT ANIMATIONS
        this.bat.animations.add("fly", ['bat_0', 'bat_2', 'bat_1']);
        fastWing = this.bat.animations.add("fast-wing", ['bat_0', 'bat_2', 'bat_1', 'bat_0', 'bat_2', 'bat_1', 'bat_0', 'bat_2', 'bat_1']);
        fastWing.onComplete.add(normalFly, this);
        this.bat.animations.add('death', ['bat_3']);
        this.bat.animations.play('fly', 5, true);
        batAnims = this.bat.animations; //add all animations to a global variable
        //BAT TWEEN
        game.camera.follow(this.bat);
        bat = this.bat;


        //PARTICLE EMITTER
        emitter = game.add.emitter(0, 0, gameConfig.particle.amount);
        emitter.makeParticles(['blueStar', 'blackStar']);
        emitter.minRotation = -180;
        emitter.maxRotation = 180;
        emitter.maxParticleScale = gameConfig.particle.maxScale;
        emitter.minParticleScale = gameConfig.particle.minScale;

        emitter.maxSpeed = gameConfig.particle.maxSpeed;
        emitter.minSpeed = gameConfig.particle.minSpeed;
        emitter.minAngle = -45;
        emitter.maxAngle = -135;

        emitter.gravity = gameConfig.particle.gravity;
        emitter.bounce.setTo(0.5, 0.5);
        emitter.enableBody = true;
        game.physics.enable(emitter);

        var filter = game.add.filter('Pixelate', this.bat.width, this.bat.height);
        this.bat.filters = [filter];
        emitter.filters = [filter];



        filterTween = game.add.tween(filter).from({ sizeX: 15, sizeY: 15 }, 250, "Quad.easeInOut", false, 0, 0, true);


        game.world.setBounds(0, 0, this.map.width * this.map.tileWidth, this.map.height * this.map.tileHight)


        keyZ = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        keyZ.onDown.add(restartPosition, this);
        keyQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        keyQ.onDown.add(nextLevel, this);
        function nextLevel() {
            console.log('change to level 2')
            this.game.state.start('level-2', true, false)
        }


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
                gameConfig.speed = gameConfig.speedAcceleration;

                this.bat.angle = 45;
                this.bat.body.velocity.y = gameConfig.jump;

            }
        }

        // /////////////////////////-----------------
        if (oldSchool.status){
        this.crt = this.add.image(0, 0, 'crt');
        this.crt.alpha = oldSchool.crtAlpa;
        this.crt.width = this.game.width;
        this.crt.height = this.game.height;
        this.crt.fixedToCamera = true;

        this.greyBar = this.add.image(0, this.game.height, 'greyBar');
        this.greyBar.height = 50;
        this.greyBar.alpha = .1;

        this.border = this.add.image(0,0, 'border');
        this.border.width = this.game.width;
        this.border.alpha = oldSchool.borderAlpha;
        this.border.fixedToCamera = true;


        this.add.tween(this.greyBar).to({ y: -750 }, 17000, "Linear", true, 2500, -1, false);
        }
        // /////////////////////////-----------------



    },
    resize: function () {
        game.scale.setGameSize(window.innerWidth, 360);
        this.centerX = this.game.width / 2;
        this.centerY = this.game.height / 2;
        this.border.width = this.game.width;
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
        emitter.x = this.bat.x;
        emitter.y = this.bat.y - (this.bat.height / 2.5);
        game.physics.arcade.collide(emitter, obstacles);

        game.physics.arcade.collide(this.bat, obstacles, function () {
            if (canCollide) {
                console.log('column death');
                death();

            }
        });

        if (this.bat.body.blocked.up || this.bat.body.blocked.down) {
            if (canCollide) {
                console.log('bounds death');
                death();
            }
        };

        if (this.bat.angle >= 0) {
            this.bat.angle -= 1.5;
        }

        if (gameConfig.speed > gameConfig.mainSpeed) {
            gameConfig.speed -= 2.5;
        }

        if (canMove) {
            this.bat.body.velocity.x = +gameConfig.speed;
            if(oldSchool.status){
                this.greyBar.x = game.camera.x;
            }
        } else {
            this.bat.body.velocity.x = 0;
        }

    },
    render: function () {
        // game.debug.body(this.bat);
        // game.debug.cameraInfo(game.camera, 32, 32);
    }
}

function death() {
    if (!isDead && !reload) {

        emitter.start(true, gameConfig.particleLifetime, null, gameConfig.particles);
        filterTween.start();

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

function collisionHandler() {
    console.log(' ');
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