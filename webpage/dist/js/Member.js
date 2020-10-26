var Member = /** @class */ (function () {
    function Member(name, basePower, basePrice, image) {
        this.dom = {
            container: null,
            title: null,
            image: null,
            amount: null,
            price: null
        };
        this.numberWithCommas = function (number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        };
        this.amount = 0;
        this.basePower = basePower;
        this.name = name;
        this.basePrice = basePrice;
        this.dom.image = document.createElement("img");
        this.dom.image.src = "/img/members/" + image;
        this.dom.image.classList.add("members__image");
        this.container = document.querySelector(".members");
        this.createDomElement();
        this.applyToDom();
    }
    Member.prototype.createDomElement = function () {
        this.dom.title = document.createElement("p");
        this.dom.amount = document.createElement("p");
        this.dom.title.innerHTML = this.name;
        this.dom.amount.innerHTML = "Anzahl:" + this.amount;
        this.dom.container = document.createElement("article");
        this.dom.container.classList.add("members__member");
        this.dom.price = document.createElement("p");
        this.updatePrice();
        this.dom.container.append(this.dom.title);
        this.dom.container.append(this.dom.image);
        this.dom.container.append(this.dom.amount);
        this.dom.container.append(this.dom.price);
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
        this.dom.amount.innerHTML = "Anzahl: " + this.amount;
    };
    Member.prototype.updatePrice = function () {
        this.dom.price.innerHTML = window["numberWithCommas"](this.getPrice()) + "";
    };
    Member.prototype.updateBuyability = function (score) {
        if (this.getPrice() > score) {
            this.dom.container.classList.add("members__disabled");
        }
        else {
            this.dom.container.classList.remove("members__disabled");
        }
    };
    Member.prototype.getIncrease = function () {
        return this.basePower * this.amount;
    };
    Member.prototype.buy = function () {
        this.amount++;
        this.update();
    };
    Member.prototype.update = function () {
        this.updateAmount();
        this.updatePrice();
    };
    return Member;
}());
