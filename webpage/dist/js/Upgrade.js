var Upgrade = /** @class */ (function () {
    function Upgrade(title, reference, requirement, multiplier, price) {
        this.domCreated = false;
        this.bought = false;
        this.dom = null;
        this.title = title;
        this.reference = reference;
        this.requirement = requirement;
        this.multiplier = multiplier;
        this.price = price;
        this.container = document.querySelector(".upgrades");
        this.update();
    }
    Upgrade.prototype.createDom = function () {
        this.dom = document.createElement("article");
        this.dom.classList.add("upgrades__upgrade");
        var price = document.createElement("p");
        price.innerHTML = window["numberWithCommas"](this.price);
        var title = document.createElement("p");
        title.innerHTML = this.title;
        this.dom.append(title);
        this.dom.append(price);
        if (this.domCreated)
            return false;
        this.container.append(this.dom);
        this.domCreated = true;
    };
    Upgrade.prototype.buy = function () {
        if (!this.bought) {
            this.bought = true;
            this.reference.multiplier *= this.multiplier;
            this.update();
            this.reference.updatePower();
            return this.price;
        }
        return 0;
    };
    Upgrade.prototype.update = function () {
        if (this.reference.amount >= this.requirement && !this.bought) {
            this.createDom();
        }
        if (this.dom) {
            if (this.bought) {
                this.dom.remove();
            }
        }
    };
    return Upgrade;
}());
