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
        this.clickerMultiplier = 1;
        this.continuousClicks = 0;
        this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
        this.clicker = new Clicker(this);
        this.saveDialog = document.querySelector(".saveDialog");
        this.loadDialog = document.querySelector(".loadDialog");
        this.inventoryContainer = document.querySelector(".inventory__content");
        this.runStarted = Date.now();
        this.goldenpelo = document.createElement("img");
        this.goldenpelo.src = "/img/golden_pelo.png";
        this.goldenpelo.classList.add("golden-pelo");
        this.multiplier_bonus = document.createElement("div");
        this.multiplier_bonus.classList.add("multiplier_bonus");
        this.multiplier_bonus__inner = document.createElement("p");
        this.multiplier_bonus__inner.classList.add("multiplier_bonus__number");
        this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";
        this.multiplier_bonus.append(this.multiplier_bonus__inner);
        document.querySelector(".clicker").append(this.multiplier_bonus);
        this.instantiateMembers();
        this.loadPossibleItems();
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
        missedPeloEntry.innerHTML = "<span>Verpasste goldene PeLos:</span><span>" + this.missedGoldenPelo + "</span>";
        var membersEntry = document.createElement("div");
        membersEntry.classList.add("stats__entry");
        membersEntry.innerHTML = "<span>Anzahl Mitglieder:</span><span>" + this.totalMembers + "</span>";
        container.append(dateEntry);
        container.append(handMadeEntry);
        container.append(missedPeloEntry);
        container.append(membersEntry);
    };
    Game.prototype.updateInventory = function () {
        var _this = this;
        var itemsCollected = [];
        this.items.forEach(function (item) {
            var found = itemsCollected.find(function (i) { return i.id === item.id; });
            if (!found) {
                itemsCollected.push(item);
                item.amount = 1;
                _this.inventoryContainer.append(item.dom);
                item.dom.onclick = function () {
                    if (!_this.activeBuff) {
                        _this.consumeBuff(item);
                    }
                    else {
                        alert("Du kannst nur einen Trank auf einmal aktiv haben!");
                    }
                };
            }
        });
    };
    Game.prototype.consumeBuff = function (item) {
        var index = this.items.findIndex(function (i) { return i.id === item.id || i.name === item.name; });
        this.items.splice(index, 1);
        document.querySelector(".inventory__modal").classList.remove("inventory__modal--open");
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
        else if (item.id === 4) {
            var possibleIds_2 = [];
            this.members.forEach(function (m) {
                if (m.amount > 0) {
                    possibleIds_2.push(m.id);
                }
            });
            var wonId_2 = Math.floor(Math.random() * possibleIds_2.length - 1);
            var lostId_1 = Math.floor(Math.random() * possibleIds_2.length - 1);
            var wonMember = this.members.find(function (m) { return m.id === wonId_2; });
            var lostMember = this.members.find(function (m) { return m.id === lostId_1; });
            wonMember.amount++;
            lostMember.amount--;
            alert("Mitgliederveränderungen: +1 " + wonMember.name + ", -1 " + lostMember.name);
        }
        else {
            this.buffStart = Date.now();
            this.activeBuff = item;
            document.querySelector(".active_buff__image")["src"] = "/img/items/" + item.imageString;
        }
        this.updateInventory();
        this.save.save();
    };
    // checkBuff() {
    //   if (this.activeBuff) {
    //     let dur = this.activeBuff.duration * 1000;
    //     if (this.buffStart + dur > Date.now()) {
    //       let remain = (this.buffStart + dur - Date.now()) / (this.activeBuff.duration * 1000);
    //       document.querySelector("body").classList.add("buff");
    //       document.querySelector(".active_buff").classList.add("active_buff--visible");
    //       document.querySelector(".active_buff__time--inner").style.width = remain * 100 + "%";
    //     } else {
    //       this.activeBuff = null;
    //       this.buffStart = 0;
    //       document.querySelector("body").classList.remove("buff");
    //       document.querySelector(".active_buff").classList.remove("active_buff--visible");
    //     }
    //   }
    // }
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
        this.checkClickMultiplier();
        this.runDuration = Date.now() - this.runStarted;
    };
    Game.prototype.checkClickMultiplier = function () {
        if (this.clickerMultiplier <= 1 || Date.now() - 500 > this.lastClickTimestamp) {
            this.multiplier_bonus.classList.remove("multiplier_bonus--visible");
            this.multiplier_bonus.classList.remove("multiplier_bonus--2");
            this.multiplier_bonus.classList.remove("multiplier_bonus--4");
            this.multiplier_bonus.classList.remove("multiplier_bonus--8");
        }
        else {
            this.multiplier_bonus__inner.innerHTML = this.clickerMultiplier + "<span>x</span>";
            this.multiplier_bonus.classList.add("multiplier_bonus--" + this.clickerMultiplier);
            this.multiplier_bonus.classList.add("multiplier_bonus--visible");
        }
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
        var percentChancePerSecond = 1.01 / (1000 / this.intervalSpeed);
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
                var possibleIds = [1, 2, 3, 4];
                if (_this.activeBuff && _this.activeBuff.id === 3) {
                    possibleIds = [1, 2, 4];
                }
                var randomItem = _this.inventory.getRandomItem(possibleIds);
                _this.inventory.addItem(randomItem.id);
                clone_1.src = "/img/items/" + randomItem["imageString"];
                clone_1.classList.add("collected");
                _this.items.push(new Item(randomItem["id"], randomItem["name"], randomItem["imageString"], randomItem["description"], randomItem["text"], randomItem["referenceMemberId"], randomItem["power"], randomItem["consumable"], randomItem["duration"]));
                _this.updateInventory();
                setTimeout(function () {
                    clone_1.remove();
                }, 500);
            };
        }
    };
    return Game;
}());
