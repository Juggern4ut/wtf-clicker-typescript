class ClickerUpgrade {
  title: string;
  requirement: object;
  power: number;
  type: string;
  price: number;
  container: HTMLElement;
  bought: boolean = false;
  dom: HTMLElement = null;
  id: number;
  description: string;

  constructor(title: string, description: string, requirement: object, type: string, power: number, price: number, id: number) {
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

  updateVisibility(amount, handmadeCaps, showBought) {
    if (this.bought) {
      this.showDom();
      if (showBought) {
        this.dom.classList.add("bought");
      } else {
        this.hideDom();
      }
      return;
    }

    const clickedCookiesVisibility = this.requirement["type"] === "clickedCookies" && handmadeCaps >= this.requirement["value"];
    const memberAmountVisibility = this.requirement["type"] === "member" && amount >= this.requirement["value"];

    if (clickedCookiesVisibility || memberAmountVisibility) {
      this.showDom();
    } else {
      this.hideDom();
    }
  }

  buy() {
    this.bought = true;
  }

  showDom() {
    this.dom.classList.remove("hidden");
  }

  hideDom() {
    this.dom.classList.add("hidden");
  }
}
