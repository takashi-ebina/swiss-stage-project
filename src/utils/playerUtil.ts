import { Player } from "@/models/player";
import { Match } from "@/models/match";

/**
 * 対戦相手の結果の更新とプレイヤー、対戦相手の勝ち点の更新を行う
 * @param {Player[]} players プレイヤー
 * @param {Match} match 試合
 * @param {number} currentRound 現在の回戦
 * @param {number} ownPlayerIndex プレイヤーのインデックス
 */
const updatePlayerPoints = (players: Player[], match: Match, currentRound: number, ownPlayerIndex: number): void => {
  if (match.opponentId === "") return;
  const player = players[ownPlayerIndex];
  const opponentPlayer = players[parseInt(match.opponentId) - 1];
  if (opponentPlayer === undefined) return;
  
  // 対戦相手の結果の更新
  opponentPlayer.matches[currentRound].result = match.result.getOpponentResult();
  // プレイヤー、対戦相手の勝ち点の更新
  opponentPlayer.points = opponentPlayer.matches
    .filter((match) => match.result.name !== "")
    .map((match) => match.result.value)
    .reduce((sum, resultValue) => sum + resultValue, 0);
  player.points = player.matches
    .filter((match) => match.result.name !== "")
    .map((match) => match.result.value)
    .reduce((sum, resultValue) => sum + resultValue, 0);
}

/**
 * プレイヤーのsos、sodos、rankingScore、rankingの更新を行う
 * @param {Player[]} players プレイヤー
 */
const updatePlayerMatchScore = (players: Player[]): void => {
  players.forEach((player) => {
    player.sos = player.matches
      .filter((match) => match.isValidOpponent())
      .map((match) => players[parseInt(match.opponentId) - 1].points)
      .reduce((sum, points) => sum + points, 0);
    player.sodos = player.matches
      .filter((match) => match.isValidOpponent() && match.result.value === 1)
      .map((match) => players[parseInt(match.opponentId) - 1].points)
      .reduce((sum, points) => sum + points, 0);
    player.rankingScore = (player.points * 1000000) + (player.sos * 1000) + (player.sodos * 2);
      const tmpPlayers = players.slice();
      tmpPlayers.sort((a, b) => b.rankingScore - a.rankingScore);
      player.ranking = tmpPlayers.findIndex(tmpPlayer => tmpPlayer.rankingScore === player.rankingScore) + 1;
  });
}

export const playerUtil = {
    updatePlayerPoints,
    updatePlayerMatchScore
}

