class Item {
  name: string;
  image: HTMLImageElement;
  imageString: string;
  description: string;
  text: string;
  duration: number;
  consumable: boolean;
  dom: HTMLElement;
  referenceMemberId: number;
  amount: number = 0;
  power: number;
  id: number;

  constructor(id: number, name: string, icon: string, description: string, text: string, referenceMemberId: number, power: number, consumable: boolean, duration: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageString = icon;
    this.text = text;
    this.referenceMemberId = referenceMemberId;
    this.power = power;
    this.consumable = consumable;
    this.duration = duration;
    this.createImage();
    this.createDom();
  }

  createDom() {
    this.dom = document.createElement("article");
    this.dom.classList.add("inventory__item");

    const info = document.createElement("div");

    let description = document.createElement("p");
    description.innerHTML = this.description;

    let text = document.createElement("p");
    text.classList.add("u-italic");
    text.innerHTML = '"' + this.text + '"';

    let title = document.createElement("p");
    title.classList.add("inventory__item-title");
    title.innerHTML = this.name;

    let amount = document.createElement("p");
    amount.classList.add("inventory__item-amount");
    amount.innerHTML = this.amount + " x";

    info.append(title);
    info.append(text);
    info.append(description);

    this.dom.append(this.image);
    this.dom.append(info);
    this.dom.append(amount);
  }

  updateAmount() {
    let el = this.dom.querySelector(".inventory__item-amount");
    el.innerHTML = this.amount + " x";
  }

  createImage() {
    this.image = document.createElement("img");
    this.image.src = "/img/items/" + this.imageString;
    this.image.classList.add("inventory__item-image");
  }
}
