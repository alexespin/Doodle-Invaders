var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var game = new Phaser.Game(config);
var gameOver = false;
var gameStarted = false;

var score = 0;

var speedMulti = 1;
var planeAnimationSpeed = 4;
var playerSpeed = 3;
var roll = 100;




var intStars;
var intBombs;
var intSpeed;

var endtimer;
var startTimer;
var boolTimer;

var bombs;

var keyDown = false;

var highScore = 0;

function preload ()
{
    gameOver = false;

    this.load.image('logo', 'assets/DoodleInvadersLogos.png')
    this.load.image('sky', 'assets/squared-paper-texture.avif');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('ammo', 'assets/ammo.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('rocket', 'assets/rocketSpriteSheet.png', { frameWidth: 127, frameHeight: 93})

    this.load.spritesheet('plane', 'assets/paper-airPlane.png', { frameWidth: 73, frameHeight: 47});
}

function create ()
{

    cursors = this.input.keyboard.createCursorKeys();


    sky = this.add.image(400, 300, 'sky');
    sky.setDisplaySize(800, 600);
    logo = this.add.image(400, 250, 'logo');
    logo.setDisplaySize(400, 250);

    player = this.physics.add.sprite(100, 300, 'plane')
    player.setSize(60,35,true);
    bullets = this.physics.add.group();
    bombs = this.physics.add.group();
    stars = this.physics.add.group();
    powerUps = this.physics.add.group();

    // animations
        // plane
    this.anims.create({
        key: 'roll',
        frames: this.anims.generateFrameNumbers('plane', {start: 8, end: 12}),
        framesRate: 5,
        repeat: -1
    })
    this.anims.create({
        key: 'turn',
        frames: [{key: 'plane', frame: 0}],
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('plane', {start: 1, end: 2 }),
        frameRate: planeAnimationSpeed,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('plane', {start: 3, end: 4 }),
        frameRate: planeAnimationSpeed,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('plane', {start: 5, end: 6 }),
        frameRate: planeAnimationSpeed,
        repeat: -1
    });

        // rocket
    this.anims.create({
        key: 'stop',
        frames: [{key: 'rocket', frame: 0}]
    })
    this.anims.create({
        key: 'rocket',
        frames: this.anims.generateFrameNumbers('rocket', { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
    });
    // colliders
    this.physics.add.collider(player, bombs, RocketHit, null, this);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player, powerUps, collectPowerUp, null, this);
    this.physics.add.collider(bombs, bullets, bulletHit, null, this);

    //UI
    startText = this.add.text(210, 450, 'click space to start', {
        fontSize: '32px',
        fill: '#000'
    })
    scoreText = this.add.text(300, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#000'
    });

    rollText = this.add.text(570, 16, 'sprint: 100', {
        fontSize: '32px',
        fill: '#000'
    });

    powerUpText = this.add.text(300, 500, 'POWER UP', {
        fontSize: '32px',
        fill: 'red'
    });
    gameOverText = this.add.text(300, 300, 'high score: ' + highScore, {
        fontSize: '32px',
        fill: '#000'
    })
    gameOverText.visible = false;
    powerUpText.visible = false;


}

function update ()
{

    if ( gameStarted == false) {
        scoreText.visible = false;
        rollText.visible = false;
        player.visible = false;

        if (cursors.space.isDown) {
            setInterval(() => {
                star
            }, 1000)
            startGame();
        }
        return;
    }
    // game started

    // UI update
    rollText.setText('sprint: ' + roll);
    scoreText.setText('score: ' + score);
    if (gameOver) {
        gameOverFunc()
        if (cursors.space.isDown) {
            startGame();
        }
        return
    }

    // keys
        // movement
    if (cursors.up.isDown && cursors.shift.isDown) {
        playerSpeed = 8;
        if (roll > 0){
            roll -= 5;
        }
        if (roll <= 0) {
            playerSpeed = 3;
        }
    }
    if (cursors.down.isDown && cursors.shift.isDown) {
        playerSpeed = 6;
        if (roll > 0){
            roll -= 4;
        }
        if (roll <= 0) {
            playerSpeed = 3;
        }
    }
    else if (cursors.shift.isUp) {
        if (roll < 100)
        roll ++;
        playerSpeed = 3
    }
    if (cursors.up.isDown)
    {
        player.anims.play('up', true);
        if (player.y < 25) {
            return
        }
        player.y += -playerSpeed;
    }
    else if (cursors.down.isDown)
    {
        player.anims.play('down', true);
        if (player.y > 575) {
            return
        }
        player.y += playerSpeed;
    }
    else {
        player.anims.play('idle', true);
    }
        // shooting
    if (cursors.space.isDown) {
        if (keyDown) {
            return
        }
        if (boolTimer == false) {
            shoot();
        }
        keyDown = true;
    }
    if (cursors.space.isUp) {
        keyDown = false;
    }

}

function startGame() {
    gameStarted = true;
    gameOver = false;

    intPowerUps = setInterval(addPowerUps, 10000);
    intStars = setInterval(addStars, 4000);
    intBombs = setInterval(addBomb, 2000);
    intSpeed = setInterval(increaseSpeed, 10000);

    scoreText.visible = true;
    rollText.visible = true;
    player.visible = true;

    logo.visible = false;
    startText.visible = false;
    gameOverText.visible = false;
}

function increaseSpeed() {
    speedMulti += 1;
}

function addStars(){
    var x = Phaser.Math.Between(0, 600)
    console.log("star");
    var star = stars.create(700, x, 'star');
    star.setVelocityX(-100)
}
function addPowerUps(){
    var x = Phaser.Math.Between(0, 600)
    console.log("power up");
    var powerUp = powerUps.create(700, x, 'ammo');
    powerUp.setVelocityX(-100)
}
var bomb;
function addBomb(){
    if (gameOver) {
        return
    }
    var x = Phaser.Math.Between(0, 600)
    console.log("bomb");
    bomb = bombs.create(700, x, 'rocket');
    bomb.setVelocityX(-100 * speedMulti);
    bomb.setSize(100,50,true);
    bomb.outOfBoundsKill= true;
    bomb.anims.play('rocket', true);
}
function shoot() {
    var playerX = player.x;
    var playerY = player.y;
    bullet = bullets.create(playerX + 50, playerY, 'bomb');
    bullet.setVelocityX(200);
}

function RocketHit() {
    gameOver = true;
    console.log('gameOver')
}
function collectStar(player, star) {
    score ++;
    star.disableBody(true, true);
}
function collectPowerUp(player, powerUp) {
    powerUp.disableBody(true, true);
    timer();
}
function timer() {
    powerUpText.visible = true;
    startTimer = setInterval(endTimer, 5000);
    boolTimer = false;
}
function endTimer() {
    powerUpText.visible = false;
    boolTimer = true;
    clearInterval(startTimer);
}
function bulletHit(bomb, bullet) {
    console.log('bulletHit');
    score += 5;
    bomb.disableBody(true, true);
    bullet.disableBody(true, true);
}

function gameOverFunc() {
    player.setVelocityX(0);
    clearInterval(intStars);
    clearInterval(intBombs);
    clearInterval(intSpeed);
    clearInterval(intPowerUps);
    bombs.clear(true);
    stars.clear(true);
    player.anims.play('turn', true);

    speedMulti = 1;
    if (score > highScore) {
        console.log(score)
        highScore = score;
    }
    gameOverText.visible = true;
    gameOverText.setText('high score: ' + highScore);

    score = 0;
}
