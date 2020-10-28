var Member = /** @class */ (function () {
    function Member(name, basePower, basePrice, image, id) {
        this.multiplier = 1;
        this.upgrades = [];
        this.dom = {
            container: null,
            title: null,
            image: null,
            amount: null,
            price: null,
            imageContainer: null,
            infoContainer: null,
            amountContainer: null,
            power: null
        };
        this.numberWithCommas = function (number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        };
        this.amount = 0;
        this.basePower = basePower;
        this.name = name;
        this.basePrice = basePrice;
        this.id = id;
        this.dom.image = document.createElement("img");
        this.dom.image.src = "/img/members/" + image;
        this.dom.image.classList.add("members__image");
        this.container = document.querySelector(".members");
        this.createDomElement();
        this.applyToDom();
    }
    Member.prototype.addUpgrade = function (upgrade) {
        this.upgrades.push(upgrade);
    };
    Member.prototype.createDomElement = function () {
        this.dom.imageContainer = document.createElement("div");
        this.dom.imageContainer.classList.add("members__imageContainer");
        this.dom.infoContainer = document.createElement("div");
        this.dom.infoContainer.classList.add("members__infoContainer");
        this.dom.amountContainer = document.createElement("div");
        this.dom.amountContainer.classList.add("members__amountContainer");
        this.dom.title = document.createElement("p");
        this.dom.title.classList.add("members__title");
        this.dom.amount = document.createElement("p");
        this.dom.amount.classList.add("members__amount");
        this.dom.power = document.createElement("p");
        this.dom.power.classList.add("members__power");
        this.dom.title.innerHTML = this.name;
        this.dom.amount.innerHTML = "" + this.amount;
        this.dom.container = document.createElement("article");
        this.dom.container.classList.add("members__member");
        this.dom.price = document.createElement("p");
        this.dom.price.classList.add("members__price");
        this.updatePrice();
        this.dom.imageContainer.append(this.dom.image);
        this.dom.infoContainer.append(this.dom.title);
        this.dom.amountContainer.append(this.dom.amount);
        this.dom.infoContainer.append(this.dom.power);
        this.dom.infoContainer.append(this.dom.price);
        this.updatePower();
        this.dom.container.append(this.dom.imageContainer);
        this.dom.container.append(this.dom.infoContainer);
        this.dom.container.append(this.dom.amountContainer);
    };
    Member.prototype.applyToDom = function () {
        this.container.append(this.dom.container);
    };
    Member.prototype.getPrice = function () {
        if (this.amount === 0) {
            return this.basePrice;
        }
        return Math.ceil(this.basePrice * Math.pow(1.15, this.amount));
    };
    Member.prototype.updateAmount = function () {
        this.dom.amount.innerHTML = "" + this.amount;
    };
    Member.prototype.updatePrice = function () {
        this.dom.price.innerHTML = window["numberAsText"](this.getPrice()) + "";
    };
    Member.prototype.updateBuyability = function (score) {
        if (this.getPrice() > score) {
            this.dom.container.classList.add("members__disabled");
        }
        else {
            this.dom.container.classList.remove("members__disabled");
        }
    };
    Member.prototype.updatePower = function () {
        this.dom.power.innerHTML = window["numberAsText"](this.basePower * this.getMultiplier()) + " p/s";
    };
    Member.prototype.getIncrease = function () {
        return this.basePower * this.amount * this.getMultiplier();
    };
    Member.prototype.getMultiplier = function () {
        var multiplier = 1;
        this.upgrades.forEach(function (u) {
            if (u.bought) {
                multiplier *= u.multiplier;
            }
        });
        return multiplier;
    };
    Member.prototype.buy = function () {
        this.amount++;
    };
    Member.prototype.updateUpgrades = function (score, showBought) {
        var _this = this;
        this.upgrades.forEach(function (u) {
            u.updateVisibility(_this.amount, showBought);
            u.updateBuyability(score);
        });
    };
    Member.prototype.update = function (score, showBought) {
        this.updateBuyability(score);
        this.updatePower();
        this.updateAmount();
        this.updateUpgrades(score, showBought);
        this.updatePrice();
    };
    return Member;
}());
