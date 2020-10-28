class Score {
  scoreElement: HTMLElement;
  scorePerSecondsElement: HTMLElement;
  constructor(scoreElement: HTMLElement, scorePerSecondsElement: HTMLElement) {
    this.scoreElement = scoreElement;
    this.scorePerSecondsElement = scorePerSecondsElement;
  }

  updateScore(score, scorePerSecond) {
    this.scoreElement.innerHTML = window["numberAsText"](score);
    this.scorePerSecondsElement.innerHTML = window["numberAsText"](scorePerSecond);
  }
}
