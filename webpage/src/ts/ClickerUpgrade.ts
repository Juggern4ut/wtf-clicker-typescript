/**
 * Defines the visibility requirement for a clicker upgrade.
 */
export interface ClickerUpgradeRequirement {
  type: string;
  value: number;
}

/**
 * Represents a purchasable clicker upgrade.
 */
export class ClickerUpgrade {
  title: string;
  requirement: ClickerUpgradeRequirement;
  power: number;
  type: string;
  price: number;
  container: HTMLElement;
  bought: boolean = false;
  dom: HTMLElement | null = null;
  buyHandler: HTMLElement | null = null;
  id: number;
  description: string;

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
  constructor(title: string, description: string, requirement: ClickerUpgradeRequirement, type: string, power: number, price: number, id: number) {
    this.title = title;
    this.requirement = requirement;
    this.type = type;
    this.power = power;
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
        this.buyHandler = buy;
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
   * @param amount The amount of the referenced member.
   * @param handmadeCaps The number of handmade caps.
   * @param showBought Whether bought upgrades should remain visible.
   */
  updateVisibility(amount: number, handmadeCaps: number, showBought: boolean): void {
    if (!this.dom) {
      return;
    }

    if (this.bought) {
      this.showDom();
      if (showBought) {
        this.dom.classList.add("bought");
      } else {
        this.hideDom();
      }
      return;
    }

    const clickedCookiesVisibility = this.requirement.type === "clickedCookies" && handmadeCaps >= this.requirement.value;
    const memberAmountVisibility = this.requirement.type === "member" && amount >= this.requirement.value;

    if (clickedCookiesVisibility || memberAmountVisibility) {
      this.showDom();
    } else {
      this.hideDom();
    }
  }

  /**
   * Marks the upgrade as bought.
   */
  buy(): void {
    this.bought = true;
  }

  /**
   * Shows the upgrade DOM.
   */
  showDom(): void {
    this.dom?.classList.remove("hidden");
  }

  /**
   * Hides the upgrade DOM.
   */
  hideDom(): void {
    this.dom?.classList.add("hidden");
  }
}
