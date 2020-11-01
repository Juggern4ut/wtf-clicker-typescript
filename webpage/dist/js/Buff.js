var Buff = /** @class */ (function () {
    function Buff(members) {
        this.members = members;
    }
    Buff.prototype.consumeItem = function (item) {
        if (item.duration > 0) {
            this.activeBuff = item;
            this.buffStart = Date.now();
            var activeBuffImage = document.querySelector(".active_buff__image");
            activeBuffImage.src = "/img/items/" + this.activeBuff.imageString;
        }
        else {
            if (item.id === 1000) {
                var member = this.getRandomMember(true);
                member.amount++;
                alert("Gratuliere! 1x " + member.name);
            }
            else if (item.id === 4) {
                var wonMember = this.getRandomMember(true);
                var lostMember = this.getRandomMember(true);
                wonMember.amount++;
                lostMember.amount--;
                alert("Mitgliederveränderungen: +1 " + wonMember.name + ", -1 " + lostMember.name);
            }
        }
    };
    Buff.prototype.checkBuff = function () {
        if (!this.activeBuff)
            return false;
        return this.buffStart + this.activeBuff.duration * 1000 > Date.now();
    };
    Buff.prototype.update = function () {
        if (!this.checkBuff()) {
            this.activeBuff = null;
            this.buffStart = null;
        }
        this.updateDom();
    };
    Buff.prototype.updateDom = function () {
        var body = document.querySelector("body");
        var activeBuff = document.querySelector(".active_buff");
        var activeBuffInner = document.querySelector(".active_buff__time--inner");
        if (this.activeBuff) {
            var dur = this.activeBuff.duration * 1000;
            var remain = (this.buffStart + dur - Date.now()) / (this.activeBuff.duration * 1000);
            body.classList.add("buff");
            activeBuff.classList.add("active_buff--visible");
            activeBuffInner.style.width = remain * 100 + "%";
        }
        else {
            body.classList.remove("buff");
            activeBuff.classList.remove("active_buff--visible");
        }
    };
    Buff.prototype.getRandomMember = function (bought) {
        if (bought === void 0) { bought = true; }
        var possible = [];
        this.members.forEach(function (m) {
            if (m.amount > 0 || !bought) {
                possible.push(m);
            }
        });
        return possible[Math.floor(Math.random() * possible.length)];
    };
    return Buff;
}());
