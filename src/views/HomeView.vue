<script setup lang="ts">
import { ref, watch } from 'vue'
import { playerUtil } from "@/utils/playerUtil";
import { usePlayerStore } from "@/stores/playerStore";
import { resultOptions } from "@/constants/resultOptions";
import { roundOptions } from "@/constants/roundOptions";
import { constant } from "@/constants/constant";
import { Player } from "@/models/player";
import { Result } from "@/models/result";
import { Match } from "@/models/match";
import type { Round } from "@/types/round";

const $PlayerStore = usePlayerStore();
const selectedRound = ref<Round>({ value: 1 });

watch($PlayerStore.players, (newPlayers) => {
  playerUtil.updatePlayerMatchScore(newPlayers);
},
  { deep: true }
);

/**
 * 勝敗の結果に対応したクラス名を返却する
 * @param {Result} result 勝敗の結果
 * @returns {string} クラス名
 */
const getResultClass = (result: Result): string => {
  if (!result.name) return "";
  switch (result.value) {
    case 1:
      return "result-win";
    case 0:
      return "result-lose";
    case 0.5:
      return "result-draw";
    default:
      return "";
  }
}

/**
 * セレクトボックスで選択した回戦に対して、対戦相手をマッチさせる
 */
const setOpponent = (): void => {
  for (const player of $PlayerStore.players) {
    if (player.profile.name.trim() === "") break;
    if (hasOpponentInRound(player, selectedRound.value.value)) continue;
    // いったん仮で-99を設定する
    player.matches[selectedRound.value.value - 1].opponentId = constant.OPPONENT_PLAYER_NO_MATCH;
    // 毎回、Noの昇順で対戦相手を探すと、組み合わせに偏りが出そうなので、
    // 偶数の回戦の場合はNoの降順で対戦相手を探すようにしているが意味あるかはわからない・・
    const tmpPlayers = selectedRound.value.value % 2 !== 0 ? $PlayerStore.players : [...$PlayerStore.players].reverse();
    for (const opponentPlayer of tmpPlayers) {
      if (player.profile.id === opponentPlayer.profile.id
        || opponentPlayer.profile.name.trim() === ""
        || hasOpponentInRound(opponentPlayer, selectedRound.value.value)
        || hasAlreadyMatched(player, opponentPlayer, selectedRound.value.value)) {
        continue;
      }
      const pointsDifference = Math.abs(player.points -  opponentPlayer.points);
      if (pointsDifference >= 0 && pointsDifference <= 0.5) {
        // お互いの勝ち点の差が0.5点以内の場合、対戦相手としてマッチさせる
        player.matches[selectedRound.value.value - 1].opponentId = opponentPlayer.profile.id.toString();
        opponentPlayer.matches[selectedRound.value.value - 1].opponentId = player.profile.id.toString();
        break;
      }
    }
  }
}

/**
 * 選択した回戦において、既に対戦相手が設定されているか
 * @param {Player} player プレイヤー
 * @param {number} selectedRound 選択した回戦
 * @returns {boolean} 既に対戦相手が設定されている場合はtrue、それ以外の場合はfalseを返却する
 */
const hasOpponentInRound = (player: Player, selectedRound: number): boolean => {
  return player.matches[selectedRound - 1].opponentId !== "";
}

/**
 * 既に対戦したことある相手であるか
 * @param {Player} player プレイヤー
 * @param {Player} opponentPlayer 対戦相手
 * @param {number} currentRound 現在の回戦
 * @returns {boolean} 既に対戦したことがある場合はtrue、それ以外の場合はfalseを返却する
 */
const hasAlreadyMatched = (player: Player, opponentPlayer: Player, currentRound: number): boolean => {
  for (let i = currentRound; i >= 1; i--) {
    if (parseInt(player.matches[i - 1].opponentId) === opponentPlayer.profile.id) {
      return true;
    }
  }
  return false;
}

/**
 * プレイヤーの対戦結果を更新した後に呼ばれる処理
 * 対戦相手の結果の更新とプレイヤー、対戦相手の勝ち点の更新を行う
 * @param {Match} match 試合
 * @param {number} currentRound 現在の回戦
 * @param {number} ownPlayerIndex プレイヤーのインデックス
 */
const onResultChange = (match: Match, currentRound: number, ownPlayerIndex: number): void => {
  playerUtil.updatePlayerPoints($PlayerStore.players, match, currentRound, ownPlayerIndex);
}

</script>

