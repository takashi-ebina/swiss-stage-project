import { defineStore } from 'pinia';
import { Player } from '@/models/player';
import { constant } from '@/constants/constant';

export const usePlayerStore = defineStore("player", () => {
  const players = Array.from({ length: constant.PLAYER_MAX_SIZE }, () => new Player());
  return { players };
});