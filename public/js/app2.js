var score = 0;
var highscore = localStorage.getItem('highestscore');
var scoreText;
var highscoreText;
var KanyeJump = function() {};
KanyeJump.Play = function() {};

KanyeJump.Play.prototype = {

preload: function(){
  game.load.image('landscreen', 'img/landscreen.png');
  game.load.image('platform', 'img/platform-half.png')
  game.load.image('flatguy', 'img/newguy.png')
  game.load.image( 'pixel', 'img/pixel.png' );
  game.load.image( 'test', 'img/test.png' );
  game.load.audio('jump', 'sound/jump.wav');
  game.load.audio('lose', 'sound/lose.wav');

},


create: function(){
  // for background color
  this.stage.backgroundColor = "#6bf";

  // for scaling
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  this.scale.maxWidth = this.game.width;
  this.scale.maxHeight = this.game.height;
  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.scale.setScreenSize( true );

  // for game physics
  this.physics.startSystem(Phaser.Physics.ARCADE);

  // for camera tracking variables
  this.cameraYMin = 99999;
  this.platformYMin = 99999;


  // for creating platforms
  this.createPlatforms();

  // for player character
  this.playerCreate();

  // for enabling user controls
  this.cursor = this.input.keyboard.createCursorKeys();

  jump = game.add.audio('jump');
  lose = game.add.audio('lose');

  // for start screen
  game.paused = true;
    function startGame () {
      game.input.onDown.remove(startGame, this);
      logo.kill();
      game.paused = false;
    }
  logo = game.add.sprite(0, 0, 'landscreen');
  logo.fixedToCamera = true;
  logo.bringToTop();
  game.input.onDown.add(startGame, this);

  scoreText = game.add.text(10, 10, "High Score: " + highscore, { font: "18px Helvetica", fill: "#ffffff", align: "center" });


},



update: function(){
  // to adjust the y view to the highest point of the player
  this.world.setBounds(0, -this.player.yChange, this.world.width, this.game.height + this.player.yChange);

  // the built in camera allows movement in all directions. this is to disable it moving down
  this.cameraYMin = Math.min(this.cameraYMin, this.player.y - this.game.height + 250);
  this.camera.y = this.cameraYMin;

  this.physics.arcade.collide(this.player, this.platforms);
  this.playerMove();


  this.platforms.forEachAlive(function(elem) {
    this.platformYMin = Math.min(this.platformYMin, elem.y);
    if(elem.y > this.camera.y + this.game.height){
      elem.kill();
      this.addToScore();
      this.platformsCreateOne(this.rnd.integerInRange( 0, this.world.width-50), this.platformYMin - 100, 50);
    }
  }, this);
},

addToScore: function(){
  scoreText.fixedToCamera = true;
  scoreText.cameraOffset.setTo(20, 20);
  score += 10;
  scoreText.text = score;
  if (score>highscore){
    highscore = score;
    localStorage.setItem('highestscore', JSON.stringify(highscore));
  }
  // console.log(score);
},

shutdown: function(){
  // reset everything in the game
  this.world.setBounds(0,0, this.game.width, this.game.height);
  this.cursor = null;
  this.player.destroy();
  this.player = null;
  this.platforms.destroy();
  this.platforms = null;
  score = 0;
},

createPlatforms: function(){
  // platforms setup
  this.platforms = this.add.group();
  this.platforms.enableBody = true;
  this.platforms.createMultiple(10, 'pixel');

  this.platformsCreateOne(-56, this.world.height - 6, this.world.width + 16);
  // to repeatidly create platforms
  for(var i = 0; i<6; i++){
      this.platformsCreateOne(this.rnd.integerInRange(0, this.world.width - 50), this.world.height - 100 - 100 * i, 50);
  }
},

platformsCreateOne: function(x, y, width){
  var platform = this.platforms.getFirstDead();
  platform.reset(x,y);
  platform.scale.x = width * (Math.random() * (1.5-1) + 1)
  platform.scale.y = 10;
  platform.body.immovable = true;
  platform.body.collideWorldBounds = true;
  platform.body.bounce.setTo(1, 1);

  if(score< 200){
    platform.body.velocity.x = 0;      
  } else if (score > 200 && score<400){
    platform.body.velocity.x = Math.random() * (100 - 70) + 70;
  } else if (score > 400 && score<700){
    platform.body.velocity.x = Math.random() * (200 - 130) + 130;
  } else if(score > 700 && score <1000){
    platform.body.velocity.x = Math.random() * (300 - 220) + 220;
  } else if (score > 1000 && score < 1500){
    platform.body.velocity.x = Math.random() * (600 - 200) + 200;
  } else if(score > 1500 && score < 2200){
    platform.body.velocity.x = 800;
  } else if (score > 2200){
    platform.body.velocity.x = 1200;
  }
  return platform;
},

playerCreate: function(){
  // making the player
  this.player = game.add.sprite(this.world.centerX, this.world.height - 36, 'flatguy');
  this.player.anchor.set(0.5, 0.5);

  // player collision setup
  this.physics.arcade.enable(this.player);
  this.player.body.gravity.y = 470;
  this.player.body.checkCollision.up = false;
  this.player.body.checkCollision.left = false;
  this.player.body.checkCollision.right = false;
},

playerMove: function(){
  // allow movement with player
  if(this.cursor.left.isDown){
    this.player.body.velocity.x = -350;
  } else if(this.cursor.right.isDown){
    this.player.body.velocity.x = 350;
  } else{
    this.player.body.velocity.x = 0;
  }

  // allow jumping
  if(this.player.body.touching.down){
    // this.player.body.velocity.y = -450;
    this.player.body.velocity.y = (Math.random() * (520 - 400) +400) * -1;
    console.log(this.player.body.velocity.y);
    jump.play();
  }

  // allow player to horizontal world wrap
  this.world.wrap(this.player, this.player.width/2, false);

  // track maximum height player has reached
  this.player.yChange = Math.max(this.player.yChange, Math.abs(this.player.y - this.player.yOrig));

  // if player falls out of camera view, end game
  if(this.player.y > this.cameraYMin + this.game.height && this.player.alive){
    lose.play();
    this.state.start('Play');
  }
}



}


var game = new Phaser.Game(324,580,Phaser.CANVAS, 'game-screen');
game.state.add('Play', KanyeJump.Play);
game.state.start('Play');
