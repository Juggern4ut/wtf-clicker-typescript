class Save {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  save() {
    const saveData = {};

    //saveData["members"] = this.game.members;
    //saveData["clickerUpgrades"] = this.game.clickerUpgrades;
    saveData["inventory_new"] = this.game.inventory.stack;
    saveData["members_new"] = this.game.membersSave;
    saveData["upgrades_new"] = this.game.upgradesSave;
    saveData["clicker_upgrades_new"] = this.game.clickerUpgradesSave;

    saveData["game"] = {
      score: this.game.score,
      dailyBonusGot: this.game.dailyBonusGot,
      handmadeCaps: this.game.handmadeCaps,
      runStarted: this.game.runStarted,
      missedGoldenPelo: this.game.goldenPelo.missedGoldenPelo,
    };

    const saveString = btoa(JSON.stringify(saveData));
    localStorage.setItem("WtfClickerGame2", saveString);
    return saveString;
  }

  load(fromString?: string) {
    let localStorageData;
    if (fromString) {
      localStorageData = fromString;
      this.game.inventory.clearInventory();
    } else {
      localStorageData = localStorage.getItem("WtfClickerGame2");
    }

    if (localStorageData) {
      const data = JSON.parse(atob(localStorageData));

      if (data["members_new"]) {
        data["members_new"].forEach((mem) => {
          this.game.members.find((i) => i.id === mem.id).setAmount(mem.amount);
          this.game.membersSave.find((i) => i["id"] === mem.id)["amount"] = mem.amount;
        });
      }

      if (data["upgrades_new"]) {
        this.game.members.forEach((member) => {
          member.upgrades.forEach((upgrade) => {
            const found = data["upgrades_new"].find((i) => i.id === upgrade.id);
            if (found) {
              upgrade.bought = found.bought;
            }
          });
        });
      }

      if (data["clicker_upgrades_new"]) {
        data["clicker_upgrades_new"].forEach((upgrade) => {
          this.game.clickerUpgrades.find((i) => i.id === upgrade.id).bought = upgrade.bought;
        });
        this.game.clickerUpgradesSave = data["clicker_upgrades_new"];
      }

      if (data["inventory_new"]) {
        data["inventory_new"].forEach((item) => {
          this.game.inventory.addItem(item.id, item.amount);
        });
        this.game.inventory.updateInventory();
      }

      if (data["game"]) {
        Object.keys(data["game"]).forEach((k) => {
          this.game[k] = data["game"][k];
        });
      } else if (data["score"] || data["handmadeCaps"]) {
        this.game.score = parseInt(data["score"]);
        let handmadeCaps = data["handmadeCaps"] ? parseInt(data["handmadeCaps"]) : 0;
        this.game.handmadeCaps = handmadeCaps;
      }
    }
  }

  reset() {
    localStorage.removeItem("WtfClickerGame2");
    window.location.reload();
  }
}
