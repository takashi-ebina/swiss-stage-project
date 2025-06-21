import { defineStore } from 'pinia';
import { Profile } from '@/models/profile';
import { constant } from '@/constants/constant';

export const useProfileStore = defineStore("profile", () => {
  const profiles: Profile[] = Array.from({ length: constant.GROUP_SIZE }, (_, groupIdx) =>
    Array.from({ length: constant.PLAYER_MAX_SIZE }, () => new Profile(groupIdx + 1))).flat(); // flat便利すぎる、、、
  const getProfilesByGroupId = (groupId: number): Profile[] => {
    return profiles.filter(profile => profile.group_id === groupId);
  };
  return { profiles, getProfilesByGroupId };
});