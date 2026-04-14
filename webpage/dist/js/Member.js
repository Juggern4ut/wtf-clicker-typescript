"use strict";
/**
 * Represents a buyable club member.
 */
class Member {
    id;
    amount;
    name;
    basePower;
    basePrice;
    nextPrice = 0;
    container;
    multiplier = 1;
    upgrades = [];
    image;
    dom = {
        container: null,
        title: null,
        image: null,
        amount: null,
        price: null,
        imageContainer: null,
        infoContainer: null,
        amountContainer: null,
        power: null,
    };
    /**
     * Creates a member instance.
     *
     * @param name The member name.
     * @param basePower The base production power.
     * @param basePrice The initial price.
     * @param image The image file name.
     * @param id The member id.
     */
    constructor(name, basePower, basePrice, image, id) {
        this.amount = 0;
        this.basePower = basePower;
        this.name = name;
        this.basePrice = basePrice;
        this.id = id;
        this.dom.image = document.createElement("img");
        this.dom.image.src = "/img/members/" + image;
        this.dom.image.classList.add("members__image");
        this.container = getRequiredElement(".members");
        this.createDomElement();
        this.applyToDom();
    }
    /**
     * Adds an upgrade to the member.
     *
     * @param upgrade The upgrade to attach.
     */
    addUpgrade(upgrade) {
        this.upgrades.push(upgrade);
    }
    /**
     * Formats a number using apostrophe thousands separators.
     *
     * @param number The value to format.
     * @returns The formatted value.
     */
    numberWithCommas = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    };
    /**
     * Creates the member DOM structure.
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
                <p class="members__buy"><span class="members__price"></span></p>
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
        title.textContent = this.name;
        amount.textContent = String("x" + this.amount);
        if (this.dom.image) {
            imageContainer.append(this.dom.image);
        }
        this.dom.container = container;
        this.dom.imageContainer = imageContainer;
        this.dom.infoContainer = infoContainer;
        this.dom.amountContainer = amountContainer;
        this.dom.title = title;
        this.dom.amount = amount;
        this.dom.power = power;
        this.dom.price = price;
        this.updatePrice();
        this.updatePower(null);
    }
    /**
     * Appends the member DOM to the container.
     */
    applyToDom() {
        this.container.append(this.dom.container);
    }
    /**
     * Returns the current member price.
     *
     * @returns The current purchase price.
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
     *
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
     * Updates the displayed member power.
     *
     * @param buff The currently active buff.
     */
    updatePower(buff) {
        if (buff && this.id === buff.referenceMemberId) {
            this.dom.power.innerHTML = window.numberAsText(this.basePower * this.getMultiplier() * buff.power) + " p/s";
        }
        else {
            this.dom.power.innerHTML = window.numberAsText(this.basePower * this.getMultiplier()) + " p/s";
        }
    }
    /**
     * Returns the current production increase.
     *
     * @param buff The currently active buff.
     * @returns The production increase.
     */
    getIncrease(buff) {
        if (buff && this.id === buff.referenceMemberId) {
            return this.basePower * this.amount * this.getMultiplier() * buff.power;
        }
        return this.basePower * this.amount * this.getMultiplier();
    }
    /**
     * Returns the current member multiplier.
     *
     * @returns The computed multiplier.
     */
    getMultiplier() {
        let multiplier = 1;
        this.upgrades.forEach((u) => {
            if (u.bought) {
                multiplier *= u.multiplier;
            }
        });
        return multiplier;
    }
    /**
     * Increments the owned member amount.
     */
    buy() {
        this.amount++;
    }
    /**
     * Updates all attached upgrades.
     *
     * @param score The current score.
     * @param showBought Whether bought upgrades should stay visible.
     */
    updateUpgrades(score, showBought) {
        this.upgrades.forEach((u) => {
            u.updateVisibility(this.amount, showBought);
            u.updateBuyability(score);
        });
    }
    /**
     * Updates the member DOM state.
     *
     * @param score The current score.
     * @param showBought Whether bought upgrades should stay visible.
     * @param buff The currently active buff.
     */
    update(score, showBought, buff) {
        this.updateBuyability(score);
        this.updatePower(buff);
        this.updateAmount();
        this.updateUpgrades(score, showBought);
        this.updatePrice();
    }
}
