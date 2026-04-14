class Buff {
  activeBuff: Item;
  buffStart: number;
  members: Member[];

  constructor(members: Member[]) {
    this.members = members;
  }

  consumeItem(item: Item) {
    if (item.duration > 0) {
      this.activeBuff = item;
      this.buffStart = Date.now();
      const activeBuffImage = document.querySelector(".active_buff__image") as HTMLImageElement;
      activeBuffImage.src = "/img/items/" + this.activeBuff.imageString;
    } else {

      if (item.id === 1000) {
        let member = this.getRandomMember(true);
        member.amount++;
        alert("Gratuliere! 1x " + member.name);
      } else if (item.id === 4) {
        let wonMember = this.getRandomMember(true);
        let lostMember = this.getRandomMember(true);
        wonMember.amount++;
        lostMember.amount--;
        alert("Mitgliederveränderungen: +1 " + wonMember.name + ", -1 " + lostMember.name);
      }
      
    }
  }

  checkBuff() {
    if (!this.activeBuff) return false;
    return this.buffStart + this.activeBuff.duration * 1000 > Date.now();
  }

  update() {
    if (!this.checkBuff()) {
      this.activeBuff = null;
      this.buffStart = null;
    }
    this.updateDom();
  }

  updateDom() {
    const body = document.querySelector("body");
    const activeBuff = document.querySelector(".active_buff");
    const activeBuffInner = document.querySelector(".active_buff__time--inner") as HTMLElement;

    if (this.activeBuff) {
      let dur = this.activeBuff.duration * 1000;
      let remain = (this.buffStart + dur - Date.now()) / (this.activeBuff.duration * 1000);

      body.classList.add("buff");
      activeBuff.classList.add("active_buff--visible");
      activeBuffInner.style.width = remain * 100 + "%";
    } else {
      body.classList.remove("buff");
      activeBuff.classList.remove("active_buff--visible");
    }
  }

  getRandomMember(bought: boolean = true) {
    let possible = [];
    this.members.forEach((m) => {
      if (m.amount > 0 || !bought) {
        possible.push(m);
      }
    });
    return possible[Math.floor(Math.random() * possible.length)];
  }
}
