var Clicker = /** @class */ (function () {
    function Clicker(game) {
        var _this = this;
        this.power = 1;
        this.clickerMultiplier = 1;
        this.continuousClicks = 0;
        this.game = game;
        this.container = document.createElement("div");
        this.container.classList.add("clicker");
        var image = document.createElement("img");
        image.classList.add("Bottle");
        image.src = "/img/bottle.png";
        image.draggable = false;
        image.ondragstart = function (e) {
            e.preventDefault();
            return false;
        };
        this.cap = document.createElement("img");
        this.cap.classList.add("Cap");
        this.cap.src = "/img/cap.png";
        this.container.append(image);
        document.querySelector("body").prepend(this.container);
        image.onclick = function (e) {
            _this.letCapFlyOff();
            _this.updateClickMultiplier();
            _this.checkDailyBonus();
            var power = _this.calculatePower();
            _this.displayClickedCaps(e, power);
            _this.game.score += power;
            _this.game.handmadeCaps += power;
        };
        this.createMultiplierDom();
    }
    Clicker.prototype.updateClickMultiplier = function () {
        if (Date.now() - 500 < this.lastClickTimestamp) {
            this.continuousClicks++;
            if (this.continuousClicks > 100) {
                this.clickerMultiplier = 8;
            }
            else if (this.continuousClicks > 50) {
                this.clickerMultiplier = 4;
            }
            else if (this.continuousClicks > 15) {
                this.clickerMultiplier = 2;
            }
        }
        else {
            this.clickerMultiplier = 1;
            this.continuousClicks = 0;
        }
        this.lastClickTimestamp = Date.now();
        if (this.clickerMultiplier <= 1 || Date.now() - 500 > this.lastClickTimestamp) {
            this.multiplier_bonus.classList.remove("multiplier_bonus--visible");
            this.multiplier_bonus.classList.remove("multiplier_bonus--2");
            this.multiplier_bonus.classList.remove("multiplier_bonus--4");
            this.multiplier_bonus.classList.remove("multiplier_bonus--8");
        }
        else {
            this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";
            this.multiplier_bonus.classList.add("multiplier_bonus--" + this.clickerMultiplier);
            this.multiplier_bonus.classList.add("multiplier_bonus--visible");
        }
    };
    Clicker.prototype.checkDailyBonus = function () {
        if (this.game.dailyBonusGot === 0) {
            var date = new Date();
            this.game.dailyBonusGot = date.getDate();
            this.game.inventory.addItem(1000, 1);
            this.game.inventory.updateInventory();
        }
    };
    Clicker.prototype.letCapFlyOff = function () {
        var _this = this;
        this.container.appendChild(this.cap.cloneNode(true));
        setTimeout(function () {
            _this.container.querySelector(".Cap:not(.Fly)").classList.add("Fly_" + Math.ceil(Math.random() * 11));
            _this.container.querySelector(".Cap:not(.Fly)").classList.add("Fly");
        }, 20);
        setTimeout(function () {
            _this.container.querySelector(".Cap").remove();
        }, 200);
    };
    Clicker.prototype.displayClickedCaps = function (e, power) {
        var tmp = document.createElement("p");
        tmp.classList.add("clickIncrease");
        tmp.innerHTML = "+ " + window["numberAsText"](power);
        tmp.style.top = e.clientY - 30 + "px";
        tmp.style.left = e.clientX + 30 + "px";
        document.querySelector("body").append(tmp);
        setTimeout(function () {
            tmp.classList.add("clickIncrease--fade");
        }, 10);
        setTimeout(function () {
            tmp.remove();
        }, 500);
    };
    Clicker.prototype.createMultiplierDom = function () {
        this.multiplier_bonus = document.createElement("div");
        this.multiplier_bonus.classList.add("multiplier_bonus");
        this.multiplier_bonus__inner = document.createElement("p");
        this.multiplier_bonus__inner.classList.add("multiplier_bonus__number");
        this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";
        this.multiplier_bonus.append(this.multiplier_bonus__inner);
        document.querySelector(".clicker").append(this.multiplier_bonus);
    };
    Clicker.prototype.calculatePower = function () {
        var _this = this;
        var power = 1;
        this.game.clickerUpgrades.forEach(function (c) {
            if (!c.bought)
                return false;
            if (c["type"] === "multiplier") {
                power = power * c.power;
            }
            else if (c["type"] === "percentage") {
                power = power + _this.game.capsPerSecond * (c.power / 100);
            }
            else if (c["type"] === "buildingAddition") {
                power = power + _this.game.totalMembers * c.power;
            }
        });
        if (this.game.buff.activeBuff && this.game.buff.activeBuff.id === 2) {
            power *= this.game.buff.activeBuff.power;
        }
        power *= this.clickerMultiplier;
        return power;
    };
    return Clicker;
}());
