/**
 * Represents a purchasable member upgrade.
 */
export class Upgrade {
    title: string;
    requirement: number;
    multiplier: number;
    price: number;
    container: HTMLElement;
    bought: boolean = false;
    dom: HTMLElement | null = null;
    buy: HTMLElement | null = null;
    id: number;
    description: string;

    /**
     * Creates a new upgrade.
     * @param title The upgrade title.
     * @param description The upgrade description.
     * @param requirement The owned member requirement.
     * @param multiplier The multiplier effect.
     * @param price The upgrade price.
     * @param id The upgrade id.
     */
    constructor(title: string, description: string, requirement: number, multiplier: number, price: number, id: number) {
        this.title = title;
        this.requirement = requirement;
        this.multiplier = multiplier;
        this.description = description;
        this.price = price;
        this.id = id;
        this.container = document.querySelector(".upgrades") as HTMLElement;
        this.createDom();
    }

    /**
     * Creates the DOM representation of the upgrade.
     */
    createDom(): void {
        const template = document.createElement("template");

        template.innerHTML = `
            <article class="upgrades__upgrade hidden">
                <section class="upgrades__infos">
                    <p class="upgrades__title"></p>
                    <p class="upgrades__description" style="font-size:12px"></p>
                </section>
                <p class="upgrades__buy"><span class="upgrades__price"></span></p>
            </article>
          `;

        const root = template.content.firstElementChild as HTMLElement;

        const title = root.querySelector(".upgrades__title") as HTMLParagraphElement;
        const effect = root.querySelector(".upgrades__description") as HTMLParagraphElement;
        const price = root.querySelector(".upgrades__price") as HTMLParagraphElement;
        const buy = root.querySelector(".upgrades__buy") as HTMLParagraphElement;

        title.textContent = this.title;
        effect.textContent = this.description;
        price.textContent = window.numberAsText(this.price);

        this.dom = root;
        this.buy = buy;
        this.container.append(root);
    }

    /**
     * Updates whether the upgrade can be bought.
     * @param score The current score.
     * @returns `false` when the DOM is not available.
     */
    updateBuyability(score: number): boolean | void {
        if (!this.dom) {
            return false;
        }

        if (score > this.price || this.bought) {
            this.dom.classList.remove("disabled");
        } else {
            this.dom.classList.add("disabled");
        }
    }

    /**
     * Updates whether the upgrade should be visible.
     * @param amount The current owned member amount.
     * @param showBought Whether bought upgrades should remain visible.
     */
    updateVisibility(amount: number, showBought: boolean): void {
        if (!this.dom) {
            return;
        }

        if (this.bought) {
            this.dom.classList.remove("hidden");
            if (showBought) {
                this.dom.classList.add("bought");
            } else {
                this.dom.classList.add("hidden");
            }
            return;
        }

        if (this.requirement <= amount) {
            this.dom.classList.remove("hidden");
        } else {
            this.dom.classList.add("hidden");
        }
    }
}
