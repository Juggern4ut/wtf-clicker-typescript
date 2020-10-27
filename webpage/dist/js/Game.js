var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.intervalSpeed = 100;
        this.members = [];
        this.score = 0;
        this.scoreElement = new Score(document.querySelector(".score"), document.querySelector(".scorePerSeconds"));
        this.clicker = new Clicker(this);
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
        this.save = new Save(this);
        this.save.load();
        this.members.forEach(function (m) {
            m.dom.container.onclick = function () {
                if (m.getPrice() < _this.score) {
                    _this.score -= m.getPrice();
                    m.buy();
                    _this.save.save();
                }
            };
        });
        this.saveInterval = setInterval(function () {
            _this.save.save();
        }, 5000);
        this.stepInterval = setInterval(function () {
            _this.step();
        }, this.intervalSpeed);
    }
    Game.prototype.step = function () {
        var _this = this;
        var increase = 0;
        this.members.forEach(function (m) {
            increase += m.getIncrease();
        });
        this.members.forEach(function (m) {
            m.updateBuyability(_this.score);
        });
        this.score += increase / (1000 / this.intervalSpeed);
        this.scoreElement.updateScore(this.score, increase);
    };
    return Game;
}());
