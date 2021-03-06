stage.testLevel = function () { };
var batAnims,
    batTween,
    fastWing,
    jumpButton,
    keyZ,
    jumpTimer = 0,
    canMove = true,
    isDead = false,
    reload = false,
    canCollide = true,
    timeOut,
    bat;

// var mydata = JSON.parse('testTile');


stage.testLevel.prototype = {
    preload: function () {
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.load.image('bird', './img/gameAssets/bluebird-upflap.png');

        this.load.tilemap('level-1', './assets/levels/level-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('bkg-scene', './assets/enviroment/bkg-scene.png')
        this.load.image('box-tiles', './assets/enviroment/box-tiles.png')


        // this.load.atlas('bat', './assets/bat/bird_atlas.png', './assets/bat/bird_atlas.json');
        this.load.atlas('bat', './assets/bat/bat-atlas.png', './assets/bat/bat-atlas.json');
        this.load.physics('physicsData', './assets/bat/sprites.json');

    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true); 
        game.physics.p2.gravity.y = 750;
        game.physics.p2.restitution = 0; //bouncing
        this.scale.pageAlignHorizontally = true;
        this.stage.disableVisibilityChange = true;

        // game.renderer.renderSession.roundPixels = true;
        // Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

        //VARIABLES
        this.centerX = this.game.width / 2;
        this.centerY = this.game.height / 2;
        this.speed = 200;
        canMove = true;
        isDead = false;
        //VARIABLES

        this.map = this.add.tilemap('level-1');
        this.map.addTilesetImage('bkg-scene');
        this.map.addTilesetImage('box-tiles');

        this.back1 = this.map.createLayer('back-1');
        this.back1.scrollFactorX = .70;

        this.clouds = this.map.createLayer('clouds-1');
        this.clouds.scrollFactorX = .75;

        this.clouds = this.map.createLayer('trees-1');
        this.clouds.scrollFactorX = .9;

        this.obstacles = this.map.createLayer('obstacles-1');
        this.map.setCollisionBetween(349, 360, true, 'obstacles-1');
        game.physics.p2.convertTilemap(this.map, this.obstacles);

        //BAT!!!
        this.bat = this.add.sprite(64, this.centerY, 'bat');
        this.bat.anchor.setTo(.5);
        this.bat.animations.add("fly", ['bat_0', 'bat_2', 'bat_1']/*Phaser.Animation.generateFrameNames('bat_', 0, 2)*/);
        fastWing = this.bat.animations.add("fast-wing", ['bat_0', 'bat_2', 'bat_1', 'bat_0', 'bat_2', 'bat_1', 'bat_0', 'bat_2', 'bat_1']);
        fastWing.onComplete.add(normalFly, this);
        this.bat.animations.add('death', ['bat_3']);
        this.bat.animations.play('fly', 5, true);
        batAnims = this.bat.animations; //add all animations to a global variable
        game.physics.p2.enable([this.bat], true);
        this.bat.body.fixedRotation = true;
        this.bat.body.clearShapes();
        this.bat.body.loadPolygon('physicsData', 'bat_1');
        
        batTween = game.add.tween(this.bat).to({ angle: 45 }, 1000, "Linear", false, 0, 0, false);

        this.bat.body.collideWorldBounds = true;
        bat = this.bat;

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

                this.bat.angle = 30;
                this.bat.body.angle = 30;
                this.bat.body.velocity.y = -400;
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

        // game.physics.arcade.collide(this.bat, this.obstacles, function () {
        //     if (canCollide) {
        //         console.log('column death')
        //         death();
        //     }
        // });

        // if (this.bat.body.blocked.up || this.bat.body.blocked.down) {
        //     if (canCollide) {
        //         console.log('bounds death');
        //         death();
        //     }
        // };

        if (this.bat.angle >= 0) {
            this.bat.angle -= 1;
            this.bat.body.angle -= 1;
        }

        if (canMove) { //ToDo: load logic to stop the bat when player loses
            this.bat.body.velocity.x = +this.speed;
        } else {
            this.bat.body.velocity.x = 0;
        }

    },
    render: function () {
        game.debug.body(this.bat);
    }
}
