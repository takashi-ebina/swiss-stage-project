import { Match } from '@/models/match';
import { Result } from '@/models/result';
import type { Rank } from '@/types/rank';

export class Player {
  id: number;
  organization: string;
  name: string;
  rank: Rank;
  matches: Match[];
  points: number;
  sos: number;
  sodos: number;
  rankingScore: number;
  ranking: number;

  constructor();
  constructor(id: number, name: string, rank: Rank);
  constructor(id?: number, name?: string, rank?: Rank) {
    this.id = id === undefined ? -1 : id;
    this.organization = "";
    this.name = name === undefined || null ? "" : name;
    this.rank = rank === undefined || null ? { name: "", value: 99 } : rank;
    this.matches = [
      new Match("", new Result("", -1)),
      new Match("", new Result("", -1)),
      new Match("", new Result("", -1)),
      new Match("", new Result("", -1)),
    ]
    this.points = 0;
    this.sos = 0;
    this.sodos = 0;
    this.rankingScore = 0;
    this.ranking = 0;
  }

  updatePlayerId(id: number): Player{
    this.id = id;
    return this;
  }
}