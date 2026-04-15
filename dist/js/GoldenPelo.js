/**
 * Spawns and handles collectible golden Pelo drops.
 */
export class GoldenPelo {
    /**
     * Creates the golden Pelo handler.
     * @param game The current game instance.
     */
    constructor(game) {
        this.spawnChancePerSecond = 0.01;
        this.missedGoldenPelo = 0;
        this.duration = 3;
        this.game = game;
        this.goldenpelo = document.createElement("img");
        this.goldenpelo.src = "/img/golden_pelo.png";
        this.goldenpelo.classList.add("golden-pelo");
    }
    /**
     * Spawns a random golden Pelo collectible when the chance roll succeeds.
     */
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
            const clone = this.goldenpelo.cloneNode(true);
            document.querySelector("body").append(clone);
            setTimeout(() => {
                clone.remove();
                this.missedGoldenPelo++;
            }, this.duration * 1000);
            clone.onclick = () => {
                const randomItem = this.game.inventory.getRandomItem([3]);
                this.game.inventory.addItem(randomItem.id);
                clone.src = "/img/items/" + randomItem.imageString;
                clone.classList.add("collected");
                setTimeout(() => {
                    clone.remove();
                }, 500);
            };
        }
    }
}
//# sourceMappingURL=GoldenPelo.js.map