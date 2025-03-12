import { defineStore } from 'pinia';
import { Player } from '@/types/player';

export const usePlayerListStore = defineStore("playerList", () => {
  const players = Array.from({ length: 16 }, () => new Player());
  return { players };
});