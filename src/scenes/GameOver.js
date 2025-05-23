export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        const gameScene = this.scene.get('Game');
        const finalScore = gameScene.score;

        // 최고 점수 불러오기
        const highScore = localStorage.getItem('highScore') || 0;

        this.cameras.main.setBackgroundColor(0xff0000);
        this.add.image(400, 250, 'background').setAlpha(0.5);

        this.add.text(400, 250, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(400, 330, `Final Score : ${finalScore}`, {
            fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // 최고 점수 표시
        this.add.text(400, 380, `High Score : ${highScore}`, {
            fontFamily: 'Arial Black', fontSize: 26, color: '#ffff00',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        const restartButton = this.add.text(400, 500, 'Restart', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => this.scene.start('Game'));
        restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#ff0' }));
        restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#fff' }));
    }
}