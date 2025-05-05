import { Result } from '@/models/result';
import { constant } from "@/constants/constant";

export class Match {
  opponentId: string;
  result: Result;

  constructor(opponentId: string, result: Result) {
    this.opponentId = opponentId;
    this.result = result;
  }

  isValidOpponent(): boolean  {
    return this.opponentId !== "" && this.opponentId !== constant.OPPONENT_PLAYER_NO_MATCH
  }
}