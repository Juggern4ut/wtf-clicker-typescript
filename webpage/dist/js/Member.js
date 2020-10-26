var Member = /** @class */ (function () {
    function Member(name, basePower, basePrice, image) {
        this.dom = {
            container: null,
            title: null,
            image: null,
            amount: null,
            price: null,
            imageContainer: null,
            infoContainer: null
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
        this.dom.imageContainer = document.createElement("div");
        this.dom.imageContainer.classList.add("members__imageContainer");
        this.dom.infoContainer = document.createElement("div");
        this.dom.infoContainer.classList.add("members__infoContainer");
        this.dom.title = document.createElement("p");
        this.dom.title.classList.add("members__title");
        this.dom.amount = document.createElement("p");
        this.dom.amount.classList.add("members__amount");
        this.dom.title.innerHTML = this.name;
        this.dom.amount.innerHTML = "" + this.amount;
        this.dom.container = document.createElement("article");
        this.dom.container.classList.add("members__member");
        this.dom.price = document.createElement("p");
        this.dom.price.classList.add("members__price");
        this.updatePrice();
        this.dom.imageContainer.append(this.dom.image);
        this.dom.infoContainer.append(this.dom.title);
        this.dom.infoContainer.append(this.dom.amount);
        this.dom.infoContainer.append(this.dom.price);
        this.dom.container.append(this.dom.imageContainer);
        this.dom.container.append(this.dom.infoContainer);
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
