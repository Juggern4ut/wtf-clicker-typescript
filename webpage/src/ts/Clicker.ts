import type { ClickerUpgrade } from "./ClickerUpgrade.js";
import type { Game } from "./Game.js";

/**
 * Handles manual clicking interactions and click-related bonuses.
 */
export class Clicker {
  game: Game;
  power: number = 1;
  clickerMultiplier: number = 1;
  lastClickTimestamp: number = 0;
  continuousClicks: number = 0;
  container: HTMLElement;
  cap: HTMLImageElement;
  multiplier_bonus!: HTMLElement;
  multiplier_bonus__inner!: HTMLElement;

  /**
   * Creates the clicker UI and wires its interactions.
   * @param game The current game instance.
   */
  constructor(game: Game) {
    this.game = game;

    this.container = document.createElement("div");
    this.container.classList.add("clicker");

    const image = document.createElement("img");
    image.classList.add("Bottle");
    image.src = "/img/bottle.png";
    image.draggable = false;

    image.ondragstart = (event: DragEvent): boolean => {
      event.preventDefault();
      return false;
    };

    this.cap = document.createElement("img");
    this.cap.classList.add("Cap");
    this.cap.src = "/img/cap.png";

    this.container.append(image);
    (document.querySelector("body") as HTMLBodyElement).prepend(this.container);

    image.onclick = (event: MouseEvent): void => {
      this.letCapFlyOff();
      this.updateClickMultiplier();
      this.checkDailyBonus();

      const power = this.calculatePower();
      this.displayClickedCaps(event, power);

      this.game.score += power;
      this.game.handmadeCaps += power;
    };

    this.createMultiplierDom();
  }

  /**
   * Updates the click multiplier based on the current click streak.
   */
  updateClickMultiplier(): void {
    if (Date.now() - 500 < this.lastClickTimestamp) {
      this.continuousClicks++;
      if (this.continuousClicks > 100) {
        this.clickerMultiplier = 8;
      } else if (this.continuousClicks > 50) {
        this.clickerMultiplier = 4;
      } else if (this.continuousClicks > 15) {
        this.clickerMultiplier = 2;
      }
    } else {
      this.clickerMultiplier = 1;
      this.continuousClicks = 0;
    }

    this.lastClickTimestamp = Date.now();

    if (this.clickerMultiplier <= 1 || Date.now() - 500 > this.lastClickTimestamp) {
      this.multiplier_bonus.classList.remove("multiplier_bonus--visible");
      this.multiplier_bonus.classList.remove("multiplier_bonus--2");
      this.multiplier_bonus.classList.remove("multiplier_bonus--4");
      this.multiplier_bonus.classList.remove("multiplier_bonus--8");
    } else {
      this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";
      this.multiplier_bonus.classList.add("multiplier_bonus--" + this.clickerMultiplier);
      this.multiplier_bonus.classList.add("multiplier_bonus--visible");
    }
  }

  /**
   * Grants the daily inventory bonus on the first click of the day.
   */
  checkDailyBonus(): void {
    if (this.game.dailyBonusGot === 0) {
      const date = new Date();
      this.game.dailyBonusGot = date.getDate();
      this.game.inventory.addItem(1000, 1);
      this.game.inventory.updateInventory();
    }
  }

  /**
   * Animates the bottle cap flying away after a click.
   */
  letCapFlyOff(): void {
    this.container.appendChild(this.cap.cloneNode(true));

    setTimeout(() => {
      (this.container.querySelector(".Cap:not(.Fly)") as HTMLElement).classList.add("Fly_" + Math.ceil(Math.random() * 11));
      (this.container.querySelector(".Cap:not(.Fly)") as HTMLElement).classList.add("Fly");
    }, 20);

    setTimeout(() => {
      (this.container.querySelector(".Cap") as HTMLElement).remove();
    }, 200);
  }

  /**
   * Displays the floating clicked-cap indicator near the mouse cursor.
   * @param event The click event.
   * @param power The amount awarded for the click.
   */
  displayClickedCaps(event: MouseEvent, power: number): void {
    const tmp = document.createElement("p");
    tmp.classList.add("clickIncrease");
    tmp.innerHTML = "+ " + window.numberAsText(power);
    tmp.style.top = event.clientY - 30 + "px";
    tmp.style.left = event.clientX + 30 + "px";
    (document.querySelector("body") as HTMLBodyElement).append(tmp);

    setTimeout(() => {
      tmp.classList.add("clickIncrease--fade");
    }, 10);

    setTimeout(() => {
      tmp.remove();
    }, 500);
  }

  /**
   * Creates the multiplier indicator DOM.
   */
  createMultiplierDom(): void {
    this.multiplier_bonus = document.createElement("div");
    this.multiplier_bonus.classList.add("multiplier_bonus");
    this.multiplier_bonus__inner = document.createElement("p");
    this.multiplier_bonus__inner.classList.add("multiplier_bonus__number");
    this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";

    this.multiplier_bonus.append(this.multiplier_bonus__inner);
    (document.querySelector(".clicker") as HTMLElement).append(this.multiplier_bonus);
  }

  /**
   * Calculates the current click power including upgrades and buffs.
   * @returns The total click power.
   */
  calculatePower(): number {
    let power = 1;

    this.game.clickerUpgrades.forEach((clickerUpgrade: ClickerUpgrade) => {
      if (!clickerUpgrade.bought) {
        return false;
      }

      if (clickerUpgrade.type === "multiplier") {
        power = power * clickerUpgrade.power;
      } else if (clickerUpgrade.type === "percentage") {
        power = power + this.game.capsPerSecond * (clickerUpgrade.power / 100);
      } else if (clickerUpgrade.type === "buildingAddition") {
        power = power + this.game.totalMembers * clickerUpgrade.power;
      }

      return true;
    });

    if (this.game.buff.activeBuff && this.game.buff.activeBuff.id === 2) {
      power *= this.game.buff.activeBuff.power;
    }

    power *= this.clickerMultiplier;
    return power;
  }
}
