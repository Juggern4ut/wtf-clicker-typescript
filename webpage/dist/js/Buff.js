var Buff = /** @class */ (function () {
    function Buff() {
    }
    Buff.prototype.consumeItem = function (item) {
        this.activeBuff = item;
        this.buffStart = Date.now();
    };
    Buff.prototype.checkBuff = function () {
        if (!this.activeBuff)
            return false;
        return this.buffStart + this.activeBuff.duration * 1000 > Date.now();
    };
    return Buff;
}());
