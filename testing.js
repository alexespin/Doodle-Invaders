class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('sky', 'assets/squared-paper-texture.avif');
        this.load.image('logo', 'assets/DoodleInvadersLogos.png');
    }

    create() {
        this.sky = this.add.image(400, 300, 'sky');
        this.sky.setDisplaySize(800, 600);
        this.logo = this.add.image(400, 250, 'logo');
        this.logo.setDisplaySize(400, 250);
        
        this.add.text(300, 500, 'Press SPACE to Start', { fontSize: '20px', fill: '#000' });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Level1');
        });
    }
}

class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
        this.gameOver = false;
        this.gameStarted = false;
        
        this.score = 0;

        this.speedMulti = 1;
        this.planeAnimationSpeed = 4;
        this.playerSpeed = 3;
        this.roll = 100;


        this.highScore = 0;

        this.player = null;
        this.cursors = null;
        this.bullets = null;
        this.bombs = null;
        this.stars = null;
        this.powerUps = null;
        this.bomb = null;


    }

    preload() {
        this.gameOver = false;

        this.load.image('logo', 'assets/DoodleInvadersLogos.png')
        this.load.image('sky', 'assets/squared-paper-texture.avif');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('ammo', 'assets/ammo.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('asteroid', 'assets/asteroid.png');

        this.load.spritesheet('plane', 'assets/paper-airPlane.png', { frameWidth: 73, frameHeight: 47});
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();


        this.sky = this.add.image(400, 300, 'sky');
        this.sky.setDisplaySize(800, 600);
        this.logo = this.add.image(400, 250, 'logo');
        this.logo.setDisplaySize(400, 250);
    
        this.player = this.physics.add.sprite(100, 300, 'plane')
        this.player.setSize(60,35,true);
        this.bullets = this.physics.add.group();
        this.bombs = this.physics.add.group();
        this.stars = this.physics.add.group();
        this.powerUps = this.physics.add.group();
    
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
            frameRate: this.planeAnimationSpeed,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('plane', {start: 3, end: 4 }),
            frameRate: this.planeAnimationSpeed,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('plane', {start: 5, end: 6 }),
            frameRate: this.planeAnimationSpeed,
            repeat: -1
        });
    
            // asteroid
        this.anims.create({
            key: 'stop',
            frames: [{key: 'asteroid', frame: 0}]
        })
        this.anims.create({
            key: 'asteroid',
            frames: this.anims.generateFrameNumbers('', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        // colliders
        this.physics.add.collider(this.player, this.bombs, this.RocketHit, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);
        this.physics.add.collider(this.bombs, this.bullets, this.bulletHit, null, this);
    
        //UI
        this.startText = this.add.text(210, 450, 'click space to start', {
            fontSize: '32px',
            fill: '#000'
        })
        this.scoreText = this.add.text(300, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
    
        this.rollText = this.add.text(570, 16, 'sprint: 100', {
            fontSize: '32px',
            fill: '#000'
        });
    
        this.powerUpText = this.add.text(300, 500, 'POWER UP', {
            fontSize: '32px',
            fill: 'red'
        });
        this.gameOverText = this.add.text(300, 300, 'high score: ' + this.highScore, {
            fontSize: '32px',
            fill: '#000'
        })
        this.gameOverText.visible = false;
        this.powerUpText.visible = false;
    }

    update() {
        if (this.gameStarted == false) {
            this.scoreText.visible = false;
            this.rollText.visible = false;
            this.player.visible = false;
    
                setInterval(() => {
                    this.star
                }, 1000)
                this.startGame();

            return;
        }
        // game started
    
        // UI update
        this.rollText.setText('sprint: ' + this.roll);
        this.scoreText.setText('score: ' + this.score);
        if (this.gameOver) {
            this.gameOverFunc();
            if (this.cursors.space.isDown) {
                this.startGame();
            }
            return
        }

        // point check
        if (this.score == 1) {
            this.scene.start('CutScene');
        }
    
        // keys
            // movement
        if (this.cursors.up.isDown && this.cursors.shift.isDown) {
            this.playerSpeed = 8;
            if (this.roll > 0){
                this.roll -= 5;
            }
            if (this.roll <= 0) {
                this.playerSpeed = 3;
            }
        }
        if (this.cursors.down.isDown && this.cursors.shift.isDown) {
            this.playerSpeed = 6;
            if (this.roll > 0){
                this.roll -= 4;
            }
            if (this.roll <= 0) {
                this.playerSpeed = 3;
            }
        }
        else if (this.cursors.shift.isUp) {
            if (this.roll < 100)
            this.roll ++;
            this.playerSpeed = 3
        }
        if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
            if (this.player.y < 25) {
                return
            }
            this.player.y += -this.playerSpeed;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
            if (this.player.y > 575) {
                return
            }
            this.player.y += this.playerSpeed;
        }
        else {
            this.player.anims.play('idle', true);
        }
            // shooting
        if (this.cursors.space.isDown) {
            if (this.keyDown) {
                return
            }
            if (this.boolTimer == false) {
                this.shoot();
            }
            this.keyDown = true;
        }
        if (this.cursors.space.isUp) {
            this.keyDown = false;
        }
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
    
        this.intPowerUps = setInterval(() => this.addPowerUps(), 10000);
        this.intStars = setInterval(() => this.addStars(), 4000);
        this.intBombs = setInterval(() => this.addBomb(), 2000);
        this.intSpeed = setInterval(() => this.increaseSpeed(), 10000);
    
        this.scoreText.visible = true;
        this.rollText.visible = true;
        this.player.visible = true;
    
        this.logo.visible = false;
        this.startText.visible = false;
        this.gameOverText.visible = false;
    }

    shoot() {
        let bullet = this.bullets.create(this.player.x + 50, this.player.y, 'bomb');
        bullet.setVelocityX(200);
    }

    increaseSpeed() {
        this.speedMulti += 1;
    }
    
    addStars(){
        if (!this.stars) {  // Check if this.stars exists
            console.error("this.stars is not initialized!");
            return;
        }

        let x = Phaser.Math.Between(0, 600)
        console.log(x)
        console.log("star");
        let star = this.stars.create(700, x, 'star');
        star.setVelocityX(-100)
    }
    addPowerUps(){
        var x = Phaser.Math.Between(0, 600)
        console.log("power up");
        var powerUp = this.powerUps.create(700, x, 'ammo');
        powerUp.setVelocityX(-100)
    }
    addBomb(){
        if (this.gameOver) {
            return
        }
        var x = Phaser.Math.Between(0, 600)
        console.log("bomb");
        var bomb = this.bombs.create(700, x, 'rocket');
        bomb.setVelocityX(-100 * this.speedMulti);
        bomb.setSize(100,50,true);
        bomb.outOfBoundsKill= true;
        bomb.anims.play('rocket', true);
    }
    shoot() {
        var playerX = this.player.x;
        var playerY = this.player.y;
        var bullet = this.bullets.create(playerX + 50, playerY, 'bomb');
        bullet.setVelocityX(200);
    }
    
    RocketHit() {
        this.gameOver = true;
        console.log('gameOver')
    }
    collectStar(player, star) {
        this.score ++;
        star.disableBody(true, true);
    }
    collectPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
        this.timer();
    }
    timer() {
        this.powerUpText.visible = true;
        this.startTimer = setInterval(() => this.endTimer(), 5000);
        this.boolTimer = false;
    }
    endTimer() {
        this.powerUpText.visible = false;
        this.boolTimer = true;
        clearInterval(this.startTimer);
    }
    bulletHit(bomb, bullet) {
        console.log('bulletHit');
        this.score += 5;
        bomb.disableBody(true, true);
        bullet.disableBody(true, true);
    }
    
    gameOverFunc() {
        this.player.setVelocityX(0);
        clearInterval(this.intStars);
        clearInterval(this.intBombs);
        clearInterval(this.intSpeed);
        clearInterval(this.intPowerUps);
        this.bombs.clear(true);
        this.stars.clear(true);
        this.player.anims.play('turn', true);
    
        this.speedMulti = 1;
        if (this.score > this.highScore) {
            console.log(this.score)
            this.highScore = this.score;
        }
        this.gameOverText.visible = true;
        this.gameOverText.setText('high score: ' + this.highScore);
    
        this.score = 0;
    }
}

 class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
        this.gameOver = false;
        this.gameStarted = false;
        
        this.score = 0;

        this.speedMulti = 1;
        this.planeAnimationSpeed = 4;
        this.playerSpeed = 3;
        this.roll = 100;


        this.highScore = 0;

        this.player = null;
        this.cursors = null;
        this.bullets = null;
        this.bombs = null;
        this.stars = null;
        this.powerUps = null;
        this.bomb = null;
    }

    preload() {
        this.gameOver = false;

        this.load.image('logo', 'assets/DoodleInvadersLogos.png')
        this.load.image('sky', 'assets/space.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('ammo', 'assets/ammo.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('rocket', 'assets/rocketSpriteSheet.png', { frameWidth: 127, frameHeight: 93})

        this.load.spritesheet('plane', 'assets/paper-airPlane.png', { frameWidth: 73, frameHeight: 47});
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();


        this.sky = this.add.image(400, 300, 'sky');
        this.sky.setDisplaySize(800, 600);
        this.logo = this.add.image(400, 250, 'logo');
        this.logo.setDisplaySize(400, 250);
    
        this.player = this.physics.add.sprite(100, 300, 'plane')
        this.player.setSize(60,35,true);
        this.bullets = this.physics.add.group();
        this.bombs = this.physics.add.group();
        this.stars = this.physics.add.group();
        this.powerUps = this.physics.add.group();
    
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
            frameRate: this.planeAnimationSpeed,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('plane', {start: 3, end: 4 }),
            frameRate: this.planeAnimationSpeed,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('plane', {start: 5, end: 6 }),
            frameRate: this.planeAnimationSpeed,
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
        this.physics.add.collider(this.player, this.bombs, this.RocketHit, null, this);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);
        this.physics.add.collider(this.bombs, this.bullets, this.bulletHit, null, this);
    
        //UI
        this.startText = this.add.text(210, 450, 'click space to start', {
            fontSize: '32px',
            fill: '#000'
        })
        this.scoreText = this.add.text(300, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
    
        this.rollText = this.add.text(570, 16, 'sprint: 100', {
            fontSize: '32px',
            fill: '#000'
        });
    
        this.powerUpText = this.add.text(300, 500, 'POWER UP', {
            fontSize: '32px',
            fill: 'red'
        });
        this.gameOverText = this.add.text(300, 300, 'high score: ' + this.highScore, {
            fontSize: '32px',
            fill: 'white'
        })
        this.gameOverText.visible = false;
        this.powerUpText.visible = false;
    }

    update() {
        if (this.gameStarted == false) {
            this.scoreText.visible = false;
            this.rollText.visible = false;
            this.player.visible = false;
    
                setInterval(() => {
                    this.star
                }, 1000)
                this.startGame();

            return;
        }
        // game started
    
        // UI update
        this.rollText.setText('sprint: ' + this.roll);
        this.scoreText.setText('score: ' + this.score);
        if (this.gameOver) {
            this.gameOverFunc();
            if (this.cursors.space.isDown) {
                this.startGame();
            }
            return
        }
    
        // keys
            // movement
        if (this.cursors.up.isDown && this.cursors.shift.isDown) {
            this.playerSpeed = 8;
            if (this.roll > 0){
                this.roll -= 5;
            }
            if (this.roll <= 0) {
                this.playerSpeed = 3;
            }
        }
        if (this.cursors.down.isDown && this.cursors.shift.isDown) {
            this.playerSpeed = 6;
            if (this.roll > 0){
                this.roll -= 4;
            }
            if (this.roll <= 0) {
                this.playerSpeed = 3;
            }
        }
        else if (this.cursors.shift.isUp) {
            if (this.roll < 100)
            this.roll ++;
            this.playerSpeed = 3
        }
        if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
            if (this.player.y < 25) {
                return
            }
            this.player.y += -this.playerSpeed;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
            if (this.player.y > 575) {
                return
            }
            this.player.y += this.playerSpeed;
        }
        else {
            this.player.anims.play('idle', true);
        }
            // shooting
        if (this.cursors.space.isDown) {
            if (this.keyDown) {
                return
            }
            if (this.boolTimer == false) {
                this.shoot();
            }
            this.keyDown = true;
        }
        if (this.cursors.space.isUp) {
            this.keyDown = false;
        }
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
    
        this.intPowerUps = setInterval(() => this.addPowerUps(), 10000);
        this.intStars = setInterval(() => this.addStars(), 4000);
        this.intBombs = setInterval(() => this.addBomb(), 2000);
        this.intSpeed = setInterval(() => this.increaseSpeed(), 10000);
    
        this.scoreText.visible = true;
        this.rollText.visible = true;
        this.player.visible = true;
    
        this.logo.visible = false;
        this.startText.visible = false;
        this.gameOverText.visible = false;
    }

    shoot() {
        let bullet = this.bullets.create(this.player.x + 50, this.player.y, 'bomb');
        bullet.setVelocityX(200);
    }

    increaseSpeed() {
        this.speedMulti += 1;
    }
    
    addStars(){
        if (!this.stars) {  // Check if this.stars exists
            console.error("this.stars is not initialized!");
            return;
        }

        let x = Phaser.Math.Between(0, 600)
        console.log(x)
        console.log("star");
        let star = this.stars.create(700, x, 'star');
        star.setVelocityX(-100)
    }
    addPowerUps(){
        var x = Phaser.Math.Between(0, 600)
        console.log("power up");
        var powerUp = this.powerUps.create(700, x, 'ammo');
        powerUp.setVelocityX(-100)
    }
    addBomb(){
        if (this.gameOver) {
            return
        }
        var x = Phaser.Math.Between(0, 600)
        console.log("bomb");
        var bomb = this.bombs.create(700, x, 'rocket');
        bomb.setVelocityX(-100 * this.speedMulti);
        bomb.setSize(100,50,true);
        bomb.outOfBoundsKill= true;
        bomb.anims.play('rocket', true);
    }
    shoot() {
        var playerX = this.player.x;
        var playerY = this.player.y;
        var bullet = this.bullets.create(playerX + 50, playerY, 'bomb');
        bullet.setVelocityX(200);
    }
    
    RocketHit() {
        this.gameOver = true;
        console.log('gameOver')
    }
    collectStar(player, star) {
        this.score ++;
        star.disableBody(true, true);
    }
    collectPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
        this.timer();
    }
    timer() {
        this.powerUpText.visible = true;
        this.startTimer = setInterval(() => this.endTimer(), 5000);
        this.boolTimer = false;
    }
    endTimer() {
        this.powerUpText.visible = false;
        this.boolTimer = true;
        clearInterval(this.startTimer);
    }
    bulletHit(bomb, bullet) {
        console.log('bulletHit');
        this.score += 5;
        bomb.disableBody(true, true);
        bullet.disableBody(true, true);
    }
    
    gameOverFunc() {
        this.player.setVelocityX(0);
        clearInterval(this.intStars);
        clearInterval(this.intBombs);
        clearInterval(this.intSpeed);
        clearInterval(this.intPowerUps);
        this.bombs.clear(true);
        this.stars.clear(true);
        this.ammo.clear(true);
        this.player.anims.play('turn', true);
    
        this.speedMulti = 1;
        if (this.score > this.highScore) {
            console.log(this.score)
            this.highScore = this.score;
        }
        this.gameOverText.visible = true;
        this.gameOverText.setText('high score: ' + this.highScore);
    
        this.score = 0;
    }
}

class CutScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CutScene' });
    }

    preload() {
        this.load.image('sky', 'assets/squared-paper-texture.avif');
        this.load.image('logo', 'assets/DoodleInvadersLogos.png');
    }

    create() {
        this.sky = this.add.image(400, 300, 'sky');
        this.sky.setDisplaySize(800, 600);
        this.logo = this.add.image(400, 250, 'logo');
        this.logo.setDisplaySize(400, 250);
        
        this.add.text(300, 500, 'Press SPACE to Start', { fontSize: '20px', fill: '#000' });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Level1');
        });
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [MenuScene, Level1, CutScene, Level2]

};

var game = new Phaser.Game(config);
