var Save = /** @class */ (function () {
    function Save(game) {
        this.game = game;
    }
    Save.prototype.save = function () {
        var saveData = {};
        saveData["members"] = this.game.members;
        saveData["clickerUpgrades"] = this.game.clickerUpgrades;
        saveData["inventory"] = this.game.items;
        saveData["game"] = {
            score: this.game.score,
            dailyBonusGot: this.game.dailyBonusGot,
            handmadeCaps: this.game.handmadeCaps,
            runStarted: this.game.runStarted,
            missedGoldenPelo: this.game.missedGoldenPelo
        };
        var saveString = btoa(JSON.stringify(saveData));
        localStorage.setItem("WtfClickerGame2", saveString);
        return saveString;
    };
    Save.prototype.load = function (fromString) {
        var _this = this;
        var localStorageData;
        if (fromString) {
            localStorageData = fromString;
            this.game.clearInventory();
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
            if (data_1["inventory"]) {
                data_1["inventory"].forEach(function (item) {
                    if (!item.id && item.name === "Wasserkochsalzlösung") {
                        item.power = 66;
                        item.id = 2;
                        item.duration = 15;
                        item.description = "Deine Bierdeckel pro Sekunde werden für 15 Sekunden 66x effizienter!";
                    }
                    else if (!item.id && item.name === "Super homo saft") {
                        item.power = 7000;
                        item.id = 1;
                        item.duration = 60;
                        item.description = "Sandro wird für 60 Sekunden 7000x effizienter!";
                    }
                    _this.game.items.push(new Item(item.id, item.name, item.imageString, item.description, item.text, item.referenceMemberId, item.power, item.consumable, item.duration));
                });
                this.game.updateInventory();
            }
            if (data_1["game"]) {
                Object.keys(data_1["game"]).forEach(function (k) {
                    _this.game[k] = data_1["game"][k];
                });
            }
            else if (data_1["score"] || data_1["handmadeCaps"]) {
                this.game.score = parseInt(data_1["score"]);
                var handmadeCaps = data_1["handmadeCaps"] ? parseInt(data_1["handmadeCaps"]) : 0;
                this.game.handmadeCaps = handmadeCaps;
            }
        }
    };
    Save.prototype.reset = function () {
        localStorage.removeItem("WtfClickerGame2");
        window.location.reload();
    };
    return Save;
}());
