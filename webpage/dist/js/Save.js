var Save = /** @class */ (function () {
    function Save(game) {
        this.game = game;
    }
    Save.prototype.save = function () {
        var saveData = {};
        saveData["members"] = this.game.members;
        saveData["score"] = this.game.score;
        var saveString = btoa(JSON.stringify(saveData));
        localStorage.setItem("WtfClickerGame", saveString);
    };
    Save.prototype.load = function () {
        var localStorageData = localStorage.getItem("WtfClickerGame");
        if (localStorageData) {
            var data_1 = JSON.parse(atob(localStorageData));
            this.game.members.forEach(function (member, index) {
                if (data_1["members"][index]) {
                    member.amount = data_1["members"][index]["amount"];
                    member.update();
                }
            });
            this.game.score = parseInt(data_1["score"]);
        }
    };
    return Save;
}());
