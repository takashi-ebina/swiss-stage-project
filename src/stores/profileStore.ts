import { defineStore } from 'pinia';
import { Profile } from '@/models/profile';
import { constant } from '@/constants/constant';

export const useProfileStore = defineStore("profile", () => {
  const profiles = Array.from({ length: constant.PLAYER_MAX_SIZE }, () => new Profile());
  return { profiles };
});