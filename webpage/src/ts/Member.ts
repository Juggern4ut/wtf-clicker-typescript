interface Dom {
  container: HTMLElement;
  title: HTMLElement;
  image: HTMLImageElement;
  amount: HTMLElement;
  price: HTMLElement;
  imageContainer: HTMLElement;
  infoContainer: HTMLElement;
  amountContainer: HTMLElement;
  power: HTMLElement;
}

class Member {
  id: number;
  amount: number;
  name: string;
  basePower: number;
  basePrice: number;
  nextPrice: number;
  container: HTMLElement;
  multiplier: number = 1;
  upgrades: Upgrade[] = [];
  image: HTMLImageElement;
  dom: Dom = {
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

  constructor(name: string, basePower: number, basePrice: number, image: string, id: number) {
    this.amount = 0;
    this.basePower = basePower;
    this.name = name;
    this.basePrice = basePrice;
    this.id = id;

    this.dom.image = document.createElement("img");
    this.dom.image.src = "/img/members/" + image;
    this.dom.image.classList.add("members__image");

    this.container = document.querySelector(".members");
    this.createDomElement();
    this.applyToDom();
  }

  addUpgrade(upgrade: Upgrade) {
    this.upgrades.push(upgrade);
  }

  numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  createDomElement() {
    this.dom.imageContainer = document.createElement("div");
    this.dom.imageContainer.classList.add("members__imageContainer");

    this.dom.infoContainer = document.createElement("div");
    this.dom.infoContainer.classList.add("members__infoContainer");

    this.dom.amountContainer = document.createElement("div");
    this.dom.amountContainer.classList.add("members__amountContainer");

    this.dom.title = document.createElement("p");
    this.dom.title.classList.add("members__title");

    this.dom.amount = document.createElement("p");
    this.dom.amount.classList.add("members__amount");

    this.dom.power = document.createElement("p");
    this.dom.power.classList.add("members__power");

    this.dom.title.innerHTML = this.name;
    this.dom.amount.innerHTML = "" + this.amount;

    this.dom.container = document.createElement("article");
    this.dom.container.classList.add("members__member");

    this.dom.price = document.createElement("p");
    this.dom.price.classList.add("members__price");
    this.updatePrice();

    this.dom.imageContainer.append(this.dom.image);

    this.dom.infoContainer.append(this.dom.title);
    this.dom.amountContainer.append(this.dom.amount);
    this.dom.infoContainer.append(this.dom.power);
    this.dom.infoContainer.append(this.dom.price);
    this.updatePower();

    this.dom.container.append(this.dom.imageContainer);
    this.dom.container.append(this.dom.infoContainer);
    this.dom.container.append(this.dom.amountContainer);
  }

  applyToDom() {
    this.container.append(this.dom.container);
  }

  getPrice(): number {
    if (this.amount === 0) {
      return this.basePrice;
    }
    return Math.ceil(this.basePrice * Math.pow(1.15, this.amount));
  }

  updateAmount() {
    this.dom.amount.innerHTML = "" + this.amount;
  }

  updatePrice() {
    this.dom.price.innerHTML = window["numberAsText"](this.getPrice()) + "";
  }

  updateBuyability(score: number) {
    if (this.getPrice() > score) {
      this.dom.container.classList.add("members__disabled");
    } else {
      this.dom.container.classList.remove("members__disabled");
    }
  }

  updatePower() {
    this.dom.power.innerHTML = window["numberAsText"](this.basePower * this.getMultiplier()) + " p/s";
  }

  getIncrease(): number {
    return this.basePower * this.amount * this.getMultiplier();
  }

  getMultiplier(): number {
    let multiplier = 1;
    this.upgrades.forEach((u) => {
      if (u.bought) {
        multiplier *= u.multiplier;
      }
    });
    return multiplier;
  }

  buy() {
    this.amount++;
  }

  updateUpgrades(score: number, showBought: boolean) {
    this.upgrades.forEach((u) => {
      u.updateVisibility(this.amount, showBought);
      u.updateBuyability(score);
    });
  }

  update(score: number, showBought: boolean) {
    this.updateBuyability(score);
    this.updatePower();
    this.updateAmount();
    this.updateUpgrades(score, showBought);
    this.updatePrice();
  }
}
