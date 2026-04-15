/**
 * Updates the score display.
 */
export class Score {
  scoreElement: HTMLElement;
  scorePerSecondsElement: HTMLElement;

  /**
   * Creates a new score display helper.
   * @param scoreElement The main score element.
   * @param scorePerSecondsElement The score-per-second element.
   */
  constructor(scoreElement: HTMLElement, scorePerSecondsElement: HTMLElement) {
    this.scoreElement = scoreElement;
    this.scorePerSecondsElement = scorePerSecondsElement;
  }

  /**
   * Updates the displayed score values.
   * @param score The current total score.
   * @param scorePerSecond The current score per second.
   */
  updateScore(score: number, scorePerSecond: number): void {
    this.scoreElement.innerHTML = window.numberAsText(score);
    this.scorePerSecondsElement.innerHTML = window.numberAsText(scorePerSecond);
  }
}
