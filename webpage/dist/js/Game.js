var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.intervalSpeed = 100;
        this.members = [];
        this.upgrades = [];
        this.clickerUpgrades = [];
        this.items = [];
        this.score = 0;
        this.dailyBonusGot = 0;
        this.handmadeCaps = 0;
        this.possibleItems = [];
        this.missedGoldenPelo = 0;
        this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
        this.clicker = new Clicker(this);
        this.saveDialog = document.querySelector(".saveDialog");
        this.loadDialog = document.querySelector(".loadDialog");
        this.inventoryContainer = document.querySelector(".inventory__content");
        this.runStarted = Date.now();
        this.goldenpelo = document.createElement("img");
        this.goldenpelo.src = "/img/golden_pelo.png";
        this.goldenpelo.classList.add("golden-pelo");
        //this.items.push(new Item("Gelbes Getränk", "potion_yellow.png"));
        //this.items.push(new Item("Grünes Getränk", "potion_green.png"));
        this.instantiateMembers();
        this.loadPossibleItems();
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
    Game.prototype.loadPossibleItems = function () {
        var _this = this;
        fetch("/data/items.json")
            .then(function (res) { return res.json(); })
            .then(function (items) { return (_this.possibleItems = items); });
    };
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
    Game.prototype.updateInventory = function () {
        var _this = this;
        if (this.items.length <= 0) {
            this.inventoryContainer.innerHTML = "<p>Dein Inventar ist leer! :(</p>";
            document.querySelector(".inventory__count").classList.remove("inventory__count--visible");
            return;
        }
        else {
            this.inventoryContainer.innerHTML = "";
            document.querySelector(".inventory__count").classList.add("inventory__count--visible");
            document.querySelector(".inventory__count").innerHTML = this.items.length + "";
        }
        var itemsCollected = [];
        this.items.forEach(function (item) {
            var found = itemsCollected.find(function (i) { return i.id === item.id; });
            if (!found) {
                itemsCollected.push(item);
                item.amount = 1;
                _this.inventoryContainer.append(item.dom);
                item.updateAmount();
                item.dom.onclick = function () {
                    if (!_this.activeBuff) {
                        _this.consumeBuff(item);
                    }
                    else {
                        alert("Du kannst nur einen Trank auf einmal aktiv haben!");
                    }
                };
            }
            else {
                found.amount++;
                found.updateAmount();
            }
        });
    };
    Game.prototype.consumeBuff = function (item) {
        var index = this.items.findIndex(function (i) { return i.id === item.id || i.name === item.name; });
        this.items.splice(index, 1);
        if (item.id === 1000) {
            var possibleIds_1 = [];
            this.members.forEach(function (m) {
                if (m.amount > 0) {
                    possibleIds_1.push(m.id);
                }
            });
            var wonId_1 = Math.floor(Math.random() * possibleIds_1.length - 1);
            var wonMember = this.members.find(function (m) { return m.id === wonId_1; });
            wonMember.amount++;
            alert("Gratuliere! 1x " + wonMember.name);
        }
        else {
            this.buffStart = Date.now();
            this.activeBuff = item;
        }
        this.updateInventory();
        this.save.save();
    };
    Game.prototype.checkBuff = function () {
        if (this.activeBuff) {
            var dur = this.activeBuff.duration * 1000;
            if (this.buffStart + dur > Date.now()) {
                document.querySelector("body").classList.add("buff");
            }
            else {
                this.activeBuff = null;
                this.buffStart = 0;
                document.querySelector("body").classList.remove("buff");
            }
        }
    };
    Game.prototype.step = function () {
        var _this = this;
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
            increase += m.getIncrease(_this.activeBuff);
        });
        increase *= difference;
        this.members.forEach(function (m) {
            m.updateBuyability(_this.score);
            m.update(_this.score, _this.showBoughtUpgrades, _this.activeBuff);
        });
        this.clickerUpgrades.forEach(function (c) {
            c.updateBuyability(_this.score);
            c.updateVisibility(_this.members[0].amount, _this.handmadeCaps, _this.showBoughtUpgrades);
        });
        this.totalMembers = 0;
        this.members.forEach(function (mem) { return (_this.totalMembers += mem.amount); });
        var buffedIncrease = 0;
        if (this.activeBuff && this.activeBuff.id === 2) {
            this.score += (increase / (1000 / this.intervalSpeed)) * 66;
            buffedIncrease = increase * this.activeBuff.power;
        }
        else {
            this.score += increase / (1000 / this.intervalSpeed);
            buffedIncrease = increase;
        }
        this.scoreElement.updateScore(this.score, buffedIncrease);
        this.capsPerSecond = buffedIncrease;
        if (increase > 10000000) {
            document.querySelector(".inventory").classList.add("visible");
            this.spawnRandomItem();
        }
        else {
            document.querySelector(".inventory").classList.remove("visible");
        }
        this.checkBuff();
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
    Game.prototype.clearInventory = function () {
        this.items = [];
        this.updateInventory();
        this.save.save();
    };
    Game.prototype.spawnRandomItem = function () {
        var _this = this;
        var percentChancePerSecond = 0.01 / (1000 / this.intervalSpeed);
        if (this.activeBuff && this.activeBuff.referenceMemberId === -1) {
            percentChancePerSecond *= this.activeBuff.power;
        }
        if (Math.random() < percentChancePerSecond) {
            var top_1 = Math.random() * (window.innerHeight - 150);
            var left = Math.random() * (window.innerWidth - 150);
            this.goldenpelo.style.top = top_1 + "px";
            this.goldenpelo.style.left = left + "px";
            var clone_1 = this.goldenpelo.cloneNode(true);
            document.querySelector("body").append(clone_1);
            setTimeout(function () {
                clone_1.remove();
                _this.missedGoldenPelo++;
            }, 3000);
            clone_1.onclick = function () {
                var randomItem = _this.possibleItems[Math.floor(Math.random() * _this.possibleItems.length)];
                _this.items.push(new Item(randomItem["id"], randomItem["name"], randomItem["image"], randomItem["description"], randomItem["text"], randomItem["referenceMemberId"], randomItem["power"], randomItem["consumable"], randomItem["duration"]));
                _this.updateInventory();
                clone_1.remove();
            };
        }
    };
    return Game;
}());
