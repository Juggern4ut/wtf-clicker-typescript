"use strict";
class Score {
    scoreElement;
    scorePerSecondsElement;
    constructor(scoreElement, scorePerSecondsElement) {
        this.scoreElement = scoreElement;
        this.scorePerSecondsElement = scorePerSecondsElement;
    }
    updateScore(score, scorePerSecond) {
        this.scoreElement.innerHTML = window["numberAsText"](score);
        this.scorePerSecondsElement.innerHTML = window["numberAsText"](scorePerSecond);
    }
}
