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

    //this.items.push(new Item("Gelbes Getränk", "potion_yellow.png"));
    //this.items.push(new Item("Grünes Getränk", "potion_green.png"));

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

  updateInventory() {
    if (this.items.length <= 0) {
      this.inventoryContainer.innerHTML = "<p>Dein Inventar ist leer! :(</p>";
      document.querySelector(".inventory__count").classList.remove("inventory__count--visible");
      return;
    } else {
      this.inventoryContainer.innerHTML = "";

      document.querySelector(".inventory__count").classList.add("inventory__count--visible");
      document.querySelector(".inventory__count").innerHTML = this.items.length + "";
    }

    let itemsCollected = [];

    this.items.forEach((item) => {
      
        let found = itemsCollected.find((i) => i.id === item.id);
        if (!found) {
          itemsCollected.push(item);
          item.amount = 1;
          this.inventoryContainer.append(item.dom);
          item.updateAmount();
          item.dom.onclick = () => {
            if (!this.activeBuff) {
              this.consumeBuff(item);
            } else {
              alert("Du kannst nur einen Trank auf einmal aktiv haben!");
            }
          };
        } else {
          found.amount++;
          found.updateAmount();
        }
      
    });
  }

  consumeBuff(item) {
    const index = this.items.findIndex((i) => i.id === item.id || i.name === item.name);
    this.items.splice(index, 1);
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
    } else {
      this.buffStart = Date.now();
      this.activeBuff = item;
    }
    this.updateInventory();
    this.save.save();
  }

  checkBuff() {
    if (this.activeBuff) {
      let dur = this.activeBuff.duration * 1000;
      if (this.buffStart + dur > Date.now()) {
        document.querySelector("body").classList.add("buff");
      } else {
        this.activeBuff = null;
        this.buffStart = 0;
        document.querySelector("body").classList.remove("buff");
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

    this.checkBuff();

    this.runDuration = Date.now() - this.runStarted;
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
    let percentChancePerSecond = 0.01 / (1000 / this.intervalSpeed);

    if (this.activeBuff && this.activeBuff.referenceMemberId === -1) {
      percentChancePerSecond *= this.activeBuff.power;
    }

    if (Math.random() < percentChancePerSecond) {
      const top = Math.random() * (window.innerHeight - 150);
      const left = Math.random() * (window.innerWidth - 150);

      this.goldenpelo.style.top = top + "px";
      this.goldenpelo.style.left = left + "px";

      let clone = this.goldenpelo.cloneNode(true) as HTMLElement;

      document.querySelector("body").append(clone);

      setTimeout(() => {
        clone.remove();
        this.missedGoldenPelo++;
      }, 3000);

      clone.onclick = () => {
        let randomItem = this.possibleItems[Math.floor(Math.random() * this.possibleItems.length)];
        this.items.push(
          new Item(
            randomItem["id"],
            randomItem["name"],
            randomItem["image"],
            randomItem["description"],
            randomItem["text"],
            randomItem["referenceMemberId"],
            randomItem["power"],
            randomItem["consumable"],
            randomItem["duration"]
          )
        );
        this.updateInventory();
        clone.remove();
      };
    }
  }
}
