import { Match } from '@/models/match';
import { Result } from '@/models/result';
import { Profile } from "@/models/profile";
import type { ProfileDto } from '@/types/profileDto';
import type { MatchDto } from '@/types/matchDto';
import { resultOptions } from "@/constants/resultOptions";

export class Player {
  profile: Profile;
  matches: Match[];
  points: number;
  sos: number;
  sodos: number;
  rankingScore: number;
  ranking: number;

  constructor();
  constructor(profile?: Profile, matchDtoList?: MatchDto[]);
  constructor(profile?: Profile, matchDtoList?: MatchDto[]) {
    this.profile = profile === undefined ? new Profile() : profile;
    if (matchDtoList === undefined) {
      this.matches = [
         new Match("", new Result("", -1)),
         new Match("", new Result("", -1)),
         new Match("", new Result("", -1)),
         new Match("", new Result("", -1)),
       ]
    } else {
      matchDtoList.sort((a, b) => a.idx - b.idx);
      this.matches = matchDtoList.map((matchDto) => new Match(matchDto.opponent_id.toString(), 
        resultOptions.find(result => matchDto.result === result.value) ?? new Result("", -1)));
    }
    this.points = 0;
    this.sos = 0;
    this.sodos = 0;
    this.rankingScore = 0;
    this.ranking = 0;
  }

  /**
   * Insertに利用するPlayerDtoに変換
   */
  toProfileDto(): ProfileDto {
    return {
      id: this.profile.id,
      organization: this.profile.organization,
      name: this.profile.name,
      rank: this.profile.rank.value
    }
  }
  /**
   * Insertに利用するMatchDto[]に変換
   */
  toMatchDtoList(): MatchDto[] {
    return this.matches.map((match, index) => {
      return {
        id: this.profile.id,
        idx: index,
        opponent_id: Number(match.opponentId),
        result: match.result.value, 
      };
    });
  }

  static fromDtos(profileDto: ProfileDto, matchDtoList: MatchDto[]): Player {
    return new Player(Profile.fromDto(profileDto), matchDtoList);
  }

  static fromDto(profileDto: ProfileDto): Player {
    return new Player(Profile.fromDto(profileDto), undefined);
  }
}