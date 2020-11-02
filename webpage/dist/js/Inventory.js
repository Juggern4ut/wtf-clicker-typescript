var Inventory = /** @class */ (function () {
    function Inventory(buff) {
        this.items = [];
        this.stack = [];
        this.itemAmount = 0;
        this.buff = buff;
        this.loadItems();
        this.initInventoryButton();
    }
    /**
     * Initialize the handler to open and close the inventory
     */
    Inventory.prototype.initInventoryButton = function () {
        var _this = this;
        this.inventoryButton = document.querySelector(".inventory");
        this.modal = document.querySelector(".inventory__modal");
        this.inventoryContent = document.querySelector(".inventory__content");
        this.inventoryAmount = document.querySelector(".inventory__count");
        this.inventoryButton.onclick = function () {
            _this.openInventory();
            _this.updateInventory();
        };
        var closeButton = document.querySelector(".inventory__close");
        closeButton.onclick = function () {
            _this.closeInventory();
        };
    };
    /**
     * Will open the Inventory Modal
     */
    Inventory.prototype.openInventory = function () {
        this.modal.classList.add("inventory__modal--open");
    };
    /**
     * Will close the Inventory Modal
     */
    Inventory.prototype.closeInventory = function () {
        this.modal.classList.remove("inventory__modal--open");
    };
    /**
     * Will load the Items from the json file
     */
    Inventory.prototype.loadItems = function () {
        var _this = this;
        this.stack = [];
        fetch("/data/items_new.json")
            .then(function (res) { return res.json(); })
            .then(function (items) {
            items.forEach(function (item) {
                _this.items.push(new Item(item["id"], item["name"], item["image"], item["description"], item["text"], item["referenceMemberId"], item["power"], item["consumable"], item["duration"], item["getFromGoldenPelos"]));
                _this.stack.push({ id: item["id"], amount: 0 });
            });
        });
    };
    /**
     * Will return a random item, but only if it's ID is present in the itemIds array
     * @returns A randomly selected Item
     */
    Inventory.prototype.getRandomItem = function (ungettable) {
        var itemIds = [];
        this.items.forEach(function (i) {
            if (i.getFromPelo && !ungettable.includes(i.id)) {
                itemIds.push(i.id);
            }
        });
        var possItems = [];
        this.items.forEach(function (item) {
            if (itemIds.find(function (i) { return item["id"] === i; })) {
                possItems.push(item);
            }
        });
        var index = Math.floor(Math.random() * possItems.length);
        return possItems[index];
    };
    /**
     * Will add a number to the inventory
     * @param id The id of the item to add to the inventory
     */
    Inventory.prototype.addItem = function (id, amount) {
        if (amount === void 0) { amount = 1; }
        var found = this.stack.find(function (i) { return i.id === id; });
        if (found) {
            this.itemAmount += amount;
            found.amount += amount;
            this.updateInventory();
        }
        else {
            console.warn("Das Item mit der ID: " + id + " wurde nicht gefunden und dem Inventar nicht hinzugefügt.");
        }
    };
    /**
     * Consume a item and send information about it to the buff class
     * @param item The item to consume
     */
    Inventory.prototype.consumeItem = function (item) {
        var found = this.stack.find(function (i) { return i.id === item.id; });
        if (found) {
            this.itemAmount--;
            found.amount--;
            this.updateInventory();
            this.buff.consumeItem(item);
        }
        else {
            console.warn("Das Item mit der ID: " + item.id + " wurde nicht gefunden und dem Inventar nicht hinzugefügt.");
        }
    };
    /**
     * Will update the whole DOM of the inventory
     */
    Inventory.prototype.updateInventory = function () {
        var _this = this;
        this.inventoryContent.innerHTML = "";
        if (this.itemAmount) {
            this.inventoryAmount.classList.add("inventory__count--visible");
            this.inventoryAmount.innerHTML = this.itemAmount + "";
        }
        else {
            this.inventoryAmount.classList.remove("inventory__count--visible");
        }
        this.items.forEach(function (item) {
            var stack = _this.stack.find(function (s) { return s.id === item.id; });
            if (stack.amount > 0) {
                var container = document.createElement("article");
                container.classList.add("inventory__item");
                var image = document.createElement("img");
                image.classList.add("inventory__item-image");
                image.src = "/img/items/" + item.imageString;
                var info = document.createElement("div");
                var title = document.createElement("p");
                title.classList.add("inventory__item-title");
                title.innerHTML = item.name;
                var text = document.createElement("p");
                text.classList.add("u-italic");
                text.innerHTML = item.text;
                var description = document.createElement("p");
                description.innerHTML = item.description;
                var amount = document.createElement("p");
                amount.classList.add("inventory__item-amount");
                amount.innerHTML = stack.amount + " x";
                info.append(title);
                info.append(text);
                info.append(description);
                container.append(image);
                container.append(info);
                container.append(amount);
                if (item.consumable) {
                    container.onclick = function () {
                        _this.consumeItem(item);
                        _this.updateInventory();
                        if (item.duration) {
                            _this.closeInventory();
                        }
                    };
                }
                _this.inventoryContent.append(container);
            }
        });
    };
    /**
     * Will clear the inventory of all items
     */
    Inventory.prototype.clearInventory = function () {
        this.items = [];
        this.updateInventory();
    };
    return Inventory;
}());
