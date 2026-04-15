import { Item } from "./Item.js";
/**
 * Handles the inventory state and inventory modal interactions.
 */
export class Inventory {
    /**
     * Creates a new inventory instance.
     * @param buff The buff manager used for item effects.
     */
    constructor(buff) {
        this.items = [];
        this.stack = [];
        this.itemAmount = 0;
        this.buff = buff;
        this.loadItems();
        this.initInventoryButton();
    }
    /**
     * Initialize the handler to open and close the inventory.
     */
    initInventoryButton() {
        this.inventoryButton = document.querySelector(".inventory");
        this.modal = document.querySelector(".inventory__modal");
        this.inventoryContent = document.querySelector(".inventory__content");
        this.inventoryAmount = document.querySelector(".inventory__count");
        this.inventoryButton.onclick = () => {
            this.openInventory();
            this.updateInventory();
        };
        const closeButton = document.querySelector(".inventory__close");
        closeButton.onclick = () => {
            this.closeInventory();
        };
    }
    /**
     * Will open the Inventory Modal.
     */
    openInventory() {
        this.modal.classList.add("inventory__modal--open");
    }
    /**
     * Will close the Inventory Modal.
     */
    closeInventory() {
        this.modal.classList.remove("inventory__modal--open");
    }
    /**
     * Will load the Items from the json file.
     */
    loadItems() {
        this.stack = [];
        fetch("/data/items.json")
            .then((res) => res.json())
            .then((items) => {
            items.forEach((item) => {
                this.items.push(new Item(item.id, item.name, item.image, item.description, item.text, item.referenceMemberId, item.power, item.consumable, item.duration, item.getFromGoldenPelos));
                this.stack.push({ id: item.id, amount: 0 });
            });
        });
    }
    /**
     * Will return a random item, but only if its ID is not present in the excluded id array.
     * @param ungettable Item ids that must not be returned.
     * @returns A randomly selected item.
     */
    getRandomItem(ungettable) {
        const itemIds = [];
        this.items.forEach((item) => {
            if (item.getFromPelo && !ungettable.includes(item.id)) {
                itemIds.push(item.id);
            }
        });
        const possItems = [];
        this.items.forEach((item) => {
            if (itemIds.find((id) => item.id === id)) {
                possItems.push(item);
            }
        });
        const index = Math.floor(Math.random() * possItems.length);
        return possItems[index];
    }
    /**
     * Will add a number to the inventory.
     * @param id The id of the item to add to the inventory.
     * @param amount The amount of items to add.
     */
    addItem(id, amount = 1) {
        const found = this.stack.find((item) => item.id === id);
        if (found) {
            this.itemAmount += amount;
            found.amount += amount;
            this.updateInventory();
        }
        else {
            console.warn("Das Item mit der ID: " + id + " wurde nicht gefunden und dem Inventar nicht hinzugefügt.");
        }
    }
    /**
     * Consumes an item and forwards the effect to the buff class.
     * @param item The item to consume.
     */
    consumeItem(item) {
        const found = this.stack.find((stackItem) => stackItem.id === item.id);
        if (found) {
            this.itemAmount--;
            found.amount--;
            this.updateInventory();
            this.buff.consumeItem(item);
        }
        else {
            console.warn("Das Item mit der ID: " + item.id + " wurde nicht gefunden und dem Inventar nicht hinzugefügt.");
        }
    }
    /**
     * Will update the whole DOM of the inventory.
     */
    updateInventory() {
        this.inventoryContent.innerHTML = "";
        if (this.itemAmount) {
            this.inventoryAmount.classList.add("inventory__count--visible");
            this.inventoryAmount.innerHTML = this.itemAmount + "";
        }
        else {
            this.inventoryAmount.classList.remove("inventory__count--visible");
        }
        this.items.forEach((item) => {
            const stack = this.stack.find((stackEntry) => stackEntry.id === item.id);
            if (stack.amount > 0) {
                const container = document.createElement("article");
                container.classList.add("inventory__item");
                const image = document.createElement("img");
                image.classList.add("inventory__item-image");
                image.src = "/img/items/" + item.imageString;
                const info = document.createElement("div");
                const title = document.createElement("p");
                title.classList.add("inventory__item-title");
                title.innerHTML = item.name;
                const text = document.createElement("p");
                text.classList.add("inventory__item-subtitle");
                text.innerHTML = item.text;
                const description = document.createElement("p");
                description.innerHTML = item.description;
                const amount = document.createElement("p");
                amount.classList.add("inventory__item-amount");
                amount.innerHTML = "<span class='inventory__item-amount-label'>x</span>" + stack.amount;
                info.append(title);
                info.append(text);
                info.append(description);
                container.append(image);
                container.append(info);
                container.append(amount);
                if (item.consumable) {
                    container.onclick = () => {
                        this.consumeItem(item);
                        this.updateInventory();
                        if (item.duration) {
                            this.closeInventory();
                        }
                    };
                }
                this.inventoryContent.append(container);
            }
        });
    }
    /**
     * Will clear the inventory of all items.
     */
    clearInventory() {
        this.items = [];
        this.updateInventory();
    }
}
//# sourceMappingURL=Inventory.js.map