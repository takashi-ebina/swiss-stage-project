import { Result } from '@/models/result';
import { constant } from "@/constants/constant";

export class Match {
  group_id: number;
  opponentId: string;
  result: Result;

  constructor(group_id: number, opponentId: string, result: Result) {
    this.group_id = group_id;
    this.opponentId = opponentId;
    this.result = result;
  }

  isValidOpponent(): boolean  {
    return this.opponentId !== "" && this.opponentId !== constant.OPPONENT_PLAYER_NO_MATCH
  }
}