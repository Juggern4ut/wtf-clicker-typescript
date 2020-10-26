class Save {
  saveData: Object = {};
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  save(members: Member[], score) {
    this.saveData["members"] = members;
    this.saveData["score"] = score;
    document.cookie = "data=" + JSON.stringify(this.saveData);
  }

  load(members: Member[]) {
    if (document.cookie) {
      let data = document.cookie.replace("data=", "");
      data = JSON.parse(data);

      members.forEach((member, index) => {
        if (data["members"][index]) {
          member.amount = data["members"][index].amount;
          member.update();
        }
      });

      this.game.score = data["score"];
    }
  }
}
