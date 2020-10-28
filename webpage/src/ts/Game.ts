class Game {
  intervalSpeed: number = 100;
  stepInterval: NodeJS.Timeout;
  members: Member[] = [];
  upgrades: Upgrade[] = [];
  score: number = 0;
  scoreElement: Score;
  save: Save;
  showBoughtUpgrades: boolean;
  saveInterval: NodeJS.Timeout;
  clicker: Clicker;
  lastUpdate: number;
  saveDialog: HTMLElement;
  loadDialog: HTMLElement;

  constructor() {
    this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
    this.clicker = new Clicker(this);
    this.saveDialog = document.querySelector(".saveDialog");
    this.loadDialog = document.querySelector(".loadDialog");

    this.instantiateMembers();

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

  step() {
    let difference = 1;
    if (this.lastUpdate && Date.now() - this.lastUpdate > 1000) {
      difference = (Date.now() - this.lastUpdate) / 100;
    }

    this.lastUpdate = Date.now();
    let increase = 0;

    this.members.forEach((m) => {
      increase += m.getIncrease();
    });

    increase *= difference;

    this.members.forEach((m) => {
      m.updateBuyability(this.score);
      m.update(this.score, this.showBoughtUpgrades);
    });

    this.score += increase / (1000 / this.intervalSpeed);
    this.scoreElement.updateScore(this.score, increase);
  }

  addSaveAndLoadDialogLogic() {
    const showSaveButton = document.querySelector(".Button.save");
    const showLoadButton = document.querySelector(".Button.load");

    showSaveButton.addEventListener("click", () => {
      this.saveDialog.classList.add("saveDialog__open");
      let saveString = this.save.save();
      this.saveDialog.querySelector("textarea").innerHTML = saveString;
    });

    this.saveDialog.addEventListener("click", (e) => {
      this.saveDialog.classList.remove("saveDialog__open");
    });

    showLoadButton.addEventListener("click", () => {
      this.loadDialog.classList.add("loadDialog__open");
    });

    this.loadDialog.addEventListener("click", (e) => {
      if (e.target.classList.contains("loadDialog")) {
        this.loadDialog.classList.remove("loadDialog__open");
      }
    });

    this.loadDialog.querySelector("button").addEventListener("click", () => {
      const loadState = this.loadDialog.querySelector("textarea").value;
      try {
        JSON.parse(atob(loadState));
        this.save.load(loadState);
      } catch (error) {
        alert("Fehler!");
      }
    })
  }
}
