import { Player } from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
  constructor() {
    super('Game');
    this.initialTime = 90;
    this.remainingTime = this.initialTime;
  }

  create() {
    // --------------------------------------------------------------------- sky(배경) 생성
    this.add.image(400, 300, 'sky');

    // --------------------------------------------------------------------- ground 생성
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // --------------------------------------------------------------------- player 생성
    this.player = new Player(this, 100, 450);
    this.physics.add.collider(this.player, this.platforms);

    // --------------------------------------------------------------------- star 생성
    this.stars = this.physics.add.group({ key: 'star', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 }}); // 70 간격으로 11번 반복(12개 생성)
    this.stars.children.iterate(child => child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))); // star bounce
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    // --------------------------------------------------------------------- score 생성
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
    
    // --------------------------------------------------------------------- highScore 생성 (최고 점수)
    this.highScore = localStorage.getItem('highScore') || 0;
    this.highScoreText = this.add.text(16, 48, 'High Score: ' + this.highScore, { fontSize: '24px', fill: '#000' });

    // --------------------------------------------------------------------- bomb 생성
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms); // bomb
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    // --------------------------------------------------------------------- level 생성(1부터 시작 / bomb 갯수가 늘 때마다 1씩 증가)
    this.level = 0;
    this.levelText = this.add.text(16, 80, 'Level: ' + (this.level + 1), { fontSize: '24px', fill: '#000' });

    // --------------------------------------------------------------------- timer 생성(initialTime: 90 / 1초마다 event 실행)
    this.initialTime = 90;
    this.remainingTime = this.initialTime;
    this.timerText = this.add.text(600, 16, 'Time: ' + this.initialTime, { fontSize: '32px', fill: '#000' });
    this.timerEvent = this.time.addEvent({ delay: 1000, callback: this.onSecond, callbackScope: this, loop: true });

    // --------------------------------------------------------------------- 키보드 이벤트
    this.cursors = this.input.keyboard?.createCursorKeys();
  }

  onSecond() { // timer 1초마다 decrease
    this.remainingTime--;
    this.timerText.setText('Time: ' + this.remainingTime);
    if (this.remainingTime <= 0) this.endGame();
  }

  update() { // keyboard Event
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

    if (this.score > this.highScore) { // 최고 점수 갱신  시
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

    this.physics.pause(); // 잠깐 멈췄다가 다시 정상화

    this.time.delayedCall(500, () => {
      player.clearTint();
      this.physics.resume();
    });

    if (this.remainingTime <= 0) this.endGame(); // 남은 초가 없는 경우 게임 종료
  }

  releaseBomb() {
    var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = this.bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    this.remainingTime = this.initialTime; // 남은 초 초기화
    this.timerText.setText('Time: ' + this.remainingTime);

    this.level++; // 레벨 업
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