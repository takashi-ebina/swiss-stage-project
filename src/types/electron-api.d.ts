import type { ProfileDto } from '../src/types/profileDto';
import type { MatchDto } from '../src/types/matchDto';
import type { TitleInfoDto } from './titleInfoDto';
import type { ConfInfoDto } from './confInfoDto';
export {}

declare global {
  interface Window {
    electronAPI: {
      initDb: () => Promise<void>
      findAllProfiles: () => Promise<ProfileDto[]>
      findAllMatches: () => Promise<MatchDto[]>
      findOneTitleInfo: () => Promise<TitleInfoDto[]>
      findAllConfInfo: () => Promise<ConfInfoDto[]>
      save: (groupId: number, profileDto: ProfileDto, matchDtoList: MatchDto[]) => Promise<void>
      saveTitleInfo: (titleInfoDto: TitleInfoDto) => Promise<void>
      saveConfInfo: (confInfoDto: ConfInfoDto[]) => Promise<void>
      delete: () => Promise<void>
    }
  }
}