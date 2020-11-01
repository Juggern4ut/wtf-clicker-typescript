class GoldenPelo {
  spawnChancePerSecond: number = 0.01;
  goldenpelo: HTMLImageElement;
  missedGoldenPelo: number = 0;
  duration: number = 3;
  game: Game;
  
  constructor(game: Game) {
    this.game = game;
    this.goldenpelo = document.createElement("img");
    this.goldenpelo.src = "/img/golden_pelo.png";
    this.goldenpelo.classList.add("golden-pelo");
  }

  spawnRandomItem() {
    let percentChancePerSecond = this.spawnChancePerSecond / (1000 / this.game.intervalSpeed);

    if (this.game.buff.activeBuff && this.game.buff.activeBuff.id === 3) {
      percentChancePerSecond *= this.game.buff.activeBuff.power;
    }

    if (Math.random() < percentChancePerSecond) {
      const top = Math.random() * (window.innerHeight - 150);
      const left = Math.random() * (window.innerWidth - 150);

      this.goldenpelo.style.top = top + "px";
      this.goldenpelo.style.left = left + "px";

      let clone = this.goldenpelo.cloneNode(true) as HTMLImageElement;

      document.querySelector("body").append(clone);

      setTimeout(() => {
        clone.remove();
        this.missedGoldenPelo++;
      }, this.duration * 1000);

      clone.onclick = () => {
        let possibleIds = [1, 2, 3, 4];
        if (this.game.activeBuff && this.game.activeBuff.id === 3) {
          possibleIds = [1, 2, 4];
        }

        let randomItem = this.game.inventory.getRandomItem(possibleIds);
        this.game.inventory.addItem(randomItem.id);

        clone.src = "/img/items/" + randomItem["imageString"];
        clone.classList.add("collected");
        setTimeout(() => {
          clone.remove();
        }, 500);
      };
    }
  }
}
