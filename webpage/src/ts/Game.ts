class Game {
  intervalSpeed: number = 100;
  stepInterval: NodeJS.Timeout;
  members: Member[] = [];
  upgrades: Upgrade[] = [];
  score: number = 0;
  scoreElement: Score;
  save: Save;
  saveInterval: NodeJS.Timeout;
  clicker: Clicker;
  lastUpdate: number;

  constructor() {
    this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
    this.clicker = new Clicker(this);

    this.instantiateMembers();
    this.instantiateUpgrades();

    this.save = new Save(this);
    this.save.load();

    setTimeout(() => {
      this.upgrades.forEach((upgrade) => {
        upgrade.update();
        if (upgrade.dom) {
          upgrade.dom.onclick = () => {
            if (this.score >= upgrade.price) {
              upgrade.buy();
              this.score -= upgrade.price;
            }
          };
        }
      });
    }, 1000);

    this.saveInterval = setInterval(() => {
      this.save.save();
    }, 5000);

    this.stepInterval = setInterval(() => {
      this.step();
    }, this.intervalSpeed);
  }

  instantiateMembers() {
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;
    const quadrillion = 1000000000000000;
    const quintillion = 1000000000000000000;

    this.members.push(new Member("Gisi", 0.1, 10, "gisi.png"));
    this.members.push(new Member("Sandro", 1, 100, "sandro.png"));
    this.members.push(new Member("Nino", 8, 1100, "nino.png"));
    this.members.push(new Member("Patrik", 47, 12000, "patrik.png"));
    this.members.push(new Member("Gian-Reto", 360, 130000, "gian.png"));
    this.members.push(new Member("Seya", 1400, 1.4 * million, "seya.png"));
    this.members.push(new Member("Valentin", 7800, 20 * million, "vali.png"));
    this.members.push(new Member("PeLo", 44000, 330 * million, "pelo.png"));
    this.members.push(new Member("Hosi", 260000, 5.1 * billion, "pascal.png"));
    this.members.push(new Member("Nicolas", 1.6 * million, 75 * billion, "nico.png"));
    this.members.push(new Member("Baby Ö", 10 * million, 1 * trillion, "philip.png"));
    this.members.push(new Member("Luki", 65 * million, 14 * trillion, "luki.png"));
    this.members.push(new Member("Party Pascal", 430 * million, 170 * trillion, "pascal_2.png"));
    this.members.push(new Member("Vape Nation Nicolas", 2.9 * billion, 2.1 * quadrillion, "nico_2.png"));
    this.members.push(new Member("Wütender Ö", 21 * billion, 26 * quadrillion, "philip_2.png"));
    this.members.push(new Member("Göttlicher Patrik", 150 * billion, 310 * quadrillion, "patrik_2.png"));
    this.members.push(new Member("W T F", 1.1 * trillion, 71 * quintillion, "wtf.png"));

    this.members.forEach((m) => {
      m.dom.container.onclick = () => {
        if (m.getPrice() < this.score) {
          this.score -= m.getPrice();
          m.buy();
          this.save.save();
        }
      };
    });
  }

  instantiateUpgrades() {
    fetch("/data/upgrades.json")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        res.forEach((up) => {
          const tmp = new Upgrade(up.name, this.members[up.referenceId], up.requirement, up.multiplier, up.price);
          this.upgrades.push(tmp);
        });
      });
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
    });

    this.upgrades.forEach((u) => {
      u.updateBuyability(this.score);
      u.updateVisibility();
    });

    this.score += increase / (1000 / this.intervalSpeed);
    this.scoreElement.updateScore(this.score, increase);
  }
}
