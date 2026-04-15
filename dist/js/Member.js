/**
 * Represents a purchasable club member.
 */
export class Member {
    /**
     * Creates a new member instance.
     * @param name The member name.
     * @param basePower The member base production.
     * @param basePrice The member base price.
     * @param image The member image filename.
     * @param id The member id.
     */
    constructor(name, basePower, basePrice, image, id) {
        this.nextPrice = 0;
        this.multiplier = 1;
        this.upgrades = [];
        this.dom = {};
        /**
         * Formats a number with apostrophe thousands separators.
         * @param number The number to format.
         * @returns The formatted number.
         */
        this.numberWithCommas = (number) => {
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
    /**
     * Adds an upgrade to the member.
     * @param upgrade The upgrade to add.
     */
    addUpgrade(upgrade) {
        this.upgrades.push(upgrade);
    }
    /**
     * Creates the DOM elements for the member row.
     */
    createDomElement() {
        const template = document.createElement("template");
        template.innerHTML = `
            <article class="members__member">
                <div class="members__heading">
                    <p class="members__title"></p>
                    <p class="members__amount"></p>
                </div>
                <div class="members__imageContainer" style="background-image: url('${this.dom.image.src}')"></div>
                <div class="members__infoContainer">
                    <p class="members__power"></p>
                </div>
                <div class="members__footer">
                    <p class="members__buy"><span class="members__price"></span></p>
                    <p class="members__buy members__buy--small">?</p>
                </div>
            </article>
        `;
        const container = template.content.firstElementChild;
        const imageContainer = container.querySelector(".members__imageContainer");
        const infoContainer = container.querySelector(".members__infoContainer");
        const amountContainer = container.querySelector(".members__amountContainer");
        const title = container.querySelector(".members__title");
        const amount = container.querySelector(".members__amount");
        const power = container.querySelector(".members__power");
        const price = container.querySelector(".members__price");
        const buy = container.querySelector(".members__buy");
        const statHandler = container.querySelector(".members__buy--small");
        title.textContent = this.name;
        amount.textContent = String("x" + this.amount);
        this.dom.container = container;
        this.dom.imageContainer = imageContainer;
        this.dom.infoContainer = infoContainer;
        this.dom.amountContainer = amountContainer;
        this.dom.title = title;
        this.dom.amount = amount;
        this.dom.power = power;
        this.dom.price = price;
        this.dom.buyHandler = buy;
        this.dom.statHandler = statHandler;
        this.updatePrice();
        this.updatePower(null);
    }
    /**
     * Appends the member row to the page.
     */
    applyToDom() {
        this.container.append(this.dom.container);
    }
    /**
     * Calculates the current purchase price.
     * @returns The current member price.
     */
    getPrice() {
        if (this.amount === 0) {
            return this.basePrice;
        }
        return Math.ceil(this.basePrice * Math.pow(1.15, this.amount));
    }
    /**
     * Updates the displayed member amount.
     */
    updateAmount() {
        if (this.amount <= 0) {
            this.dom.amount.classList.add("hidden");
        }
        else {
            this.dom.amount.classList.remove("hidden");
            this.dom.amount.innerHTML = "<span class='members__amount-span'>x</span>" + this.amount;
        }
    }
    /**
     * Updates the displayed member price.
     */
    updatePrice() {
        this.dom.price.innerHTML = window.numberAsText(this.getPrice()) + "";
    }
    /**
     * Updates whether the member can currently be bought.
     * @param score The current score.
     */
    updateBuyability(score) {
        if (this.getPrice() > score) {
            this.dom.container.classList.add("members__disabled");
        }
        else {
            this.dom.container.classList.remove("members__disabled");
        }
    }
    /**
     * Updates the displayed production value.
     * @param buff The active buff, if any.
     */
    updatePower(buff) {
        if (buff && this.id === buff.referenceMemberId) {
            this.dom.power.innerHTML = window.numberAsText(this.basePower * this.getMultiplier() * buff.power) + " cps";
        }
        else {
            this.dom.power.innerHTML = window.numberAsText(this.basePower * this.getMultiplier()) + " cps";
        }
    }
    /**
     * Calculates the current production increase of the member.
     * @param buff The active buff, if any.
     * @returns The current production increase.
     */
    getIncrease(buff) {
        if (buff && this.id === buff.referenceMemberId) {
            return this.basePower * this.amount * this.getMultiplier() * buff.power;
        }
        return this.basePower * this.amount * this.getMultiplier();
    }
    /**
     * Calculates the member multiplier from bought upgrades.
     * @returns The current multiplier.
     */
    getMultiplier() {
        let multiplier = 1;
        this.upgrades.forEach((upgrade) => {
            if (upgrade.bought) {
                multiplier *= upgrade.multiplier;
            }
        });
        return multiplier;
    }
    /**
     * Increases the owned amount by one.
     */
    buy() {
        this.amount++;
    }
    /**
     * Returns the owned amount.
     * @returns The current amount.
     */
    getAmount() {
        return this.amount;
    }
    /**
     * Sets the owned amount.
     * @param amount The new amount.
     */
    setAmount(amount) {
        this.amount = amount;
    }
    /**
     * Updates all upgrades related to this member.
     * @param score The current score.
     * @param showBought Whether bought upgrades should remain visible.
     */
    updateUpgrades(score, showBought) {
        this.upgrades.forEach((upgrade) => {
            upgrade.updateVisibility(this.amount, showBought);
            upgrade.updateBuyability(score);
        });
    }
    /**
     * Updates the member UI.
     * @param score The current score.
     * @param showBought Whether bought upgrades should remain visible.
     * @param buff The active buff, if any.
     */
    update(score, showBought, buff) {
        this.updateBuyability(score);
        this.updatePower(buff);
        this.updateAmount();
        this.updateUpgrades(score, showBought);
        this.updatePrice();
    }
}
//# sourceMappingURL=Member.js.map