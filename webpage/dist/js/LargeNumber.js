var LargeNumber = /** @class */ (function () {
    function LargeNumber(value, potence) {
        this.scale = [
            ["", ""],
            ["tausend", "tausend"],
            ["million", "millionen"],
            ["milliarde", "milliarden"],
            ["billion", "billionen"],
            ["billiarde", "billiarden"],
            ["trillion", "trillionen"],
            ["trilliarde", "trilliarden"],
            ["quadrillion", "quadrillionen"],
            ["quadrilliarde", "quadrilliarden"],
            ["quintillion", "quintillionen"],
            ["quintilliarde", "quintilliarden"],
            ["sextillion", "sextillionen"],
            ["sextilliarde", "sextilliarden"],
            ["septillion", "septillionen"],
            ["septilliarde", "septilliarden"],
            ["oktillion", "oktillionen"],
            ["oktilliarde", "oktilliarden"],
            ["nonillion", "nonillionen"],
            ["nonilliarde", "nonilliarden"],
            ["dezillion", "dezillionen"],
            ["dezilliarde", "dezilliarden"],
        ];
        if (potence % 3 !== 0) {
            console.error("The LargeNumber class doesn't allow potences not dividible by 3");
            return;
        }
        this.value = value;
        this.potence = potence;
        this.recalculate();
    }
    LargeNumber.prototype.recalculate = function () {
        while (this.value >= 1000) {
            this.value = this.value / 1000;
            this.potence += 3;
        }
        while (this.value < 1) {
            this.value = this.value * 1000;
            this.potence -= 3;
        }
    };
    LargeNumber.prototype.toString = function () {
        if (this.value === 1) {
            return this.value.toFixed(0) + " " + this.scale[this.potence / 3][0];
        }
        var decimals = this.value % 1 === 0 ? 0 : 2;
        return this.value.toFixed(decimals) + " " + this.scale[this.potence / 3][1];
    };
    LargeNumber.equalize = function (number, newPotence) {
        var tmpPotence = number.potence;
        var tmpValue = number.value;
        if (tmpPotence === newPotence)
            return tmpValue;
        if (tmpPotence < newPotence) {
            while (tmpPotence < newPotence) {
                tmpValue /= 1000;
                tmpPotence += 3;
            }
        }
        else {
            while (tmpPotence > newPotence) {
                tmpValue *= 1000;
                tmpPotence -= 3;
            }
        }
        return tmpValue;
    };
    LargeNumber.add = function (number1, number2) {
        if (number1.potence === number2.potence) {
            return new LargeNumber(number1.value + number2.value, number1.potence);
        }
        var largerNumber = number1.potence > number2.potence ? number1 : number2;
        var smallerNumber = number1.potence < number2.potence ? number1 : number2;
        var tmpPotence = smallerNumber.potence;
        var tmpValue = smallerNumber.value;
        while (tmpPotence < largerNumber.potence) {
            tmpValue = tmpValue / 1000;
            tmpPotence += 3;
        }
        return new LargeNumber(tmpValue + largerNumber.value, largerNumber.potence);
    };
    LargeNumber.subtract = function (number1, number2) {
        if (number1.potence === number2.potence) {
            return new LargeNumber(number1.value + number2.value, number1.potence);
        }
        var largerNumber = number1.potence > number2.potence ? number1 : number2;
        var smallerNumber = number1.potence < number2.potence ? number1 : number2;
        var tmpPotence = smallerNumber.potence;
        var tmpValue = smallerNumber.value;
        while (tmpPotence < largerNumber.potence) {
            tmpValue = tmpValue / 1000;
            tmpPotence += 3;
        }
        return new LargeNumber(tmpValue - largerNumber.value, largerNumber.potence);
    };
    return LargeNumber;
}());
