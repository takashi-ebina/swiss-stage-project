import type { Match } from '@/types/match';
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

    constructor() {
        this.id = -1;
        this.organization = "";
        this.name = "";
        this.rank  = {
            name: "",
            value: 99
          };
        this.matches = Array.from({ length: 4 }, (_, i) => ({
            opponent: "",
            result: { name: "", value: -1 }
          }));
        this.points = 0;
        this.sos = 0;
        this.sodos = 0;
        this.rankingScore = 0;
        this.ranking = 0;
      }

      static create(data: Partial<Player>): Player {
        return Object.assign(new Player(), data);
    }
}