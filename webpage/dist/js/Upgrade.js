var Upgrade = /** @class */ (function () {
    function Upgrade(title, reference, requirement, multiplier, price, id) {
        this.bought = false;
        this.dom = null;
        this.title = title;
        this.reference = reference;
        this.requirement = requirement;
        this.multiplier = multiplier;
        this.price = price;
        this.id = id;
        this.container = document.querySelector(".upgrades");
        this.createDom();
    }
    Upgrade.prototype.createDom = function () {
        this.dom = document.createElement("article");
        this.dom.classList.add("upgrades__upgrade");
        this.dom.classList.add("hidden");
        var price = document.createElement("p");
        price.innerHTML = window["numberWithCommas"](this.price);
        var title = document.createElement("p");
        title.innerHTML = this.title;
        var effect = document.createElement("p");
        effect.style.fontSize = 12 + "px";
        effect.innerHTML = this.reference.name + " wird " + this.multiplier + "x effektiver!<br /><br />";
        this.dom.append(title);
        this.dom.append(effect);
        this.dom.append(price);
        this.container.append(this.dom);
    };
    Upgrade.prototype.updateBuyability = function (score) {
        if (!this.dom)
            return false;
        if (score > this.price) {
            this.dom.classList.remove("disabled");
        }
        else {
            this.dom.classList.add("disabled");
        }
    };
    Upgrade.prototype.updateVisibility = function () {
        if (this.bought) {
            this.dom.classList.add("hidden");
            return;
        }
        if (this.requirement <= this.reference.amount) {
            this.dom.classList.remove("hidden");
        }
        else {
            this.dom.classList.add("hidden");
        }
    };
    Upgrade.prototype.buy = function () {
        if (!this.bought) {
            this.bought = true;
            this.reference.multiplier *= this.multiplier;
            this.reference.updatePower();
        }
    };
    return Upgrade;
}());
