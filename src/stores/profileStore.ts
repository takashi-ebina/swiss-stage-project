import { defineStore } from 'pinia';
import { Profile } from '@/models/profile';
import { constant } from '@/constants/constant';

export const useProfileStore = defineStore("profile", () => {
  const profiles: Profile[] = Array.from({ length: constant.GROUP_SIZE }, (_, groupIdx) =>
    Array.from({ length: constant.PLAYER_MAX_SIZE }, (_, index) => new Profile(groupIdx + 1, index + 1))).flat(); // flat便利すぎる、、、

  return { profiles };
});