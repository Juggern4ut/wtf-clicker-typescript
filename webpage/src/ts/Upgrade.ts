class Upgrade {
  title: string;
  reference: Member;
  requirement: number;
  multiplier: number;
  price: number;
  container: HTMLElement;
  domCreated: boolean = false;
  bought: boolean = false;
  dom: HTMLElement = null;

  constructor(title: string, reference: Member, requirement: number, multiplier: number, price: number) {
    this.title = title;
    this.reference = reference;
    this.requirement = requirement;
    this.multiplier = multiplier;
    this.price = price;
    this.container = document.querySelector(".upgrades");
    this.update();
  }

  createDom() {
    this.dom = document.createElement("article");
    this.dom.classList.add("upgrades__upgrade");

    const price = document.createElement("p");
    price.innerHTML = window["numberWithCommas"](this.price);

    const title = document.createElement("p");
    title.innerHTML = this.title;

    this.dom.append(title);
    this.dom.append(price);

    if (this.domCreated) return false;
    this.container.append(this.dom);
    this.domCreated = true;
  }

  buy() {
    if (!this.bought) {
      this.bought = true;
      this.reference.multiplier *= this.multiplier;
      this.update();
      this.reference.updatePower();
      return this.price;
    }
    return 0;
  }

  update() {
    if (this.reference.amount >= this.requirement && !this.bought) {
      this.createDom();
    }

    if (this.dom) {
      if (this.bought) {
        this.dom.remove();
      }
    }
  }
}
