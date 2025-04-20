import type { PlayerDto } from '../src/types/playerDto';
import type { MatchDto } from '../src/types/matchDto';
export {}

declare global {
  interface Window {
    electronAPI: {
      initDb: () => Promise<void>
      findAllProfiles: () => Promise<PlayerDto[]>
      findAllMatches: () => Promise<MatchDto[]>
      save: (playerDto: PlayerDto, matchDtoList: MatchDto[]) => Promise<void>
      delete: () => Promise<void>
    }
  }
}