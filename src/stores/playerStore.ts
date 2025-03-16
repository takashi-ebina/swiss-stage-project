import { defineStore } from 'pinia';
import { Player } from '@/types/player';

export const usePlayerStore = defineStore("player", () => {
  const players = Array.from({ length: 16 }, () => new Player());
  return { players };
});