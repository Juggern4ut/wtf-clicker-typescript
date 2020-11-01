var GoldenPelo = /** @class */ (function () {
    function GoldenPelo(game) {
        this.spawnChancePerSecond = 0.01;
        this.missedGoldenPelo = 0;
        this.duration = 3;
        this.game = game;
        this.goldenpelo = document.createElement("img");
        this.goldenpelo.src = "/img/golden_pelo.png";
        this.goldenpelo.classList.add("golden-pelo");
    }
    GoldenPelo.prototype.spawnRandomItem = function () {
        var _this = this;
        var percentChancePerSecond = this.spawnChancePerSecond / (1000 / this.game.intervalSpeed);
        if (this.game.buff.activeBuff && this.game.buff.activeBuff.id === 3) {
            percentChancePerSecond *= this.game.buff.activeBuff.power;
        }
        if (Math.random() < percentChancePerSecond) {
            var top_1 = Math.random() * (window.innerHeight - 150);
            var left = Math.random() * (window.innerWidth - 150);
            this.goldenpelo.style.top = top_1 + "px";
            this.goldenpelo.style.left = left + "px";
            var clone_1 = this.goldenpelo.cloneNode(true);
            document.querySelector("body").append(clone_1);
            setTimeout(function () {
                clone_1.remove();
                _this.missedGoldenPelo++;
            }, this.duration * 1000);
            clone_1.onclick = function () {
                var possibleIds = [1, 2, 3, 4];
                if (_this.game.buff.activeBuff && _this.game.buff.activeBuff.id === 3) {
                    possibleIds = [1, 2, 4];
                }
                var randomItem = _this.game.inventory.getRandomItem(possibleIds);
                _this.game.inventory.addItem(randomItem.id);
                clone_1.src = "/img/items/" + randomItem["imageString"];
                clone_1.classList.add("collected");
                setTimeout(function () {
                    clone_1.remove();
                }, 500);
            };
        }
    };
    return GoldenPelo;
}());
