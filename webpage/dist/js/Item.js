var Item = /** @class */ (function () {
    function Item(id, name, icon, description, text, referenceMemberId, power, consumable, duration, getFromPelo) {
        this.amount = 0;
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageString = icon;
        this.text = text;
        this.referenceMemberId = referenceMemberId;
        this.power = power;
        this.consumable = consumable;
        this.duration = duration;
        this.getFromPelo = getFromPelo;
        this.createImage();
        this.createDom();
    }
    Item.prototype.createDom = function () {
        this.dom = document.createElement("article");
        this.dom.classList.add("inventory__item");
        var info = document.createElement("div");
        var description = document.createElement("p");
        description.innerHTML = this.description;
        var text = document.createElement("p");
        text.classList.add("u-italic");
        text.innerHTML = '"' + this.text + '"';
        var title = document.createElement("p");
        title.classList.add("inventory__item-title");
        title.innerHTML = this.name;
        var amount = document.createElement("p");
        amount.classList.add("inventory__item-amount");
        amount.innerHTML = this.amount + " x";
        info.append(title);
        info.append(text);
        info.append(description);
        this.dom.append(this.image);
        this.dom.append(info);
        this.dom.append(amount);
    };
    Item.prototype.updateAmount = function () {
        var el = this.dom.querySelector(".inventory__item-amount");
        el.innerHTML = this.amount + " x";
    };
    Item.prototype.createImage = function () {
        this.image = document.createElement("img");
        this.image.src = "/img/items/" + this.imageString;
        this.image.classList.add("inventory__item-image");
    };
    return Item;
}());
