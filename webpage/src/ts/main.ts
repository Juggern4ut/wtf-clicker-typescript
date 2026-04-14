import { Game } from "./Game.js";

/**
 * Initializes the browser game once the window has loaded.
 */
window.onload = (): void => {
  (document.querySelector(".navigation__burger") as HTMLElement).addEventListener("click", () => {
    (document.querySelector(".navigation") as HTMLElement).classList.toggle("navigation--open");
  });

  (document.querySelector(".stats-button") as HTMLElement).addEventListener("click", () => {
    window.clicker.updateStats();
    (document.querySelector(".stats") as HTMLElement).classList.add("stats--open");
  });

  (document.querySelector(".stats__close") as HTMLElement).addEventListener("click", () => {
    (document.querySelector(".stats") as HTMLElement).classList.remove("stats--open");
  });

  window.numberWithCommas = (number: number | string): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  window.numberAsText = (number: number): string => {
    if (number < 1000000) {
      return window.numberWithCommas(number.toFixed(0));
    }

    const scales = [
      "",
      "tausend",
      "millionen",
      "milliarden",
      "billionen",
      "billiarden",
      "trillionen",
      "trilliarden",
      "quadrillionen",
      "quadrilliarden",
      "quintillionen",
      "quintilliarden",
      "sextillionen",
      "sextilliarden",
      "septillionen",
      "septilliarden",
      "oktillionen",
      "oktilliarden",
      "nonillionen",
      "nonilliarden",
      "dezillionen",
      "dezilliarden",
    ];

    for (let power = 0; power < scales.length; power++) {
      const potence = Math.pow(1000, power);
      const division = number / potence;
      if (division < 1000) {
        return division.toFixed(2) + " " + scales[power];
      }
    }

    return (number / Math.pow(1000, scales.length - 1)).toFixed(2) + " " + scales[scales.length - 1];
  };

  window.clicker = new Game();
};
