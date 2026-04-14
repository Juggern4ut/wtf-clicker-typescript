import type { Item } from "./Item.js";
import type { Upgrade } from "./Upgrade.js";

/**
 * Represents the DOM elements used by a member entry.
 */
interface MemberDom {
    container: HTMLElement;
    title: HTMLElement;
    image: HTMLImageElement;
    amount: HTMLElement;
    price: HTMLElement;
    imageContainer: HTMLElement;
    buyHandler: HTMLElement;
    infoContainer: HTMLElement;
    amountContainer: HTMLElement;
    power: HTMLElement;
    statHandler: HTMLElement;
}

/**
 * Represents a purchasable club member.
 */
export class Member {
    id: number;
    amount: number;
    name: string;
    basePower: number;
    basePrice: number;
    nextPrice: number = 0;
    container: HTMLElement;
    multiplier: number = 1;
    upgrades: Upgrade[] = [];
    image!: HTMLImageElement;
    dom = {} as MemberDom;

    /**
     * Creates a new member instance.
     * @param name The member name.
     * @param basePower The member base production.
     * @param basePrice The member base price.
     * @param image The member image filename.
     * @param id The member id.
     */
    constructor(name: string, basePower: number, basePrice: number, image: string, id: number) {
        this.amount = 0;
        this.basePower = basePower;
        this.name = name;
        this.basePrice = basePrice;
        this.id = id;

        this.dom.image = document.createElement("img");
        this.dom.image.src = "/img/members/" + image;
        this.dom.image.classList.add("members__image");

        this.container = document.querySelector(".members") as HTMLElement;
        this.createDomElement();
        this.applyToDom();
    }

    /**
     * Adds an upgrade to the member.
     * @param upgrade The upgrade to add.
     */
    addUpgrade(upgrade: Upgrade): void {
        this.upgrades.push(upgrade);
    }

    /**
     * Formats a number with apostrophe thousands separators.
     * @param number The number to format.
     * @returns The formatted number.
     */
    numberWithCommas = (number: number): string => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    };

    /**
     * Creates the DOM elements for the member row.
     */
    createDomElement(): void {
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

        const container = template.content.firstElementChild as HTMLElement;
        const imageContainer = container.querySelector(".members__imageContainer") as HTMLDivElement;
        const infoContainer = container.querySelector(".members__infoContainer") as HTMLDivElement;
        const amountContainer = container.querySelector(".members__amountContainer") as HTMLDivElement;
        const title = container.querySelector(".members__title") as HTMLParagraphElement;
        const amount = container.querySelector(".members__amount") as HTMLParagraphElement;
        const power = container.querySelector(".members__power") as HTMLParagraphElement;
        const price = container.querySelector(".members__price") as HTMLParagraphElement;
        const buy = container.querySelector(".members__buy") as HTMLParagraphElement;
        const statHandler = container.querySelector(".members__buy--small") as HTMLParagraphElement;

        title.textContent = this.name;
        amount.textContent = String("x" + this.amount);

        this.dom.container = container as HTMLElement;
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
    applyToDom(): void {
        this.container.append(this.dom.container);
    }

    /**
     * Calculates the current purchase price.
     * @returns The current member price.
     */
    getPrice(): number {
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
            this.dom.amount!.classList.add("hidden");
        } else {
            this.dom.amount!.classList.remove("hidden");
            this.dom.amount!.innerHTML = "<span class='members__amount-span'>x</span>" + this.amount;
        }
    }

    /**
     * Updates the displayed member price.
     */
    updatePrice(): void {
        this.dom.price.innerHTML = window.numberAsText(this.getPrice()) + "";
    }

    /**
     * Updates whether the member can currently be bought.
     * @param score The current score.
     */
    updateBuyability(score: number): void {
        if (this.getPrice() > score) {
            this.dom.container.classList.add("members__disabled");
        } else {
            this.dom.container.classList.remove("members__disabled");
        }
    }

    /**
     * Updates the displayed production value.
     * @param buff The active buff, if any.
     */
    updatePower(buff: Item | null): void {
        if (buff && this.id === buff.referenceMemberId) {
            this.dom.power.innerHTML = window.numberAsText(this.basePower * this.getMultiplier() * buff.power) + " cps";
        } else {
            this.dom.power.innerHTML = window.numberAsText(this.basePower * this.getMultiplier()) + " cps";
        }
    }

    /**
     * Calculates the current production increase of the member.
     * @param buff The active buff, if any.
     * @returns The current production increase.
     */
    getIncrease(buff: Item | null): number {
        if (buff && this.id === buff.referenceMemberId) {
            return this.basePower * this.amount * this.getMultiplier() * buff.power;
        }

        return this.basePower * this.amount * this.getMultiplier();
    }

    /**
     * Calculates the member multiplier from bought upgrades.
     * @returns The current multiplier.
     */
    getMultiplier(): number {
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
    buy(): void {
        this.amount++;
    }

    /**
     * Returns the owned amount.
     * @returns The current amount.
     */
    getAmount(): number {
        return this.amount;
    }

    /**
     * Sets the owned amount.
     * @param amount The new amount.
     */
    setAmount(amount: number): void {
        this.amount = amount;
    }

    /**
     * Updates all upgrades related to this member.
     * @param score The current score.
     * @param showBought Whether bought upgrades should remain visible.
     */
    updateUpgrades(score: number, showBought: boolean): void {
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
    update(score: number, showBought: boolean, buff: Item | null): void {
        this.updateBuyability(score);
        this.updatePower(buff);
        this.updateAmount();
        this.updateUpgrades(score, showBought);
        this.updatePrice();
    }
}
