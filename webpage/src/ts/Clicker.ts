class Clicker {
  game: Game;
  power: number = 1;

  clickerMultiplier: number = 1;
  lastClickTimestamp: number;
  continuousClicks: number = 0;

  container: HTMLElement;
  cap: HTMLImageElement;

  multiplier_bonus: HTMLElement;
  multiplier_bonus__inner: HTMLElement;

  constructor(game: Game) {
    this.game = game;

    this.container = document.createElement("div");
    this.container.classList.add("clicker");

    const image = document.createElement("img");
    image.classList.add("Bottle");
    image.src = "/img/bottle.png";
    image.draggable = false;

    image.ondragstart = (e) => {
      e.preventDefault();
      return false;
    };

    this.cap = document.createElement("img");
    this.cap.classList.add("Cap");
    this.cap.src = "/img/cap.png";

    this.container.append(image);

    document.querySelector("body").prepend(this.container);

    image.onclick = (e) => {
      this.letCapFlyOff();
      this.updateClickMultiplier();
      this.checkDailyBonus();

      const power = this.calculatePower();

      this.displayClickedCaps(e, power);

      this.game.score += power;
      this.game.handmadeCaps += power;
    };

    this.createMultiplierDom();
  }

  updateClickMultiplier() {
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

  checkDailyBonus() {
    if (this.game.dailyBonusGot === 0) {
      let date = new Date();
      this.game.dailyBonusGot = date.getDate();
      this.game.inventory.addItem(1000, 1);
      this.game.inventory.updateInventory();
    }
  }

  letCapFlyOff() {
    this.container.appendChild(this.cap.cloneNode(true));

    setTimeout(() => {
      this.container.querySelector(".Cap:not(.Fly)").classList.add("Fly_" + Math.ceil(Math.random() * 11));
      this.container.querySelector(".Cap:not(.Fly)").classList.add("Fly");
    }, 20);

    setTimeout(() => {
      this.container.querySelector(".Cap").remove();
    }, 200);
  }

  displayClickedCaps(e: MouseEvent, power: number) {
    let tmp = document.createElement("p");
    tmp.classList.add("clickIncrease");
    tmp.innerHTML = "+ " + window["numberAsText"](power);
    tmp.style.top = e.clientY - 30 + "px";
    tmp.style.left = e.clientX + 30 + "px";
    document.querySelector("body").append(tmp);
    setTimeout(() => {
      tmp.classList.add("clickIncrease--fade");
    }, 10);

    setTimeout(() => {
      tmp.remove();
    }, 500);
  }

  createMultiplierDom() {
    this.multiplier_bonus = document.createElement("div");
    this.multiplier_bonus.classList.add("multiplier_bonus");
    this.multiplier_bonus__inner = document.createElement("p");
    this.multiplier_bonus__inner.classList.add("multiplier_bonus__number");
    this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";

    this.multiplier_bonus.append(this.multiplier_bonus__inner);

    document.querySelector(".clicker").append(this.multiplier_bonus);
  }

  calculatePower(): number {
    let power = 1;
    this.game.clickerUpgrades.forEach((c) => {
      if (!c.bought) return false;

      if (c["type"] === "multiplier") {
        power = power * c.power;
      } else if (c["type"] === "percentage") {
        power = power + this.game.capsPerSecond * (c.power / 100);
      } else if (c["type"] === "buildingAddition") {
        power = power + this.game.totalMembers * c.power;
      }
    });

    if (this.game.buff.activeBuff && this.game.buff.activeBuff.id === 2) {
      power *= this.game.buff.activeBuff.power;
    }

    power *= this.clickerMultiplier;
    return power;
  }
}
