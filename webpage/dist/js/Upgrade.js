var Upgrade = /** @class */ (function () {
    function Upgrade(title, description, requirement, multiplier, price, id) {
        this.bought = false;
        this.dom = null;
        this.title = title;
        this.requirement = requirement;
        this.multiplier = multiplier;
        this.description = description;
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
        price.innerHTML = window["numberAsText"](this.price);
        var title = document.createElement("p");
        title.innerHTML = this.title;
        var effect = document.createElement("p");
        effect.style.fontSize = 12 + "px";
        effect.innerHTML = this.description + "<br /><br />";
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
    Upgrade.prototype.updateVisibility = function (amount) {
        if (this.bought) {
            this.dom.classList.add("hidden");
            return;
        }
        if (this.requirement <= amount) {
            this.dom.classList.remove("hidden");
        }
        else {
            this.dom.classList.add("hidden");
        }
    };
    return Upgrade;
}());
