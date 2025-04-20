const { contextBridge, ipcRenderer } = require('electron');
import type { ProfileDto } from '../src/types/profileDto';
import type { MatchDto } from '../src/types/matchDto';

contextBridge.exposeInMainWorld('electronAPI', {
  initDb: (): Promise<void> => ipcRenderer.invoke('init-db'),
  findAllProfiles: (): Promise<ProfileDto[]> => ipcRenderer.invoke('find-all-profiles'),
  findAllMatches: (): Promise<MatchDto[]> => ipcRenderer.invoke('find-all-matches'),
  save: (profileDto: ProfileDto, matchDtoList: MatchDto[]): Promise<void> =>
    ipcRenderer.invoke('save', profileDto, matchDtoList),
  delete: (): Promise<void> => ipcRenderer.invoke('delete'),
});