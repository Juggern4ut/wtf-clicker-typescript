/**
 * Represents a collectible or consumable inventory item.
 */
export class Item {
  name: string;
  image!: HTMLImageElement;
  imageString: string;
  description: string;
  text: string;
  duration: number;
  consumable: boolean;
  dom!: HTMLElement;
  referenceMemberId: number;
  amount: number = 0;
  power: number;
  id: number;
  getFromPelo: boolean;

  /**
   * Creates a new item instance.
   * @param id The item id.
   * @param name The item name.
   * @param icon The image filename.
   * @param description The item description.
   * @param text The item flavor text.
   * @param referenceMemberId The related member id for item buffs.
   * @param power The effect strength.
   * @param consumable Whether the item can be consumed.
   * @param duration The buff duration in seconds.
   * @param getFromPelo Whether the item can drop from golden Pelos.
   */
  constructor(
    id: number,
    name: string,
    icon: string,
    description: string,
    text: string,
    referenceMemberId: number,
    power: number,
    consumable: boolean,
    duration: number,
    getFromPelo: boolean
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageString = icon;
    this.text = text;
    this.referenceMemberId = referenceMemberId;
    this.power = power;
    this.consumable = consumable;
    this.duration = duration;
    this.getFromPelo = getFromPelo;
    this.createImage();
    this.createDom();
  }

  /**
   * Creates the DOM representation of the item.
   */
  createDom(): void {
    this.dom = document.createElement("article");
    this.dom.classList.add("inventory__item");

    const info = document.createElement("div");

    const description = document.createElement("p");
    description.innerHTML = this.description;

    const text = document.createElement("p");
    text.classList.add("u-italic");
    text.innerHTML = '"' + this.text + '"';

    const title = document.createElement("p");
    title.classList.add("inventory__item-title");
    title.innerHTML = this.name;

    const amount = document.createElement("p");
    amount.classList.add("inventory__item-amount");
    amount.innerHTML = this.amount + " x";

    info.append(title);
    info.append(text);
    info.append(description);

    this.dom.append(this.image);
    this.dom.append(info);
    this.dom.append(amount);
  }

  /**
   * Updates the displayed amount text.
   */
  updateAmount(): void {
    const el = this.dom.querySelector(".inventory__item-amount") as HTMLElement;
    el.innerHTML = this.amount + " x";
  }

  /**
   * Creates the item image element.
   */
  createImage(): void {
    this.image = document.createElement("img");
    this.image.src = "/img/items/" + this.imageString;
    this.image.classList.add("inventory__item-image");
  }
}
