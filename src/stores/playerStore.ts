import { defineStore } from 'pinia';
import { Player } from '@/models/player';
import { constant } from '@/constants/constant';

export const usePlayerStore = defineStore("player", () => {
  const players: Player[] = Array.from({ length: constant.GROUP_SIZE }, (_, groupIdx) =>
    Array.from({ length: constant.PLAYER_MAX_SIZE }, () => Player.fromGroupId(groupIdx))).flat(); // flat便利すぎる、、、
  const getPlayersByGroupId = (groupId: number): Player[] => {
      return players.filter(player => player.profile.group_id === groupId);
    };
  return { players, getPlayersByGroupId };
});