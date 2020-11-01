class Buff {
  activeBuff: Item;
  buffStart: number;

  constructor() {}

  consumeItem(item: Item) {
    this.activeBuff = item;
    this.buffStart = Date.now();
  }

  checkBuff() {
    if (!this.activeBuff) return false;
    return this.buffStart + this.activeBuff.duration * 1000 > Date.now();
  }
}
