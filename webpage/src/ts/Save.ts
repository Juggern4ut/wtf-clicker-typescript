class Save {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  save() {
    const saveData = {};
    saveData["members"] = this.game.members;
    saveData["score"] = this.game.score;
    saveData["upgrades"] = this.game.upgrades;

    const saveString = btoa(JSON.stringify(saveData));
    localStorage.setItem("WtfClickerGame2", saveString);
  }

  load() {
    const localStorageData = localStorage.getItem("WtfClickerGame2");

    if (localStorageData) {
      const data = JSON.parse(atob(localStorageData));
      this.game.members.forEach((member, index) => {
        if (data["members"][index]) {
          member.amount = data["members"][index]["amount"];
          member.multiplier = data["members"][index]["multiplier"];
          member.update();
        }
      });
      this.game.score = parseInt(data["score"]);

      if (data["upgrades"]) {
        this.game.upgrades.forEach((upgrade) => {
          let save = data["upgrades"].find((u) => u.id === upgrade.id);
          upgrade.bought = save.bought;
        });
      }
    }
  }

  reset() {
    localStorage.removeItem("WtfClickerGame2");
    window.location.reload();
  }
}
