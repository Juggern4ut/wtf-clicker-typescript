var Score = /** @class */ (function () {
    function Score(scoreElement, scorePerSecondsElement) {
        this.scoreElement = scoreElement;
        this.scorePerSecondsElement = scorePerSecondsElement;
    }
    Score.prototype.updateScore = function (score, scorePerSecond) {
        var afterScoreComma = score < 1000 ? 2 : 0;
        var afterScorePerSecondComma = scorePerSecond < 1000 ? 2 : 0;
        this.scoreElement.innerHTML = window["numberWithCommas"](score.toFixed(afterScoreComma));
        this.scorePerSecondsElement.innerHTML = window["numberWithCommas"](scorePerSecond.toFixed(afterScorePerSecondComma));
    };
    return Score;
}());
