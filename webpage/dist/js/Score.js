var Score = /** @class */ (function () {
    function Score(scoreElement, scorePerSecondsElement) {
        this.scoreElement = scoreElement;
        this.scorePerSecondsElement = scorePerSecondsElement;
    }
    Score.prototype.updateScore = function (score, scorePerSecond) {
        this.scoreElement.innerHTML = window["numberWithCommas"](score.toFixed(2));
        this.scorePerSecondsElement.innerHTML = window["numberWithCommas"](scorePerSecond.toFixed(2));
    };
    return Score;
}());
