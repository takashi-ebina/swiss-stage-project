import type { PlayerDto } from '../src/types/playerDto';
import type { MatchDto } from '../src/types/matchDto';
import type { TitleInfoDto } from './titleInfoDto';
export {}

declare global {
  interface Window {
    electronAPI: {
      initDb: () => Promise<void>
      findAllProfiles: () => Promise<PlayerDto[]>
      findAllMatches: () => Promise<MatchDto[]>
      findOneTitleInfo: () => Promise<TitleInfoDto[]>
      save: (playerDto: PlayerDto, matchDtoList: MatchDto[]) => Promise<void>
      saveTitleInfo: (titleInfoDto: TitleInfoDto) => Promise<void>
      delete: () => Promise<void>
    }
  }
}