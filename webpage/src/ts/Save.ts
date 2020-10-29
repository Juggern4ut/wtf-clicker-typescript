class Save {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  save() {
    const saveData = {};

    saveData["members"] = this.game.members;
    saveData["clickerUpgrades"] = this.game.clickerUpgrades;
    saveData["game"] = {
      score: this.game.score,
      handmadeCaps: this.game.handmadeCaps,
      runStarted: this.game.runStarted,
    };

    const saveString = btoa(JSON.stringify(saveData));
    localStorage.setItem("WtfClickerGame2", saveString);
    return saveString;
  }

  load(fromString?: string) {
    let localStorageData;
    if (fromString) {
      localStorageData = fromString;
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

      if(data["game"]){
        Object.keys(data["game"]).forEach(k=>{
          this.game[k] = data["game"][k]
        })
      }else if(data["score"] || data["handmadeCaps"]){
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
