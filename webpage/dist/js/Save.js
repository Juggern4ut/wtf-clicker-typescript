var Save = /** @class */ (function () {
    function Save(game) {
        this.game = game;
    }
    Save.prototype.save = function () {
        var saveData = {};
        saveData["members"] = this.game.members;
        saveData["score"] = this.game.score;
        saveData["handmadeCaps"] = this.game.handmadeCaps;
        saveData["clickerUpgrades"] = this.game.clickerUpgrades;
        var saveString = btoa(JSON.stringify(saveData));
        localStorage.setItem("WtfClickerGame2", saveString);
        return saveString;
    };
    Save.prototype.load = function (fromString) {
        var localStorageData;
        if (fromString) {
            localStorageData = fromString;
        }
        else {
            localStorageData = localStorage.getItem("WtfClickerGame2");
        }
        if (localStorageData) {
            var data_1 = JSON.parse(atob(localStorageData));
            this.game.members.forEach(function (member) {
                var saveMember = data_1["members"].find(function (m) { return m.id === member.id; });
                member.amount = saveMember.amount;
                member.upgrades.forEach(function (upgrade) {
                    var saveUpgrade = saveMember.upgrades.find(function (u) { return u.id === upgrade.id; });
                    upgrade.bought = saveUpgrade ? saveUpgrade.bought : false;
                });
            });
            this.game.clickerUpgrades.forEach(function (clickerUpgrade) {
                var savedClickerUpgrade = data_1["clickerUpgrades"].find(function (u) { return u.id === clickerUpgrade.id; });
                clickerUpgrade.bought = savedClickerUpgrade.bought;
            });
            this.game.score = parseInt(data_1["score"]);
            var handmadeCaps = data_1["handmadeCaps"] ? parseInt(data_1["handmadeCaps"]) : 0;
            this.game.handmadeCaps = handmadeCaps;
        }
    };
    Save.prototype.reset = function () {
        localStorage.removeItem("WtfClickerGame2");
        window.location.reload();
    };
    return Save;
}());
