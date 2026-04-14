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
