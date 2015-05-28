var KanyeJump = function() {};
KanyeJump.Play = function() {};

KanyeJump.Play.prototype = {


preload: function(){
  game.load.spritesheet('dude', 'img/dude.png', 32, 48);
  game.load.image('ground', 'img/ground2.png');
  game.load.image('platform', 'img/platform-half.png')

}

var ground;
var platforms;
var player;
var cursors;
var map;
var layer;

create: function(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.setBounds(0, 0, 400, 5000);


    // ---creating platforms---

  platforms = game.add.group();
  platforms = game.add.sprite('platform');
  platforms.name = 'platform';
  game.physics.enable(platforms, Phaser.Physics.ARCADE);
  platforms.body.collideWorldBounds = true;
  platforms.body.checkCollision.up = true;
  platforms.body.checkCollision.down = false;
  platforms.body.immovable = true;



  // var x = 0, y = 5000- 220;

  // while(y>200){
  //   var platform = platforms.create(x, y, 'platform');
  //   platform.body.allowGravity = false;

  //   var center = 400 / 2;

  //   if(x > center){
  //     x= Math.random() * center;
  //   } else {
  //     x = center + Math.random() * (center - 400);
  //   }
  //   y = y-200-100*Math.random();
  // }

  
  // ---MAKING THE GROUND---
  ground = game.add.sprite(0, game.world.height - 64, 'ground')
  ground.scale.setTo(1,1);
  game.physics.enable(ground, Phaser.Physics.ARCADE);


  // ---MAKING THE PLAYER---
  player = game.add.sprite(150, 4888, 'dude');
  game.physics.enable([player], Phaser.Physics.ARCADE);
  player.animations.stop();
  player.frame=4;

    // making the player physics
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 700;
  player.body.collideWorldBounds = true;

    // allow controls
  cursors = game.input.keyboard.createCursorKeys(); 
  game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
}



update: function(){
    // allows player to land on platforms
  game.physics.arcade.collide(player, platforms);

  player.body.velocity.x = 0;

  if(cursors.left.isDown){
    // move to the left
    player.body.velocity.x = -150;
    player.animations.play('left');
  } else if(cursors.right.isDown){
    // move to the right
    player.body.velocity.x = 150;
    player.animations.play('right');
  } else{
    // stand still
    player.animations.stop();
    player.frame = 4;
  }

  // allow the player to jump is they are touching the ground
    if (cursors.up.isDown){
    player.body.velocity.y = -650;
  }
}


render: function(){
      game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}

}