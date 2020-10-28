var Score = /** @class */ (function () {
    function Score(scoreElement, scorePerSecondsElement) {
        this.scoreElement = scoreElement;
        this.scorePerSecondsElement = scorePerSecondsElement;
    }
    Score.prototype.updateScore = function (score, scorePerSecond) {
        this.scoreElement.innerHTML = window["numberAsText"](score);
        this.scorePerSecondsElement.innerHTML = window["numberAsText"](scorePerSecond);
    };
    return Score;
}());
