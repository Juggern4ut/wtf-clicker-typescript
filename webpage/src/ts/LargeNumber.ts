class LargeNumber {
  potence: number;
  value: number;
  scale: string[][] = [
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

  constructor(value: number, potence: number) {
    if (potence % 3 !== 0) {
      console.error("The LargeNumber class doesn't allow potences not dividible by 3");
      return;
    }

    this.value = value;
    this.potence = potence;

    this.recalculate();
  }

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

  toString() {
    if (this.value === 1) {
      return this.value.toFixed(0) + " " + this.scale[this.potence / 3][0];
    }

    const decimals = this.value % 1 === 0 ? 0 : 2;
    return this.value.toFixed(decimals) + " " + this.scale[this.potence / 3][1];
  }

  static equalize(number: LargeNumber, newPotence: number): number {
    let tmpPotence = number.potence;
    let tmpValue = number.value;
    if (tmpPotence === newPotence) return tmpValue;
    if (tmpPotence < newPotence) {
      while (tmpPotence < newPotence) {
        tmpValue /= 1000;
        tmpPotence += 3;
      }
    } else {
      while (tmpPotence > newPotence) {
        tmpValue *= 1000;
        tmpPotence -= 3;
      }
    }
    return tmpValue;
  }

  static add(number1: LargeNumber, number2: LargeNumber): LargeNumber {
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

  static subtract(number1: LargeNumber, number2: LargeNumber): LargeNumber {
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
