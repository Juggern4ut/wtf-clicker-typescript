class Upgrade {
  title: string;
  requirement: number;
  multiplier: number;
  price: number;
  container: HTMLElement;
  bought: boolean = false;
  dom: HTMLElement = null;
  id: number;
  description: string;

  constructor(title: string, description: string, requirement: number, multiplier: number, price: number, id: number) {
    this.title = title;
    this.requirement = requirement;
    this.multiplier = multiplier;
    this.description = description;
    this.price = price;
    this.id = id;
    this.container = document.querySelector(".upgrades");
    this.createDom();
  }

  createDom() {
    this.dom = document.createElement("article");
    this.dom.classList.add("upgrades__upgrade");
    this.dom.classList.add("hidden");

    const price = document.createElement("p");
    price.classList.add("upgrades__price");
    price.innerHTML = window["numberAsText"](this.price);

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

  updateBuyability(score) {
    if (!this.dom) return false;

    if (score > this.price || this.bought) {
      this.dom.classList.remove("disabled");
    } else {
      this.dom.classList.add("disabled");
    }
  }

  updateVisibility(amount, showBought) {
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
