import { defineStore } from 'pinia';
import { ConfInfo } from '@/models/confInfo';
import { constant } from '@/constants/constant';


export const useConfInfoStore = defineStore("confInfo", () => {
  const confInfo: ConfInfo[] = [new ConfInfo("group_count", constant.GROUP_SIZE.toString()), new ConfInfo("match_count", constant.MATCH_SIZE.toString())];
  return { confInfo };
});
