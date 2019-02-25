stage = {};
stage.level1 = function () { };
var batAnims,
    jumpButton,
    jumpTimer = 0,
    canMove = true,
    isDead = false,
    bat;

// var mydata = JSON.parse('testTile');


stage.level1.prototype = {
    preload: function () {
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.load.image('bird', './img/gameAssets/bluebird-upflap.png');

        this.load.tilemap('testTile', './assets/tiles/testTile.json', null, Phaser.Tilemap.TILED_JSON);
        // this.load.image('box', './assets/enviroment/box.png');
        this.load.image('bkg-1', './assets/enviroment/bkg-1.png');
        // this.load.image('bkg-2', './assets/enviroment/bkg-2.png');
        this.load.image('down-1', './assets/enviroment/down-1.png');

        this.load.atlas('bat', './assets/bat/bird_atlas.png', './assets/bat/bird_atlas.json');
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.scale.pageAlignHorizontally = true;
        this.stage.disableVisibilityChange = true;

        //VARIABLES
        this.centerX = this.game.width / 2;
        this.centerY = this.game.height / 2;
        this.speed = 200;
        //VARIABLES

        this.map = this.add.tilemap('testTile');
        this.map.addTilesetImage('down-1');
        this.map.addTilesetImage('bkg-1');

        this.bkg2 = this.map.createLayer('bkg-2');
        this.bkg2.scrollFactorX = .75;

        this.bkg1 = this.map.createLayer('bkg-1');
        this.bkg1.scrollFactorX = .9;

        this.boxes = this.map.createLayer('boxes');
        this.map.setCollisionBetween(1, 2, true, 'boxes')


        //BAT!!!
        this.bat = this.add.sprite(64, this.centerY, 'bat');
        this.bat.animations.add("fly", Phaser.Animation.generateFrameNames('bird_', 0, 2));
        this.bat.animations.add('death', Phaser.Animation.generateFrameNames('bird_', 3, 6));
        this.bat.animations.play('fly', 5, true);
        batAnims = this.bat.animations; //add all animations to a global variable
        game.physics.enable(this.bat)
        this.bat.body.gravity.y = 650;

        this.bat.body.collideWorldBounds = true;
        bat = this.bat;
        
        // this.bat.body.checkCollision.none = true;
        // this.bat.checkWorldBounds = true;
        // this.bat.events.onOutOfBounds.add(this.death, this);

        game.camera.follow(this.bat);
        game.world.setBounds(0, 0, this.map.width * this.map.tileWidth, this.map.height * this.map.tileHight)

        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },
    death: function(){
        if (!isDead){
            canMove = false;
            batAnims.play('death', 3, true);
            bat.angle = 20;
            bat.body.velocity.y = -275;
            isDead = true;
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

        game.physics.arcade.collide(this.bat, this.boxes, this.death);

        if(this.bat.body.blocked.up || this.bat.body.blocked.down){
            this.death();
        }

        if (canMove) { //ToDo: load logic to stop the bat when player loses
            this.bat.body.velocity.x = +this.speed;
        } else {
            this.bat.body.velocity.x = 0;
        }

        if (jumpButton.isDown && canMove && game.time.now > jumpTimer) {
            this.bat.body.velocity.y = -275; //250
            jumpTimer = game.time.now + 50;
        }

    }
}


//To-Do List:
/**
 * PROGRAMACIÓN:
 * -detener el movimiento del juego al perder.
 * -añadir algún efecto al perder (charlar con DG)
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

 //LEER LUEGO:
 /*
    mummy = game.add.sprite(200, 360, 'mummy', 5);
    mummy.scale.set(4);
    mummy.smoothed = false;
    anim = mummy.animations.add('walk');

    anim.onStart.add(animationStarted, this);
    anim.onLoop.add(animationLooped, this);
    anim.onComplete.add(animationStopped, this);

    anim.play(10, true);
  */