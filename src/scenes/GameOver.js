export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        const gameScene = this.scene.get('Game');
        const finalScore = gameScene.score;

        this.cameras.main.setBackgroundColor(0xff0000);
        this.add.image(400, 250, 'background').setAlpha(0.5);

        this.add.text(400, 250, 'Game Over', { // game over 글씨
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(400, 350, `Final Score : ${finalScore}`, { // score
            fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        const restartButton = this.add.text(400, 500, 'Restart', { // 다시하기 버튼
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center',
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => this.scene.start('Game')); // 게임 씬으로 돌아가기
        restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#ff0' }));
        restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#fff' }));
    }
}
