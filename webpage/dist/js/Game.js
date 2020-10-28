var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.intervalSpeed = 100;
        this.members = [];
        this.upgrades = [];
        this.score = 0;
        this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
        this.clicker = new Clicker(this);
        this.saveDialog = document.querySelector(".saveDialog");
        this.loadDialog = document.querySelector(".loadDialog");
        this.instantiateMembers();
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
    Game.prototype.step = function () {
        var _this = this;
        var difference = 1;
        if (this.lastUpdate && Date.now() - this.lastUpdate > 1000) {
            difference = (Date.now() - this.lastUpdate) / 100;
        }
        this.lastUpdate = Date.now();
        var increase = 0;
        this.members.forEach(function (m) {
            increase += m.getIncrease();
        });
        increase *= difference;
        this.members.forEach(function (m) {
            m.updateBuyability(_this.score);
            m.update(_this.score, _this.showBoughtUpgrades);
        });
        this.score += increase / (1000 / this.intervalSpeed);
        this.scoreElement.updateScore(this.score, increase);
    };
    Game.prototype.addSaveAndLoadDialogLogic = function () {
        var _this = this;
        var showSaveButton = document.querySelector(".Button.save");
        var showLoadButton = document.querySelector(".Button.load");
        showSaveButton.addEventListener("click", function () {
            _this.saveDialog.classList.add("saveDialog__open");
            var saveString = _this.save.save();
            _this.saveDialog.querySelector("textarea").innerHTML = saveString;
        });
        this.saveDialog.addEventListener("click", function (e) {
            _this.saveDialog.classList.remove("saveDialog__open");
        });
        showLoadButton.addEventListener("click", function () {
            _this.loadDialog.classList.add("loadDialog__open");
        });
        this.loadDialog.addEventListener("click", function (e) {
            if (e.target.classList.contains("loadDialog")) {
                _this.loadDialog.classList.remove("loadDialog__open");
            }
        });
        this.loadDialog.querySelector("button").addEventListener("click", function () {
            var loadState = _this.loadDialog.querySelector("textarea").value;
            try {
                JSON.parse(atob(loadState));
                _this.save.load(loadState);
                _this.loadDialog.querySelector("textarea").innerHTML = "";
                _this.loadDialog.classList.remove("loadDialog__open");
            }
            catch (error) {
                alert("Fehler!");
            }
        });
    };
    return Game;
}());
