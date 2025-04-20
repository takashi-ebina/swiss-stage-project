import { Rank } from "@/models/rank";
import { rankOptions } from "@/constants/rankOptions";
import type { ProfileDto } from "@/types/profileDto";

export class Profile {
  id: number;
  organization: string;
  name: string;
  rank: Rank;

  constructor();
  constructor(id?: number, organization?: string, name?: string, rank?: Rank, profileDto?: ProfileDto);
  constructor(id?: number, organization?: string, name?: string, rank?: Rank, profileDto?: ProfileDto) {
    if (profileDto === undefined) {
      this.id           = id           === undefined ? -1 : id;
      this.organization = organization === undefined ? "" : organization;
      this.name         = name         === undefined ? "" : name;
      this.rank         = rank         === undefined ? new Rank("", 99): rank;
    } else {
      this.id           = profileDto.id;
      this.organization = profileDto.organization;
      this.name         = profileDto.name;
      this.rank         = rankOptions.find(rank => profileDto.rank === rank.value) ?? new Rank("", 99);
    }
  }

  updateProfileId(id: number): Profile{
    this.id = id;
    return this;
  }

  clone(): Profile {
    return new Profile(this.id, this.organization, this.name, this.rank);
  }

  static fromDto(dto: ProfileDto): Profile {
    return new Profile(undefined, undefined, undefined, undefined, dto);
  }
}
