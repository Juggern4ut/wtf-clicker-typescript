interface Dom {
  container: HTMLElement;
  title: HTMLElement;
  image: HTMLImageElement;
  amount: HTMLElement;
  price: HTMLElement;
}

class Member {
  amount: number;
  name: string;
  basePower: number;
  basePrice: number;
  nextPrice: number;
  container: HTMLElement;
  image: HTMLImageElement;
  dom: Dom = {
    container: null,
    title: null,
    image: null,
    amount: null,
    price: null,
  };

  constructor(name: string, basePower: number, basePrice: number, image: string) {
    this.amount = 0;
    this.basePower = basePower;
    this.name = name;
    this.basePrice = basePrice;

    this.dom.image = document.createElement("img") as HTMLImageElement;
    this.dom.image.src = "/img/members/" + image;
    this.dom.image.classList.add("members__image");

    this.container = document.querySelector(".members");
    this.createDomElement();
    this.applyToDom();
  }

  numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  createDomElement() {
    this.dom.title = document.createElement("p");
    this.dom.amount = document.createElement("p");

    this.dom.title.innerHTML = this.name;
    this.dom.amount.innerHTML = "Anzahl:" + this.amount;

    this.dom.container = document.createElement("article");
    this.dom.container.classList.add("members__member");

    this.dom.price = document.createElement("p");
    this.updatePrice();

    this.dom.container.append(this.dom.title);
    this.dom.container.append(this.dom.image);
    this.dom.container.append(this.dom.amount);
    this.dom.container.append(this.dom.price);
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
    this.dom.amount.innerHTML = "Anzahl: " + this.amount;
  }

  updatePrice() {
    this.dom.price.innerHTML = window["numberWithCommas"](this.getPrice()) + "";
  }

  updateBuyability(score: number) {
    if (this.getPrice() > score) {
      this.dom.container.classList.add("members__disabled");
    } else {
      this.dom.container.classList.remove("members__disabled");
    }
  }

  getIncrease(): number {
    return this.basePower * this.amount;
  }

  buy() {
    this.amount++;
    this.update();
  }

  update() {
    this.updateAmount();
    this.updatePrice();
  }
}