<template>
  <div class="home">
    <v-row class="home-header justify-start ma-1">
      <v-col cols="2">
        <h2>対戦表</h2>
      </v-col>
      <v-col cols="2">
        <v-btn class="setting-botton bg-light-green-accent-4 text-white text-body-1 ma-1 pa-4" block @click="setOpponent">
          対戦相手の設定
        </v-btn>
      </v-col>
      <v-col cols="1">
        <v-select class="round-select" v-model="selectedRound" label="○回戦" :items="roundOptions" item-title="value"
          item-value="value" return-object variant="underlined">
        </v-select>
      </v-col>
    </v-row>
    <table class="home-table-design">
      <thead class="home-table-header">
        <tr>
          <th rowspan="2">No</th>
          <th rowspan="2">名前</th>
          <th rowspan="2">段級位</th>
          <template v-for="round in roundOptions" :key="'round-' + round">
            <th colspan="2" class="table-header-match">{{ round.value }}回戦</th>
            <th style="display:none"></th>
          </template>
          <th rowspan="2">勝点</th>
          <th rowspan="2">
            SOS
            <sup>
              <v-tooltip
                activator="parent"
                location="top"
                text="Sum of Opponents Scores（対戦相手の勝ち星の数）">
                <template v-slot:activator="{ props }">
                  <v-icon  v-bind="props" opacity="60%" icon="mdi-information-outline" size="x-small"></v-icon>
                </template>
              </v-tooltip>
            </sup>
          </th>
          <th rowspan="2">
            SODOS
            <sup>
              <v-tooltip
                activator="parent"
                location="top"
                text="Sum of Defeated Opponents Scores（負かした対戦相手の勝ち星の数）">
                <template v-slot:activator="{ props }">
                  <v-icon  v-bind="props" opacity="60%" icon="mdi-information-outline" size="x-small"></v-icon>
                </template>
              </v-tooltip>
            </sup>
          </th>
          <th rowspan="2">順位</th>
        </tr>
        <tr>
          <template v-for="round in 4" :key="'result-' + round">
            <th class="home-table-header-match">相手</th>
            <th class="home-table-header-match">結果</th>
          </template>
        </tr>
      </thead>
      <tbody class="home-table-body">
        <tr v-for="(player, index) in $PlayerStore.players" :key="player.profile.id">
          <td>{{ index + 1 }}</td>
          <td class="home-table-body-name">{{ player.profile.name }}</td>
          <td>{{ player.profile.rank.name }}</td>
          <template v-for="(match, round) in player.matches" :key="'match-' + index">
            <td class="home-table-body-matches-opponent" :class="getResultClass(match.result)">
              <v-text-field v-model="match.opponentId" variant="underlined" density="compact"></v-text-field>
            </td>
            <td class="home-table-body-matches-result" :class="getResultClass(match.result)">
              <v-select v-model="match.result" :items="resultOptions" item-title="name" item-value="value"
                variant="underlined" return-object density="compact"
                @update:modelValue="onResultChange(match, round, index)">
              </v-select>
            </td>
          </template>
          <template v-if="player.profile.name !== ''">
            <td> {{ player.points }} </td>
            <td> {{ player.sos }} </td>
            <td> {{ player.sodos }} </td>
            <td> {{ player.ranking }} </td>
          </template>
          <template v-else>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
@media print {
  .setting-botton,
  .round-select {
    display: none !important;
  }
}

.home-table-design {
  /* テーブルのヘッダーを固定にするために、テーブル内のセルの境界を分離 */
  border-collapse: separate;
  /* テーブルにおける隣り合うセルの境界同士の間隔 */
  border-spacing: 0;
  /* テーブルの列幅は固定 */
  table-layout: fixed;
  min-width: 700px;
  text-align: center;
  margin: auto;
}

.home-table-header th {
  /* ヘッダーを画面上部の位置で固定 */
  position: sticky;
  top: 0;
  z-index: 1;
  padding: .5em;
  border-top: 2px solid #64dd17;
  border-bottom: 2px solid #64dd17;
  color: #64dd17;
  background-color: #fff;
}

.home-table-header-match {
  /* 線の重なりを防ぐ */
  border-top: none !important;
  top: 2.85em !important;
}

.home-table-body th,
.home-table-body td {
  /* ホワイトスペースを統合するが、行は折り返さない */
  white-space: nowrap;
  padding: .01em .5em;
}

.home-table-body-name {
  width: 150px;
}

.home-table-body-match-no {
  width: 60px;
}

.home-table-body-matches-opponent {
  width: 50px;
}

.home-table-body-matches-result {
  width: 90px;
}

.result-win {
  background-color: rgba(0, 255, 0, 0.2);
}

.result-lose {
  background-color: rgba(255, 0, 0, 0.2);
}

.result-draw {
  background-color: rgba(255, 255, 0, 0.2);
}
</style>