import type { ProfileDto } from '../src/types/profileDto';
import type { MatchDto } from '../src/types/matchDto';
import type { TitleInfoDto } from './titleInfoDto';
export {}

declare global {
  interface Window {
    electronAPI: {
      initDb: () => Promise<void>
      findAllProfiles: () => Promise<ProfileDto[]>
      findAllMatches: () => Promise<MatchDto[]>
      findOneTitleInfo: () => Promise<TitleInfoDto[]>
      save: (profileDto: ProfileDto, matchDtoList: MatchDto[]) => Promise<void>
      saveTitleInfo: (titleInfoDto: TitleInfoDto) => Promise<void>
      delete: () => Promise<void>
    }
  }
}