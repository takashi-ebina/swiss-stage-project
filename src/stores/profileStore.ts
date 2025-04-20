import { defineStore } from 'pinia';
import { Profile } from '@/models/profile';

export const useProfileStore = defineStore("profile", () => {
  const profiles = Array.from({ length: 16 }, () => new Profile());
  return { profiles };
});