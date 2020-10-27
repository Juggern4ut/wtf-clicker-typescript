var Save = /** @class */ (function () {
    function Save(game) {
        this.game = game;
    }
    Save.prototype.save = function () {
        var saveData = {};
        saveData["members"] = this.game.members;
        saveData["score"] = this.game.score;
        saveData["upgrades"] = this.game.upgrades;
        var saveString = btoa(JSON.stringify(saveData));
        localStorage.setItem("WtfClickerGame2", saveString);
    };
    Save.prototype.load = function () {
        var localStorageData = localStorage.getItem("WtfClickerGame2");
        if (localStorageData) {
            var data_1 = JSON.parse(atob(localStorageData));
            this.game.members.forEach(function (member, index) {
                if (data_1["members"][index]) {
                    member.amount = data_1["members"][index]["amount"];
                    member.multiplier = data_1["members"][index]["multiplier"];
                    member.update();
                }
            });
            this.game.score = parseInt(data_1["score"]);
            if (data_1["upgrades"]) {
                this.game.upgrades.forEach(function (upgrade, index) {
                    upgrade.bought = data_1["upgrades"][index].bought;
                });
            }
        }
    };
    return Save;
}());
