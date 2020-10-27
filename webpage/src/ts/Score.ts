class Score {
  scoreElement: HTMLElement;
  scorePerSecondsElement: HTMLElement;
  constructor(scoreElement: HTMLElement, scorePerSecondsElement: HTMLElement) {
    this.scoreElement = scoreElement;
    this.scorePerSecondsElement = scorePerSecondsElement;
  }

  updateScore(score, scorePerSecond) {
    const afterScoreComma = score < 1000 ? 2 : 0;
    const afterScorePerSecondComma = scorePerSecond < 1000 ? 2 : 0;
    this.scoreElement.innerHTML = window["numberWithCommas"](score.toFixed(afterScoreComma));
    this.scorePerSecondsElement.innerHTML = window["numberWithCommas"](scorePerSecond.toFixed(afterScorePerSecondComma));
  }
}
