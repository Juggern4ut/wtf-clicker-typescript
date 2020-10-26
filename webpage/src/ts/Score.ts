class Score {
  scoreElement: HTMLElement;
  scorePerSecondsElement: HTMLElement;
  constructor(scoreElement: HTMLElement, scorePerSecondsElement: HTMLElement) {
    this.scoreElement = scoreElement;
    this.scorePerSecondsElement = scorePerSecondsElement;
  }

  updateScore(score, scorePerSecond) {
    this.scoreElement.innerHTML = window["numberWithCommas"](score.toFixed(2));
    this.scorePerSecondsElement.innerHTML = window["numberWithCommas"](scorePerSecond.toFixed(2));
  }
}
