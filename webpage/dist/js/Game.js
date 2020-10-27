var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.intervalSpeed = 100;
        this.members = [];
        this.upgrades = [];
        this.score = 0;
        this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
        this.clicker = new Clicker(this);
        this.instantiateMembers();
        this.instantiateUpgrades();
        this.save = new Save(this);
        this.save.load();
        this.upgrades.forEach(function (upgrade) {
            upgrade.update();
            if (upgrade.dom) {
                upgrade.dom.onclick = function () {
                    if (_this.score >= upgrade.price) {
                        upgrade.buy();
                        _this.score -= upgrade.price;
                    }
                };
            }
        });
        this.saveInterval = setInterval(function () {
            _this.save.save();
        }, 5000);
        this.stepInterval = setInterval(function () {
            _this.step();
        }, this.intervalSpeed);
    }
    Game.prototype.instantiateMembers = function () {
        var _this = this;
        var million = 1000000;
        var billion = 1000000000;
        var trillion = 1000000000000;
        var quadrillion = 1000000000000000;
        var quintillion = 1000000000000000000;
        this.members.push(new Member("Gisi", 0.1, 10, "gisi.png"));
        this.members.push(new Member("Sandro", 1, 100, "sandro.png"));
        this.members.push(new Member("Nino", 8, 1100, "nino.png"));
        this.members.push(new Member("Patrik", 47, 12000, "patrik.png"));
        this.members.push(new Member("Gian-Reto", 360, 130000, "gian.png"));
        this.members.push(new Member("Seya", 1400, 1.4 * million, "seya.png"));
        this.members.push(new Member("Valentin", 7800, 20 * million, "vali.png"));
        this.members.push(new Member("PeLo", 44000, 330 * million, "pelo.png"));
        this.members.push(new Member("Hosi", 260000, 5.1 * billion, "pascal.png"));
        this.members.push(new Member("Nicolas", 1.6 * million, 75 * billion, "nico.png"));
        this.members.push(new Member("Baby Ö", 10 * million, 1 * trillion, "philip.png"));
        this.members.push(new Member("Luki", 65 * million, 14 * trillion, "luki.png"));
        this.members.push(new Member("Party Pascal", 430 * million, 170 * trillion, "pascal_2.png"));
        this.members.push(new Member("Vape Nation Nicolas", 2.9 * billion, 2.1 * quadrillion, "nico_2.png"));
        this.members.push(new Member("Wütender Ö", 21 * billion, 26 * quadrillion, "philip_2.png"));
        this.members.push(new Member("Göttlicher Patrik", 150 * billion, 310 * quadrillion, "patrik_2.png"));
        this.members.push(new Member("W T F", 1.1 * trillion, 71 * quintillion, "wtf.png"));
        this.members.forEach(function (m) {
            m.dom.container.onclick = function () {
                if (m.getPrice() < _this.score) {
                    _this.score -= m.getPrice();
                    m.buy();
                    _this.upgrades.forEach(function (upgrade) {
                        upgrade.update();
                        if (upgrade.dom) {
                            upgrade.dom.onclick = function () {
                                if (_this.score >= upgrade.price) {
                                    upgrade.buy();
                                    _this.score -= upgrade.price;
                                }
                            };
                        }
                    });
                    _this.save.save();
                }
            };
        });
    };
    Game.prototype.instantiateUpgrades = function () {
        this.upgrades.push(new Upgrade("Stärkere Lesebrille", this.members[0], 1, 2, 100));
        this.upgrades.push(new Upgrade("Goldene Lesebrille", this.members[0], 1, 2, 500));
        this.upgrades.push(new Upgrade("Aerodynamische Lesebrille", this.members[0], 10, 2, 10000));
        this.upgrades.push(new Upgrade("Doppelt verglaste Lesebrille", this.members[0], 25, 2, 100000));
        this.upgrades.push(new Upgrade("Milde Chips", this.members[1], 1, 2, 1000));
        this.upgrades.push(new Upgrade("Geschmackvolle Chips", this.members[1], 5, 2, 5000));
        this.upgrades.push(new Upgrade("Salzige Chips", this.members[1], 25, 2, 50000));
        this.upgrades.push(new Upgrade("Chili Chips", this.members[1], 50, 2, 5000000));
        this.upgrades.push(new Upgrade("Trainingshosen", this.members[2], 1, 2, 11000));
        this.upgrades.push(new Upgrade("Saubere Trainingshosen", this.members[2], 5, 2, 55000));
        this.upgrades.push(new Upgrade("Flauschige Trainingshosen", this.members[2], 25, 2, 550000));
        this.upgrades.push(new Upgrade("Flauschige Trainingshosen", this.members[2], 50, 2, 55000000));
        this.upgrades.push(new Upgrade("Wasserkocher", this.members[3], 1, 2, 120000));
        this.upgrades.push(new Upgrade("Gusseiserner Wasserkocher", this.members[3], 5, 2, 600000));
        this.upgrades.push(new Upgrade("Turboschneller Wasserkocher", this.members[3], 25, 2, 6000000));
        this.upgrades.push(new Upgrade("Dampfbetriebener Wasserkocher", this.members[3], 50, 2, 600000000));
        this.upgrades.push(new Upgrade("Verstärkter Flaschenöffner", this.members[4], 1, 2, 1300000));
        this.upgrades.push(new Upgrade("Elektronischer Flaschenöffner", this.members[4], 5, 2, 6500000));
        this.upgrades.push(new Upgrade("Mehrfach-Flaschenöffner", this.members[4], 25, 2, 65000000));
        this.upgrades.push(new Upgrade("Flaschenöffner Schmierflüssigkeit", this.members[4], 50, 2, 65000000000));
        this.upgrades.push(new Upgrade("Seya!", this.members[5], 1, 2, 14000000));
        this.upgrades.push(new Upgrade("Seeeeya!!", this.members[5], 5, 2, 70000000));
        this.upgrades.push(new Upgrade("SEYAA!!!", this.members[5], 25, 2, 700000000));
        this.upgrades.push(new Upgrade("SEEEEEYAAAA!!!!", this.members[5], 50, 2, 70000000000));
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
        });
        this.score += increase / (1000 / this.intervalSpeed);
        this.scoreElement.updateScore(this.score, increase);
    };
    return Game;
}());
