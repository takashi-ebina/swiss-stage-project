import { Player } from "@/models/player";
import { Match } from "@/models/match";

/**
 * 対戦相手の結果の更新とプレイヤー、対戦相手の勝ち点の更新を行う
 * @param {Player[]} players プレイヤー
 * @param {Player} ownPlayer プレイヤー自身
 * @param {Match} match 試合
 * @param {number} currentRound 現在の回戦
 */
const updatePlayerPoints = (
  players: Player[], 
  ownPlayer: Player, 
  match: Match, 
  currentRound: number, 
): void => {
  const opponentPlayer = findOpponentPlayer(players, match);
  if (opponentPlayer === undefined) return;
  // 対戦相手の結果の更新
  opponentPlayer.matches[currentRound].result = match.result.getOpponentResult();
  // プレイヤー、対戦相手の勝ち点の更新
  opponentPlayer.points = opponentPlayer.matches
    .filter((match) => match.result.name !== "")
    .map((match) => match.result.value)
    .reduce((sum, resultValue) => sum + resultValue, 0);
  ownPlayer.points = ownPlayer.matches
    .filter((match) => match.result.name !== "")
    .map((match) => match.result.value)
    .reduce((sum, resultValue) => sum + resultValue, 0);
}

/**
 * プレイヤーのsos、sodos、rankingScore、rankingの更新を行う
 * @param {Player[]} players プレイヤー
 */
const updatePlayerMatchScore = (
  players: Player[]
): void => {
  players.forEach((player) => {
    player.sos = player.matches
      .filter((match) => match.isValidOpponent())
      .map((match) => {
        const opponent = findOpponentPlayer(players, match);
        return opponent ? opponent.points : 0;
      })
      .reduce((sum, points) => sum + points, 0);
    player.sodos = player.matches
      .filter((match) => match.isValidOpponent() && match.result.value === 1)
      .map((match) => {
        const opponent = findOpponentPlayer(players, match);
        return opponent ? opponent.points : 0;
      })
      .reduce((sum, points) => sum + points, 0);
    player.rankingScore = (player.points * 1000000) + (player.sos * 1000) + (player.sodos * 2);
    const tmpPlayers = players.slice().filter(tmpPlayer => tmpPlayer.profile.group_id === player.profile.group_id);
    tmpPlayers.sort((a, b) => b.rankingScore - a.rankingScore);
    player.ranking = tmpPlayers.findIndex(tmpPlayer => tmpPlayer.rankingScore === player.rankingScore) + 1;
  });
}

const findOpponentPlayer = (
  players: Player[], 
  match: Match, 
): Player | undefined => {
  const opponentId = Number(match.opponentId);
  if (Number.isNaN(opponentId)) {
    return undefined;
  }
  return players.find(player =>
    player.profile.group_id === match.group_id &&
    player.profile.id === opponentId
  );
}

export const playerUtil = {
    updatePlayerPoints,
    updatePlayerMatchScore,
    findOpponentPlayer
}

