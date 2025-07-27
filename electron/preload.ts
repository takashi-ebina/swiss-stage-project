const { contextBridge, ipcRenderer } = require('electron');
import type { ProfileDto } from '../src/types/profileDto';
import type { MatchDto } from '../src/types/matchDto';
import type { TitleInfoDto } from '../src/types/titleInfoDto';
import type { ConfInfoDto } from '../src/types/confInfoDto';

contextBridge.exposeInMainWorld('electronAPI', {
  initDb: (): Promise<void> => ipcRenderer.invoke('init-db'),
  findAllProfiles: (): Promise<ProfileDto[]> => ipcRenderer.invoke('find-all-profiles'),
  findAllMatches: (): Promise<MatchDto[]> => ipcRenderer.invoke('find-all-matches'),
  findOneTitleInfo: (): Promise<TitleInfoDto[]> => ipcRenderer.invoke('find-one-title-info'),
  findAllConfInfo: (): Promise<ConfInfoDto[]> => ipcRenderer.invoke('find-all-conf-info'),
  save: (groupId: number, profileDto: ProfileDto, matchDtoList: MatchDto[]): Promise<void> =>
    ipcRenderer.invoke('save', groupId, profileDto, matchDtoList),
  saveTitleInfo: (titleInfoDto: TitleInfoDto): Promise<void> =>
    ipcRenderer.invoke('save-title-info', titleInfoDto),
  saveConfInfo: (confInfoDto: ConfInfoDto): Promise<void> =>
    ipcRenderer.invoke('save-conf-info', confInfoDto),
  delete: (): Promise<void> => ipcRenderer.invoke('delete'),
});