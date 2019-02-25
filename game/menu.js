stage.menu = function () { };
stage.menu.prototype = {
    preload: function () {

    },
    create: function () {

        game.state.start('level-1');

    },
    resize: function () {
        game.scale.setGameSize(window.innerWidth, 360);
        this.centerX = this.game.width / 2;
        this.centerY = this.game.height / 2;
        console.log(this.game.width);
    },
    update: function () {

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