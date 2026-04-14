class Game {
  intervalSpeed: number = 100;
  stepInterval: NodeJS.Timeout;

  members: Member[] = [];
  membersSave: Object[] = [];

  upgrades: Upgrade[] = [];
  upgradesSave: Object[] = [];

  clickerUpgrades: ClickerUpgrade[] = [];
  clickerUpgradesSave: Object[] = [];

  score: number = 0;
  scoreElement: Score;
  showBoughtUpgrades: boolean;
  saveInterval: NodeJS.Timeout;
  lastUpdate: number;
  inventoryContainer: HTMLElement;
  dailyBonusGot: number = 0;
  saveDialog: HTMLElement;
  loadDialog: HTMLElement;
  handmadeCaps: number = 0;
  capsPerSecond: number;
  totalMembers: number;
  runStarted: number;
  runDuration: number;
  missedGoldenPelo: number = 0;

  save: Save;
  buff: Buff;
  clicker: Clicker;
  inventory: Inventory;
  goldenPelo: GoldenPelo;

  constructor() {
    this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
    this.clicker = new Clicker(this);
    this.goldenPelo = new GoldenPelo(this);
    this.instantiateMembers();
    this.buff = new Buff(this.members);
    this.inventory = new Inventory(this.buff);
    this.save = new Save(this);

    this.saveDialog = document.querySelector(".saveDialog");
    this.loadDialog = document.querySelector(".loadDialog");
    this.inventoryContainer = document.querySelector(".inventory__content");
    this.runStarted = Date.now();

    const showBoughtButton = document.querySelector(".showBought") as HTMLButtonElement;
    showBoughtButton.onclick = () => {
      this.showBoughtUpgrades = !this.showBoughtUpgrades;
      showBoughtButton.innerHTML = this.showBoughtUpgrades ? "Gekaufte Upgrades ausblenden" : "Gekaufte Upgrades anzeigen";
    };

    this.saveInterval = setInterval(() => {
      this.save.save();
    }, 5000);

    this.stepInterval = setInterval(() => {
      this.step();
    }, this.intervalSpeed);

    this.addSaveAndLoadDialogLogic();
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
          this.membersSave.push({ id: mem.id, amount: 0 });
        });

        this.members.forEach((m) => {
          m.dom.container.onclick = () => {
            if (m.getPrice() <= this.score) {
              this.score -= m.getPrice();
              const el = this.membersSave.find((i) => i["id"] === m.id);
              el["amount"]++;
              m.setAmount(m.getAmount() + 1);
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
          this.clickerUpgradesSave.push({ id: up.id, bought: false });
          tmp.dom.onclick = () => {
            if (tmp.price <= this.score) {
              this.score -= tmp.price;
              this.clickerUpgradesSave.find((i) => i["id"] === up.id)["bought"] = true;
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
            this.upgradesSave.push({ id: upgrade.id, bought: false });

            if (upgrade.dom) {
              upgrade.dom.onclick = () => {
                if (this.score >= upgrade.price && !upgrade.bought) {
                  upgrade.bought = true;
                  this.upgradesSave.find((i) => i["id"] === upgrade.id)["bought"] = true;
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
    missedPeloEntry.innerHTML = "<span>Verpasste goldene PeLos:</span><span>" + this.goldenPelo.missedGoldenPelo + "</span>";

    let membersEntry = document.createElement("div");
    membersEntry.classList.add("stats__entry");
    membersEntry.innerHTML = "<span>Anzahl Mitglieder:</span><span>" + this.totalMembers + "</span>";

    container.append(dateEntry);
    container.append(handMadeEntry);
    container.append(missedPeloEntry);
    container.append(membersEntry);
  }

  step() {
    this.buff.update();

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
      increase += m.getIncrease(this.buff.activeBuff);
    });

    increase *= difference;

    this.members.forEach((m) => {
      m.updateBuyability(this.score);
      m.update(this.score, this.showBoughtUpgrades, this.buff.activeBuff);
    });

    this.clickerUpgrades.forEach((c) => {
      c.updateBuyability(this.score);
      c.updateVisibility(this.members[0].amount, this.handmadeCaps, this.showBoughtUpgrades);
    });

    this.totalMembers = 0;
    this.members.forEach((mem) => (this.totalMembers += mem.amount));

    let buffedIncrease = 0;
    if (this.buff.activeBuff && this.buff.activeBuff.id === 2) {
      this.score += (increase / (1000 / this.intervalSpeed)) * this.buff.activeBuff.power;
      buffedIncrease = increase * this.buff.activeBuff.power;
    } else {
      this.score += increase / (1000 / this.intervalSpeed);
      buffedIncrease = increase;
    }
    this.scoreElement.updateScore(this.score, buffedIncrease);
    this.capsPerSecond = buffedIncrease;

    if (increase > 1000000) {
      document.querySelector(".inventory").classList.add("visible");
      this.goldenPelo.spawnRandomItem();
    } else {
      document.querySelector(".inventory").classList.remove("visible");
    }

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
      // try {
      JSON.parse(atob(loadState));
      this.save.load(loadState);
      this.loadDialog.querySelector("textarea").value = "";
      this.loadDialog.classList.remove("loadDialog__open");
      // } catch (error) {
      //   alert("Fehler!");
      // }
    });
  }
}
