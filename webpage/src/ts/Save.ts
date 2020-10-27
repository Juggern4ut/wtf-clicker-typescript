class Save {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  save() {
    const saveData = {};
    saveData["members"] = this.game.members;
    saveData["score"] = this.game.score;
    
    const saveString = btoa(JSON.stringify(saveData));
    localStorage.setItem("WtfClickerGame", saveString);
  }

  load() {
    const localStorageData = localStorage.getItem("WtfClickerGame");

    if (localStorageData) {
      const data = JSON.parse(atob(localStorageData));
      this.game.members.forEach((member, index) => {
        if (data["members"][index]) {
          member.amount = data["members"][index]["amount"];
          member.update();
        }
      });
      this.game.score = parseInt(data["score"]);
    }
  }
}
