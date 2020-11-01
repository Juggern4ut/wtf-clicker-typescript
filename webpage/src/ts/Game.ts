class Game {
  intervalSpeed: number = 100;
  stepInterval: NodeJS.Timeout;
  members: Member[] = [];
  upgrades: Upgrade[] = [];
  clickerUpgrades: ClickerUpgrade[] = [];
  items: Item[] = [];
  score: number = 0;
  scoreElement: Score;
  save: Save;
  showBoughtUpgrades: boolean;
  saveInterval: NodeJS.Timeout;
  clicker: Clicker;
  lastUpdate: number;
  inventoryContainer: HTMLElement;
  activeBuff: Item;
  buffStart: number;
  dailyBonusGot: number = 0;
  saveDialog: HTMLElement;
  loadDialog: HTMLElement;
  handmadeCaps: number = 0;
  capsPerSecond: number;
  totalMembers: number;
  runStarted: number;
  runDuration: number;
  possibleItems: object[] = [];
  goldenpelo: HTMLImageElement;
  missedGoldenPelo: number = 0;
  multiplier_bonus: HTMLElement;
  multiplier_bonus__inner: HTMLElement;
  inventory: Inventory;

  clickerMultiplier: number = 1;
  lastClickTimestamp: number;
  continuousClicks: number = 0;

  constructor() {
    this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
    this.clicker = new Clicker(this);
    this.saveDialog = document.querySelector(".saveDialog");
    this.loadDialog = document.querySelector(".loadDialog");
    this.inventoryContainer = document.querySelector(".inventory__content");
    this.runStarted = Date.now();

    this.goldenpelo = document.createElement("img");
    this.goldenpelo.src = "/img/golden_pelo.png";
    this.goldenpelo.classList.add("golden-pelo");

    this.inventory = new Inventory();

    this.multiplier_bonus = document.createElement("div");
    this.multiplier_bonus.classList.add("multiplier_bonus");
    this.multiplier_bonus__inner = document.createElement("p");
    this.multiplier_bonus__inner.classList.add("multiplier_bonus__number");
    this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";

    this.multiplier_bonus.append(this.multiplier_bonus__inner);

    document.querySelector(".clicker").append(this.multiplier_bonus);

    this.instantiateMembers();
    this.loadPossibleItems();

    const showBoughtButton = document.querySelector(".showBought") as HTMLButtonElement;
    showBoughtButton.onclick = () => {
      this.showBoughtUpgrades = !this.showBoughtUpgrades;
      showBoughtButton.innerHTML = this.showBoughtUpgrades ? "Gekaufte Upgrades ausblenden" : "Gekaufte Upgrades anzeigen";
    };

    this.save = new Save(this);

    this.saveInterval = setInterval(() => {
      this.save.save();
    }, 5000);

    this.stepInterval = setInterval(() => {
      this.step();
    }, this.intervalSpeed);

    this.addSaveAndLoadDialogLogic();
  }

  loadPossibleItems() {
    fetch("/data/items.json")
      .then((res) => res.json())
      .then((items) => (this.possibleItems = items));
  }

  instantiateMembers() {
    fetch("/data/members.json")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        res.forEach((mem) => {
          const tmp = new Member(mem.name, mem.basePower, mem.basePrice, mem.image, mem.id);
          this.members.push(tmp);
        });

        this.members.forEach((m) => {
          m.dom.container.onclick = () => {
            if (m.getPrice() <= this.score) {
              this.score -= m.getPrice();
              m.buy();
              this.save.save();
            }
          };
        });

        this.instantiateClickerUpgrades();
      });
  }

  instantiateClickerUpgrades() {
    fetch("/data/clickerUpgrades.json")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        res.forEach((up) => {
          const tmp = new ClickerUpgrade(up.name, up.description, up.requirement, up.type, up.power, up.price, up.id);
          this.clickerUpgrades.push(tmp);
          tmp.dom.onclick = () => {
            if (tmp.price <= this.score) {
              this.score -= tmp.price;
              tmp.buy();
              this.save.save();
            }
          };
        });

        this.instantiateUpgrades();
      });
  }

  instantiateUpgrades() {
    fetch("/data/upgrades.json")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        res.forEach((up) => {
          const tmp = new Upgrade(up.name, up.description, up.requirement, up.multiplier, up.price, up.id);
          const refMember = this.members.find((mem) => mem.id === up.referenceId);
          refMember.addUpgrade(tmp);
        });

        this.members.forEach((m) => {
          m.upgrades.forEach((upgrade) => {
            if (upgrade.dom) {
              upgrade.dom.onclick = () => {
                if (this.score >= upgrade.price && !upgrade.bought) {
                  upgrade.bought = true;
                  this.score -= upgrade.price;
                  this.save.save();
                }
              };
            }
          });
        });

        this.save.load();
      });
  }

  reset() {
    if (confirm("Wirklich den gesamten Fortschritt löschen?")) {
      this.save.reset();
    }
  }

  updateStats() {
    let container = document.querySelector(".stats__content");
    container.innerHTML = "";

    let date = new Date(this.runStarted).toLocaleString();
    let dateEntry = document.createElement("div");
    dateEntry.classList.add("stats__entry");
    dateEntry.innerHTML = "<span>Spielbeginn:</span><span>" + date + "</span>";

    let handMadeEntry = document.createElement("div");
    handMadeEntry.classList.add("stats__entry");
    handMadeEntry.innerHTML = "<span>Von Hand geöffnete Biere:</span><span>" + window["numberAsText"](this.handmadeCaps) + "</span>";

    let missedPeloEntry = document.createElement("div");
    missedPeloEntry.classList.add("stats__entry");
    missedPeloEntry.innerHTML = "<span>Verpasste goldene PeLos:</span><span>" + this.missedGoldenPelo + "</span>";

    let membersEntry = document.createElement("div");
    membersEntry.classList.add("stats__entry");
    membersEntry.innerHTML = "<span>Anzahl Mitglieder:</span><span>" + this.totalMembers + "</span>";

    container.append(dateEntry);
    container.append(handMadeEntry);
    container.append(missedPeloEntry);
    container.append(membersEntry);
  }

  updateInventory() {
    let itemsCollected = [];

    this.items.forEach((item) => {
      let found = itemsCollected.find((i) => i.id === item.id);
      if (!found) {
        itemsCollected.push(item);
        item.amount = 1;
        this.inventoryContainer.append(item.dom);
        item.dom.onclick = () => {
          if (!this.activeBuff) {
            this.consumeBuff(item);
          } else {
            alert("Du kannst nur einen Trank auf einmal aktiv haben!");
          }
        };
      }
    });
  }

  consumeBuff(item) {
    const index = this.items.findIndex((i) => i.id === item.id || i.name === item.name);
    this.items.splice(index, 1);
    document.querySelector(".inventory__modal").classList.remove("inventory__modal--open");
    if (item.id === 1000) {
      let possibleIds = [];
      this.members.forEach((m) => {
        if (m.amount > 0) {
          possibleIds.push(m.id);
        }
      });

      let wonId = Math.floor(Math.random() * possibleIds.length - 1);
      let wonMember = this.members.find((m) => m.id === wonId);

      wonMember.amount++;
      alert("Gratuliere! 1x " + wonMember.name);
    } else if (item.id === 4) {
      let possibleIds = [];
      this.members.forEach((m) => {
        if (m.amount > 0) {
          possibleIds.push(m.id);
        }
      });

      let wonId = Math.floor(Math.random() * possibleIds.length - 1);
      let lostId = Math.floor(Math.random() * possibleIds.length - 1);
      let wonMember = this.members.find((m) => m.id === wonId);
      let lostMember = this.members.find((m) => m.id === lostId);

      wonMember.amount++;
      lostMember.amount--;
      alert("Mitgliederveränderungen: +1 " + wonMember.name + ", -1 " + lostMember.name);
    } else {
      this.buffStart = Date.now();
      this.activeBuff = item;
      document.querySelector(".active_buff__image")["src"] = "/img/items/" + item.imageString;
    }
    this.updateInventory();
    this.save.save();
  }

  checkBuff() {
    if (this.activeBuff) {
      let dur = this.activeBuff.duration * 1000;
      if (this.buffStart + dur > Date.now()) {
        let remain = (this.buffStart + dur - Date.now()) / (this.activeBuff.duration * 1000);

        document.querySelector("body").classList.add("buff");
        document.querySelector(".active_buff").classList.add("active_buff--visible");
        document.querySelector(".active_buff__time--inner").style.width = remain * 100 + "%";
      } else {
        this.activeBuff = null;
        this.buffStart = 0;
        document.querySelector("body").classList.remove("buff");
        document.querySelector(".active_buff").classList.remove("active_buff--visible");
      }
    }
  }

  step() {
    let difference = 1;
    if (this.lastUpdate && Date.now() - this.lastUpdate > 1000) {
      difference = (Date.now() - this.lastUpdate) / 100;
    }

    let tmp = new Date();
    if (tmp.getDate() !== this.dailyBonusGot) {
      this.dailyBonusGot = 0;
    }

    this.lastUpdate = Date.now();
    let increase = 0;

    this.members.forEach((m) => {
      increase += m.getIncrease(this.activeBuff);
    });

    increase *= difference;

    this.members.forEach((m) => {
      m.updateBuyability(this.score);
      m.update(this.score, this.showBoughtUpgrades, this.activeBuff);
    });

    this.clickerUpgrades.forEach((c) => {
      c.updateBuyability(this.score);
      c.updateVisibility(this.members[0].amount, this.handmadeCaps, this.showBoughtUpgrades);
    });

    this.totalMembers = 0;
    this.members.forEach((mem) => (this.totalMembers += mem.amount));

    let buffedIncrease = 0;
    if (this.activeBuff && this.activeBuff.id === 2) {
      this.score += (increase / (1000 / this.intervalSpeed)) * 66;
      buffedIncrease = increase * this.activeBuff.power;
    } else {
      this.score += increase / (1000 / this.intervalSpeed);
      buffedIncrease = increase;
    }
    this.scoreElement.updateScore(this.score, buffedIncrease);
    this.capsPerSecond = buffedIncrease;

    if (increase > 10000000) {
      document.querySelector(".inventory").classList.add("visible");
      this.spawnRandomItem();
    } else {
      document.querySelector(".inventory").classList.remove("visible");
    }
    this.checkClickMultiplier();
    this.checkBuff();

    this.runDuration = Date.now() - this.runStarted;
  }

  checkClickMultiplier() {
    if (this.clickerMultiplier <= 1 || Date.now() - 500 > this.lastClickTimestamp) {
      this.multiplier_bonus.classList.remove("multiplier_bonus--visible");
      this.multiplier_bonus.classList.remove("multiplier_bonus--2");
      this.multiplier_bonus.classList.remove("multiplier_bonus--4");
      this.multiplier_bonus.classList.remove("multiplier_bonus--8");
    } else {
      this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";
      this.multiplier_bonus.classList.add("multiplier_bonus--" + this.clickerMultiplier);
      this.multiplier_bonus.classList.add("multiplier_bonus--visible");
    }
  }

  addSaveAndLoadDialogLogic() {
    const showSaveButton = document.querySelector(".navigation__list-item.save");
    const showLoadButton = document.querySelector(".navigation__list-item.load");

    showSaveButton.addEventListener("click", () => {
      this.saveDialog.classList.add("saveDialog__open");
      let saveString = this.save.save();
      this.saveDialog.querySelector("textarea").innerHTML = saveString;
    });

    this.saveDialog.addEventListener("click", (e) => {
      let tmp = e.target as HTMLElement;
      if (tmp.classList.contains("saveDialog")) {
        this.saveDialog.classList.remove("saveDialog__open");
      }
    });

    showLoadButton.addEventListener("click", () => {
      this.loadDialog.classList.add("loadDialog__open");
    });

    this.loadDialog.addEventListener("click", (e) => {
      let tmp = e.target as HTMLElement;
      if (tmp.classList.contains("loadDialog")) {
        this.loadDialog.classList.remove("loadDialog__open");
      }
    });

    this.loadDialog.querySelector("button").addEventListener("click", () => {
      const loadState = this.loadDialog.querySelector("textarea").value;
      try {
        JSON.parse(atob(loadState));
        this.save.load(loadState);
        this.loadDialog.querySelector("textarea").value = "";
        this.loadDialog.classList.remove("loadDialog__open");
      } catch (error) {
        alert("Fehler!");
      }
    });
  }

  clearInventory() {
    this.items = [];
    this.updateInventory();
    this.save.save();
  }

  spawnRandomItem() {
    let percentChancePerSecond = 1.01 / (1000 / this.intervalSpeed);

    if (this.activeBuff && this.activeBuff.referenceMemberId === -1) {
      percentChancePerSecond *= this.activeBuff.power;
    }

    if (Math.random() < percentChancePerSecond) {
      const top = Math.random() * (window.innerHeight - 150);
      const left = Math.random() * (window.innerWidth - 150);

      this.goldenpelo.style.top = top + "px";
      this.goldenpelo.style.left = left + "px";

      let clone = this.goldenpelo.cloneNode(true) as HTMLImageElement;

      document.querySelector("body").append(clone);

      setTimeout(() => {
        clone.remove();
        this.missedGoldenPelo++;
      }, 3000);

      clone.onclick = () => {
        let possibleIds = [1, 2, 3, 4];
        if (this.activeBuff && this.activeBuff.id === 3) {
          possibleIds = [1, 2, 4];
        }

        let randomItem = this.inventory.getRandomItem(possibleIds);
        this.inventory.addItem(randomItem.id);

        clone.src = "/img/items/" + randomItem["imageString"];
        clone.classList.add("collected");
        this.items.push(
          new Item(
            randomItem["id"],
            randomItem["name"],
            randomItem["imageString"],
            randomItem["description"],
            randomItem["text"],
            randomItem["referenceMemberId"],
            randomItem["power"],
            randomItem["consumable"],
            randomItem["duration"]
          )
        );
        this.updateInventory();
        setTimeout(() => {
          clone.remove();
        }, 500);
      };
    }
  }
}
