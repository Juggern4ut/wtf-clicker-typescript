/**
 * Represents a purchasable clicker upgrade.
 */
export class ClickerUpgrade {
    /**
     * Creates a new clicker upgrade.
     * @param title The upgrade title.
     * @param description The upgrade description.
     * @param requirement The requirement for showing the upgrade.
     * @param type The upgrade effect type.
     * @param power The effect strength.
     * @param price The purchase price.
     * @param id The upgrade id.
     */
    constructor(title, description, requirement, type, power, price, id) {
        this.bought = false;
        this.dom = null;
        this.title = title;
        this.requirement = requirement;
        this.type = type;
        this.power = power;
        this.description = description;
        this.price = price;
        this.id = id;
        this.container = document.querySelector(".upgrades");
        this.createDom();
    }
    /**
     * Creates the DOM representation of the upgrade.
     */
    createDom() {
        this.dom = document.createElement("article");
        this.dom.classList.add("upgrades__upgrade");
        this.dom.classList.add("hidden");
        const price = document.createElement("p");
        price.classList.add("upgrades__price");
        price.innerHTML = window.numberAsText(this.price);
        const title = document.createElement("p");
        title.innerHTML = this.title;
        const effect = document.createElement("p");
        effect.style.fontSize = 12 + "px";
        effect.classList.add("upgrades__description");
        effect.innerHTML = this.description;
        this.dom.append(title);
        this.dom.append(effect);
        this.dom.append(price);
        this.container.append(this.dom);
    }
    /**
     * Updates whether the upgrade can be bought.
     * @param score The current score.
     * @returns `false` when the DOM is not available.
     */
    updateBuyability(score) {
        if (!this.dom) {
            return false;
        }
        if (score > this.price || this.bought) {
            this.dom.classList.remove("disabled");
        }
        else {
            this.dom.classList.add("disabled");
        }
    }
    /**
     * Updates whether the upgrade should be visible.
     * @param amount The amount of the referenced member.
     * @param handmadeCaps The number of handmade caps.
     * @param showBought Whether bought upgrades should remain visible.
     */
    updateVisibility(amount, handmadeCaps, showBought) {
        if (!this.dom) {
            return;
        }
        if (this.bought) {
            this.showDom();
            if (showBought) {
                this.dom.classList.add("bought");
            }
            else {
                this.hideDom();
            }
            return;
        }
        const clickedCookiesVisibility = this.requirement.type === "clickedCookies" && handmadeCaps >= this.requirement.value;
        const memberAmountVisibility = this.requirement.type === "member" && amount >= this.requirement.value;
        if (clickedCookiesVisibility || memberAmountVisibility) {
            this.showDom();
        }
        else {
            this.hideDom();
        }
    }
    /**
     * Marks the upgrade as bought.
     */
    buy() {
        this.bought = true;
    }
    /**
     * Shows the upgrade DOM.
     */
    showDom() {
        this.dom?.classList.remove("hidden");
    }
    /**
     * Hides the upgrade DOM.
     */
    hideDom() {
        this.dom?.classList.add("hidden");
    }
}
