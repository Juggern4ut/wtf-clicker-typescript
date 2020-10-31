class Save {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  save() {
    const saveData = {};

    saveData["members"] = this.game.members;
    saveData["clickerUpgrades"] = this.game.clickerUpgrades;
    saveData["inventory"] = this.game.items;
    saveData["game"] = {
      score: this.game.score,
      dailyBonusGot: this.game.dailyBonusGot,
      handmadeCaps: this.game.handmadeCaps,
      runStarted: this.game.runStarted,
      missedGoldenPelo: this.game.missedGoldenPelo,
    };

    const saveString = btoa(JSON.stringify(saveData));
    localStorage.setItem("WtfClickerGame2", saveString);
    return saveString;
  }

  load(fromString?: string) {
    let localStorageData;
    if (fromString) {
      localStorageData = fromString;
      this.game.clearInventory();
    } else {
      localStorageData = localStorage.getItem("WtfClickerGame2");
    }

    if (localStorageData) {
      const data = JSON.parse(atob(localStorageData));

      this.game.members.forEach((member) => {
        let saveMember = data["members"].find((m) => m.id === member.id);
        member.amount = saveMember.amount;

        member.upgrades.forEach((upgrade) => {
          let saveUpgrade = saveMember.upgrades.find((u) => u.id === upgrade.id);
          upgrade.bought = saveUpgrade ? saveUpgrade.bought : false;
        });
      });

      this.game.clickerUpgrades.forEach((clickerUpgrade) => {
        let savedClickerUpgrade = data["clickerUpgrades"].find((u) => u.id === clickerUpgrade.id);
        clickerUpgrade.bought = savedClickerUpgrade.bought;
      });

      if (data["inventory"]) {
        data["inventory"].forEach((item) => {
          
          if (!item.id && item.name === "Wasserkochsalzlösung") {
            item.power = 66;
            item.id = 2;
            item.duration = 15;
            item.description = "Deine Bierdeckel pro Sekunde werden für 15 Sekunden 66x effizienter!";
          } else if (!item.id && item.name === "Super homo saft") {
            item.power = 7000;
            item.id = 1;
            item.duration = 60;
            item.description = "Sandro wird für 60 Sekunden 7000x effizienter!";
          }

          this.game.items.push(new Item(item.id, item.name, item.imageString, item.description, item.text, item.referenceMemberId, item.power, item.consumable, item.duration));
        });
        this.game.updateInventory();
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
