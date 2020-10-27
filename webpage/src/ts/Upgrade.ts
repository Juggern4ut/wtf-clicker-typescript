class Upgrade {
  title: string;
  reference: Member;
  requirement: number;
  multiplier: number;
  price: number;
  container: HTMLElement;
  bought: boolean = false;
  dom: HTMLElement = null;

  constructor(title: string, reference: Member, requirement: number, multiplier: number, price: number) {
    this.title = title;
    this.reference = reference;
    this.requirement = requirement;
    this.multiplier = multiplier;
    this.price = price;
    this.container = document.querySelector(".upgrades");
    this.createDom();
  }

  createDom() {
    this.dom = document.createElement("article");
    this.dom.classList.add("upgrades__upgrade");
    this.dom.classList.add("hidden");

    const price = document.createElement("p");
    price.innerHTML = window["numberWithCommas"](this.price);

    const title = document.createElement("p");
    title.innerHTML = this.title;

    const effect = document.createElement("p");
    effect.style.fontSize = 12 + "px";
    effect.innerHTML = this.reference.name + " wird " + this.multiplier + "x effektiver!<br /><br />";

    this.dom.append(title);
    this.dom.append(effect);
    this.dom.append(price);

    this.container.append(this.dom);
  }

  updateBuyability(score) {
    if (!this.dom) return false;

    if (score > this.price) {
      this.dom.classList.remove("disabled");
    } else {
      this.dom.classList.add("disabled");
    }
  }

  updateVisibility() {
    if (this.bought) {
      this.dom.classList.add("hidden");
      return;
    }

    if (this.requirement <= this.reference.amount) {
      this.dom.classList.remove("hidden");
    } else {
      this.dom.classList.add("hidden");
    }
  }

  buy() {
    if (!this.bought) {
      this.bought = true;
      this.reference.multiplier *= this.multiplier;
      this.reference.updatePower();
    }
  }
}
