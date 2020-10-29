var ClickerUpgrade = /** @class */ (function () {
    function ClickerUpgrade(title, description, requirement, type, power, price, id) {
        this.bought = false;
        this.dom = null;
        this.title = title;
        this.requirement = requirement;
        this.type = type;
        this.power = power;
        this.description = description;
        this.price = price;
        this.id = id;
        this.container = document.querySelector(".upgrades");
        this.createDom();
    }
    ClickerUpgrade.prototype.createDom = function () {
        this.dom = document.createElement("article");
        this.dom.classList.add("upgrades__upgrade");
        this.dom.classList.add("hidden");
        var price = document.createElement("p");
        price.classList.add("upgrades__price");
        price.innerHTML = window["numberAsText"](this.price);
        var title = document.createElement("p");
        title.innerHTML = this.title;
        var effect = document.createElement("p");
        effect.style.fontSize = 12 + "px";
        effect.classList.add("upgrades__description");
        effect.innerHTML = this.description;
        this.dom.append(title);
        this.dom.append(effect);
        this.dom.append(price);
        this.container.append(this.dom);
    };
    ClickerUpgrade.prototype.updateBuyability = function (score) {
        if (!this.dom)
            return false;
        if (score > this.price || this.bought) {
            this.dom.classList.remove("disabled");
        }
        else {
            this.dom.classList.add("disabled");
        }
    };
    ClickerUpgrade.prototype.updateVisibility = function (amount, handmadeCaps, showBought) {
        if (this.bought) {
            this.showDom();
            if (showBought) {
                this.dom.classList.add("bought");
            }
            else {
                this.hideDom();
            }
            return;
        }
        var clickedCookiesVisibility = this.requirement["type"] === "clickedCookies" && handmadeCaps >= this.requirement["value"];
        var memberAmountVisibility = this.requirement["type"] === "member" && amount >= this.requirement["value"];
        if (clickedCookiesVisibility || memberAmountVisibility) {
            this.showDom();
        }
        else {
            this.hideDom();
        }
    };
    ClickerUpgrade.prototype.buy = function () {
        this.bought = true;
    };
    ClickerUpgrade.prototype.showDom = function () {
        this.dom.classList.remove("hidden");
    };
    ClickerUpgrade.prototype.hideDom = function () {
        this.dom.classList.add("hidden");
    };
    return ClickerUpgrade;
}());
