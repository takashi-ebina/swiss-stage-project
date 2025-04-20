import { Result } from '@/models/result';

export class Match {
  opponentId: string;
  result: Result;

  constructor(opponentId: string, result: Result) {
    this.opponentId = opponentId;
    this.result = result;
  }
}