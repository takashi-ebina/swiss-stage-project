export class Result {
  readonly name: string;
  readonly value: number;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }

  getOpponentResult(): Result {
    if (this.value === 1) {
      return new Result("負", 0);
    } else if (this.value === 0) {
      return new Result("勝", 1);
    } else if (this.value === 0.5) {
      return new Result("ジゴ", 0.5);
    }
    return new Result("", -1);
  }
};