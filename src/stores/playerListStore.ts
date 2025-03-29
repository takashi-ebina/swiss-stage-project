import { defineStore } from 'pinia';
import { Player } from '@/models/player';

export const usePlayerListStore = defineStore("playerList", () => {
  const players = Array.from({ length: 16 }, () => new Player());
  return { players };
});