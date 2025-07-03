import { defineStore } from 'pinia';
import { TitleInfo } from '@/models/titleInfo';

export const useTitleInfoStore = defineStore("titleInfo", () => {
  const titleInfo: TitleInfo = new TitleInfo("", "");
  return { titleInfo };
});