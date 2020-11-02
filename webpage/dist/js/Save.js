var Save = /** @class */ (function () {
    function Save(game) {
        this.game = game;
    }
    Save.prototype.save = function () {
        var saveData = {};
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
            missedGoldenPelo: this.game.goldenPelo.missedGoldenPelo
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
            this.game.inventory.clearInventory();
        }
        else {
            localStorageData = localStorage.getItem("WtfClickerGame2");
        }
        if (localStorageData) {
            var data_1 = JSON.parse(atob(localStorageData));
            if (data_1["members_new"]) {
                data_1["members_new"].forEach(function (mem) {
                    _this.game.members.find(function (i) { return i.id === mem.id; }).setAmount(mem.amount);
                    _this.game.membersSave.find(function (i) { return i["id"] === mem.id; })["amount"] = mem.amount;
                });
            }
            if (data_1["upgrades_new"]) {
                this.game.members.forEach(function (member) {
                    member.upgrades.forEach(function (upgrade) {
                        var found = data_1["upgrades_new"].find(function (i) { return i.id === upgrade.id; });
                        if (found) {
                            upgrade.bought = found.bought;
                        }
                    });
                });
            }
            if (data_1["clicker_upgrades_new"]) {
                data_1["clicker_upgrades_new"].forEach(function (upgrade) {
                    _this.game.clickerUpgrades.find(function (i) { return i.id === upgrade.id; }).bought = upgrade.bought;
                });
                this.game.clickerUpgradesSave = data_1["clicker_upgrades_new"];
            }
            if (data_1["inventory_new"]) {
                data_1["inventory_new"].forEach(function (item) {
                    _this.game.inventory.addItem(item.id, item.amount);
                });
                this.game.inventory.updateInventory();
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
