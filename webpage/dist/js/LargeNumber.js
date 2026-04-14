/**
 * Represents a large number using a value and power-of-thousand scale.
 */
export class LargeNumber {
    /**
     * Creates a new large number.
     * @param value The numeric value.
     * @param potence The power-of-thousand exponent.
     */
    constructor(value, potence) {
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
            this.value = value;
            this.potence = potence;
            return;
        }
        this.value = value;
        this.potence = potence;
        this.recalculate();
    }
    /**
     * Re-normalizes the large number to the configured thousand scale.
     */
    recalculate() {
        while (this.value >= 1000) {
            this.value = this.value / 1000;
            this.potence += 3;
        }
        while (this.value < 1) {
            this.value = this.value * 1000;
            this.potence -= 3;
        }
    }
    /**
     * Converts the large number to display text.
     * @returns The formatted large number.
     */
    toString() {
        if (this.value === 1) {
            return this.value.toFixed(0) + " " + this.scale[this.potence / 3][0];
        }
        const decimals = this.value % 1 === 0 ? 0 : 2;
        return this.value.toFixed(decimals) + " " + this.scale[this.potence / 3][1];
    }
    /**
     * Equalizes a large number to another potence.
     * @param number The source number.
     * @param newPotence The target potence.
     * @returns The equalized numeric value.
     */
    static equalize(number, newPotence) {
        let tmpPotence = number.potence;
        let tmpValue = number.value;
        if (tmpPotence === newPotence) {
            return tmpValue;
        }
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
    }
    /**
     * Adds two large numbers.
     * @param number1 The first number.
     * @param number2 The second number.
     * @returns The sum.
     */
    static add(number1, number2) {
        if (number1.potence === number2.potence) {
            return new LargeNumber(number1.value + number2.value, number1.potence);
        }
        const largerNumber = number1.potence > number2.potence ? number1 : number2;
        const smallerNumber = number1.potence < number2.potence ? number1 : number2;
        let tmpPotence = smallerNumber.potence;
        let tmpValue = smallerNumber.value;
        while (tmpPotence < largerNumber.potence) {
            tmpValue = tmpValue / 1000;
            tmpPotence += 3;
        }
        return new LargeNumber(tmpValue + largerNumber.value, largerNumber.potence);
    }
    /**
     * Subtracts one large number from another.
     * @param number1 The first number.
     * @param number2 The second number.
     * @returns The difference.
     */
    static subtract(number1, number2) {
        if (number1.potence === number2.potence) {
            return new LargeNumber(number1.value + number2.value, number1.potence);
        }
        const largerNumber = number1.potence > number2.potence ? number1 : number2;
        const smallerNumber = number1.potence < number2.potence ? number1 : number2;
        let tmpPotence = smallerNumber.potence;
        let tmpValue = smallerNumber.value;
        while (tmpPotence < largerNumber.potence) {
            tmpValue = tmpValue / 1000;
            tmpPotence += 3;
        }
        return new LargeNumber(tmpValue - largerNumber.value, largerNumber.potence);
    }
}
