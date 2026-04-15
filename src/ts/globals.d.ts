import type { Game } from "./Game.js";

declare global {
  interface Window {
    clicker: Game;
    numberWithCommas: (number: number | string) => string;
    numberAsText: (number: number) => string;
  }
}

export {};
