var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.intervalSpeed = 100;
        this.members = [];
        this.upgrades = [];
        this.clickerUpgrades = [];
        this.score = 0;
        this.dailyBonusGot = 0;
        this.handmadeCaps = 0;
        this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
        this.clicker = new Clicker(this);
        this.goldenPelo = new GoldenPelo(this);
        this.saveDialog = document.querySelector(".saveDialog");
        this.loadDialog = document.querySelector(".loadDialog");
        this.inventoryContainer = document.querySelector(".inventory__content");
        this.runStarted = Date.now();
        this.instantiateMembers();
        this.buff = new Buff(this.members);
        this.inventory = new Inventory(this.buff);
        var showBoughtButton = document.querySelector(".showBought");
        showBoughtButton.onclick = function () {
            _this.showBoughtUpgrades = !_this.showBoughtUpgrades;
            showBoughtButton.innerHTML = _this.showBoughtUpgrades ? "Gekaufte Upgrades ausblenden" : "Gekaufte Upgrades anzeigen";
        };
        this.save = new Save(this);
        this.saveInterval = setInterval(function () {
            _this.save.save();
        }, 5000);
        this.stepInterval = setInterval(function () {
            _this.step();
        }, this.intervalSpeed);
        this.addSaveAndLoadDialogLogic();
    }
    Game.prototype.instantiateMembers = function () {
        var _this = this;
        fetch("/data/members.json")
            .then(function (res) {
            return res.json();
        })
            .then(function (res) {
            res.forEach(function (mem) {
                var tmp = new Member(mem.name, mem.basePower, mem.basePrice, mem.image, mem.id);
                _this.members.push(tmp);
            });
            _this.members.forEach(function (m) {
                m.dom.container.onclick = function () {
                    if (m.getPrice() <= _this.score) {
                        _this.score -= m.getPrice();
                        m.buy();
                        _this.save.save();
                    }
                };
            });
            _this.instantiateClickerUpgrades();
        });
    };
    Game.prototype.instantiateClickerUpgrades = function () {
        var _this = this;
        fetch("/data/clickerUpgrades.json")
            .then(function (res) {
            return res.json();
        })
            .then(function (res) {
            res.forEach(function (up) {
                var tmp = new ClickerUpgrade(up.name, up.description, up.requirement, up.type, up.power, up.price, up.id);
                _this.clickerUpgrades.push(tmp);
                tmp.dom.onclick = function () {
                    if (tmp.price <= _this.score) {
                        _this.score -= tmp.price;
                        tmp.buy();
                        _this.save.save();
                    }
                };
            });
            _this.instantiateUpgrades();
        });
    };
    Game.prototype.instantiateUpgrades = function () {
        var _this = this;
        fetch("/data/upgrades.json")
            .then(function (res) {
            return res.json();
        })
            .then(function (res) {
            res.forEach(function (up) {
                var tmp = new Upgrade(up.name, up.description, up.requirement, up.multiplier, up.price, up.id);
                var refMember = _this.members.find(function (mem) { return mem.id === up.referenceId; });
                refMember.addUpgrade(tmp);
            });
            _this.members.forEach(function (m) {
                m.upgrades.forEach(function (upgrade) {
                    if (upgrade.dom) {
                        upgrade.dom.onclick = function () {
                            if (_this.score >= upgrade.price && !upgrade.bought) {
                                upgrade.bought = true;
                                _this.score -= upgrade.price;
                                _this.save.save();
                            }
                        };
                    }
                });
            });
            _this.save.load();
        });
    };
    Game.prototype.reset = function () {
        if (confirm("Wirklich den gesamten Fortschritt löschen?")) {
            this.save.reset();
        }
    };
    Game.prototype.updateStats = function () {
        var container = document.querySelector(".stats__content");
        container.innerHTML = "";
        var date = new Date(this.runStarted).toLocaleString();
        var dateEntry = document.createElement("div");
        dateEntry.classList.add("stats__entry");
        dateEntry.innerHTML = "<span>Spielbeginn:</span><span>" + date + "</span>";
        var handMadeEntry = document.createElement("div");
        handMadeEntry.classList.add("stats__entry");
        handMadeEntry.innerHTML = "<span>Von Hand geöffnete Biere:</span><span>" + window["numberAsText"](this.handmadeCaps) + "</span>";
        var missedPeloEntry = document.createElement("div");
        missedPeloEntry.classList.add("stats__entry");
        missedPeloEntry.innerHTML = "<span>Verpasste goldene PeLos:</span><span>" + this.goldenPelo.missedGoldenPelo + "</span>";
        var membersEntry = document.createElement("div");
        membersEntry.classList.add("stats__entry");
        membersEntry.innerHTML = "<span>Anzahl Mitglieder:</span><span>" + this.totalMembers + "</span>";
        container.append(dateEntry);
        container.append(handMadeEntry);
        container.append(missedPeloEntry);
        container.append(membersEntry);
    };
    Game.prototype.step = function () {
        var _this = this;
        this.buff.update();
        var difference = 1;
        if (this.lastUpdate && Date.now() - this.lastUpdate > 1000) {
            difference = (Date.now() - this.lastUpdate) / 100;
        }
        var tmp = new Date();
        if (tmp.getDate() !== this.dailyBonusGot) {
            this.dailyBonusGot = 0;
        }
        this.lastUpdate = Date.now();
        var increase = 0;
        this.members.forEach(function (m) {
            increase += m.getIncrease(_this.buff.activeBuff);
        });
        increase *= difference;
        this.members.forEach(function (m) {
            m.updateBuyability(_this.score);
            m.update(_this.score, _this.showBoughtUpgrades, _this.buff.activeBuff);
        });
        this.clickerUpgrades.forEach(function (c) {
            c.updateBuyability(_this.score);
            c.updateVisibility(_this.members[0].amount, _this.handmadeCaps, _this.showBoughtUpgrades);
        });
        this.totalMembers = 0;
        this.members.forEach(function (mem) { return (_this.totalMembers += mem.amount); });
        var buffedIncrease = 0;
        if (this.buff.activeBuff && this.buff.activeBuff.id === 2) {
            this.score += (increase / (1000 / this.intervalSpeed)) * this.buff.activeBuff.power;
            buffedIncrease = increase * this.buff.activeBuff.power;
        }
        else {
            this.score += increase / (1000 / this.intervalSpeed);
            buffedIncrease = increase;
        }
        this.scoreElement.updateScore(this.score, buffedIncrease);
        this.capsPerSecond = buffedIncrease;
        if (increase > 10000000) {
            document.querySelector(".inventory").classList.add("visible");
            this.goldenPelo.spawnRandomItem();
        }
        else {
            document.querySelector(".inventory").classList.remove("visible");
        }
        this.runDuration = Date.now() - this.runStarted;
    };
    Game.prototype.addSaveAndLoadDialogLogic = function () {
        var _this = this;
        var showSaveButton = document.querySelector(".navigation__list-item.save");
        var showLoadButton = document.querySelector(".navigation__list-item.load");
        showSaveButton.addEventListener("click", function () {
            _this.saveDialog.classList.add("saveDialog__open");
            var saveString = _this.save.save();
            _this.saveDialog.querySelector("textarea").innerHTML = saveString;
        });
        this.saveDialog.addEventListener("click", function (e) {
            var tmp = e.target;
            if (tmp.classList.contains("saveDialog")) {
                _this.saveDialog.classList.remove("saveDialog__open");
            }
        });
        showLoadButton.addEventListener("click", function () {
            _this.loadDialog.classList.add("loadDialog__open");
        });
        this.loadDialog.addEventListener("click", function (e) {
            var tmp = e.target;
            if (tmp.classList.contains("loadDialog")) {
                _this.loadDialog.classList.remove("loadDialog__open");
            }
        });
        this.loadDialog.querySelector("button").addEventListener("click", function () {
            var loadState = _this.loadDialog.querySelector("textarea").value;
            try {
                JSON.parse(atob(loadState));
                _this.save.load(loadState);
                _this.loadDialog.querySelector("textarea").value = "";
                _this.loadDialog.classList.remove("loadDialog__open");
            }
            catch (error) {
                alert("Fehler!");
            }
        });
    };
    return Game;
}());
