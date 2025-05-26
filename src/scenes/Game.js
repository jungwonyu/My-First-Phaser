import { Player } from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.initialTime = 90;
        this.remainingTime = this.initialTime;
    }

    create() {
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = new Player(this, 100, 450);

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard?.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
        
        this.highScore = localStorage.getItem('highScore') || 0;  // 최고 점수 로드
        this.highScoreText = this.add.text(16, 48, 'High Score: ' + this.highScore, { fontSize: '24px', fill: '#000' });

        this.bombs = this.physics.add.group();

        this.level = 0;
        this.levelText = this.add.text(16, 80, 'Level: ' + (this.level + 1), { fontSize: '24px', fill: '#000' });

        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.initialTime = 90;
        this.remainingTime = this.initialTime;
        this.timerText = this.add.text(600, 16, 'Time: ' + this.initialTime, {
            fontSize: '32px',
            fill: '#000'
        });
        this.timerEvent = this.time.addEvent({
            delay: 1000, // 1초마다
            callback: this.onSecond,
            callbackScope: this,
            loop: true
        });
    }

    onSecond() {
        this.remainingTime--;

        this.timerText.setText('Time: ' + this.remainingTime);

        if (this.remainingTime <= 0) {
            this.endGame();
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.moveLeft();
        } else if (this.cursors.right.isDown) {
            this.player.moveRight();
        } else {
            this.player.idle();
        }

        if (this.cursors.up.isDown) {
            this.player.jump();
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // 최고 점수 갱신   
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            this.highScoreText.setText('High Score: ' + this.highScore);
        }

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            this.releaseBomb();
        }
    }

    hitBomb(player, bomb) {
        this.remainingTime = Math.max(this.remainingTime - 10, 0);
        this.timerText.setText('Time: ' + this.remainingTime);

        player.setTint(0xff0000);
        player.anims.play('turn');

        // 잠깐 멈췄다가 다시 정상화
        this.physics.pause();

        this.time.delayedCall(500, () => {
            player.clearTint();
            this.physics.resume();
        });

        if (this.remainingTime <= 0) {
            this.endGame();
        }
    }

    releaseBomb() {
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        this.remainingTime = this.initialTime;
        this.timerText.setText('Time: ' + this.remainingTime);

        this.level++;
        this.levelText.setText('Level: ' + (this.level + 1));
    }

    endGame() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOver');
        });
    }
}