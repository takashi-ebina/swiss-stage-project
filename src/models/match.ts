import { Result } from '@/models/result';

export class Match {
  opponent: string;
  result: Result;

  constructor(opponent: string, result: Result) {
    this.opponent = opponent;
    this.result = result;
  }
}