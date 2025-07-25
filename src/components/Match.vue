<script setup lang="ts">
import { reactive, watch } from 'vue'
import 'vue-toast-notification/dist/theme-sugar.css';
import { useToast } from 'vue-toast-notification';
import EmptyArea from '@/components/EmptyArea.vue'
import { playerUtil } from "@/utils/playerUtil";
import { usePlayerStore } from "@/stores/playerStore";
import { resultOptions } from "@/constants/resultOptions";
import { roundOptions } from "@/constants/roundOptions";
import { Player } from "@/models/player";
import { Result } from "@/models/result";
import { Match } from "@/models/match";
import { Round } from "@/models/round";
const props = defineProps<{
  groupId: number,
}>();
const state = reactive({
  selectedRound: new Round("1回戦", 1 ),
});
const playerStore = usePlayerStore();
const $toast = useToast();
const playersByGroupId = playerUtil.getNotEmptyPlayers(playerUtil.getPlayersByGroupId(playerStore.players, props.groupId))
watch(playerStore.players, (newPlayers) => {
  playerUtil.updatePlayerMatchScore(newPlayers, props.groupId);
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
  const round = state.selectedRound.value;
  const players = playerUtil.getPlayersByGroupId(playerStore.players, props.groupId)
    .filter(p => p.profile.name.trim() !== "")
    .sort((a, b) => b.points - a.points);
  const success = pairPlayersBacktrack(players, round);
  players.sort((a, b) => a.profile.id - b.profile.id);
  if (success) {
    $toast.success("対戦相手を設定しました!", { position: "top" });
  } else {
    $toast.warning("対戦相手の自動設定に失敗しました。手動で設定してください。", { position: "top" });
  }
};
/**
 * バックトラック法で対戦相手を探索する
 * @param players 対戦候補のプレイヤーリスト
 * @param round 選択した回戦
 */
const pairPlayersBacktrack = (players: Player[], round: number): boolean => {
  // 未マッチのプレイヤーを取得
  const unpaired = players.find(p => !hasOpponentInRound(p, round));
  if (!unpaired) {
    // プレイヤー全員が対戦相手のマッチ完了
    return true;
  }
  for (const candidate of players) {
    if (candidate.profile.id === unpaired.profile.id
      || hasOpponentInRound(candidate, round)
      || hasAlreadyMatched(unpaired, candidate, round)) {
        continue;
    }
    // プレイヤー自身と、対戦相手の候補で勝ち点を比較する
    const pointDiff = Math.abs(unpaired.points - candidate.points);
    if (pointDiff > 0.5) {
      // 勝ち点の差が0.5を超過したプレイヤー同士の場合はマッチせずに次の対戦相手の候補を探す
      continue;
    }
    // 勝ち点の差が0.5以下のプレイヤー同士の場合は仮マッチ
    unpaired.matches[round - 1].opponentId = candidate.profile.id.toString();
    candidate.matches[round - 1].opponentId = unpaired.profile.id.toString();
    // 再帰処理にて、次のペアを探す
    // この後の処理でマッチできないケース(false)が発生した場合、このペアは適切でないということがわかる
    if (pairPlayersBacktrack(players, round)) {
      return true;
    }
    console.log("[debug] バックトラック発生！！ player:" + candidate.profile.id.toString() + ", candidate:" + unpaired.profile.id.toString());
    // 仮マッチしたペアを削除して、次の対戦相手の候補を探す（バックトラック）
    unpaired.matches[round - 1].opponentId = "";
    candidate.matches[round - 1].opponentId = "";
  }
  return false;
};
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
  for (let i = currentRound - 1; i >= 1; i--) {
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
  playerUtil.updatePlayerPoints(playerUtil.getPlayersByGroupId(playerStore.players, props.groupId), playerUtil.getPlayersByGroupId(playerStore.players, props.groupId)[ownPlayerIndex] ,match, currentRound);
}
</script>
<template>
  <div class="home">
    <v-row class="home-header ma-1">
      <v-col cols="3" class="justify-start">
        <h2 class="headline"><b>対戦表</b></h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="justify-end">
        <v-select
          v-if="playersByGroupId.length > 1"
          class="round-select"
          v-model="state.selectedRound"
          label="設定対象"
          :items="roundOptions"
          item-title=name
          item-value="value" 
          return-object variant="underlined"
        >
        </v-select>
      </v-col>
      <v-col cols="2" class="justify-end">
        <v-btn
          v-if="playersByGroupId.length > 1"
          class="setting-button bg-green-darken-1 text-white text-body-1"
          variant="text"
          @click="setOpponent"
        >
          対戦相手の設定
        </v-btn>
      </v-col>
    </v-row>
    <template v-if="playersByGroupId.length > 1">
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
                <v-tooltip location="top"
                  text="Sum of Opponents Scores（対戦相手の勝ち星の数）">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" opacity="60%" size="x-small" icon="mdi-information-outline" class="information-icon"></v-icon>
                  </template>
                </v-tooltip>
              </sup>
            </th>
            <th rowspan="2">
              SODOS
              <sup>
                <v-tooltip location="top"
                  text="Sum of Defeated Opponents Scores（負かした対戦相手の勝ち星の数）">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" opacity="60%" size="x-small" icon="mdi-information-outline" class="information-icon"></v-icon>
                  </template>
                </v-tooltip>
              </sup>
            </th>
            <th rowspan="2">順位</th>
          </tr>
          <tr>
            <template v-for="round in roundOptions" :key="'result-' + round">
              <th class="home-table-header-match">相手</th>
              <th class="home-table-header-match">結果</th>
            </template>
          </tr>
        </thead>
        <tbody class="home-table-body">
          <tr 
            v-for="(player, index) in playersByGroupId" 
            :key="player.profile.id" 
            :class="[index % 2 === 0 ? 'bg-white' : 'bg-grey-lighten-3']"
          >
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
              <td> {{ player.points }} pt</td>
              <td> {{ player.sos }} pt </td>
              <td> {{ player.sodos }} pt </td>
              <td> {{ player.ranking }} 位 </td>
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
    </template>
    <template v-else>
      <EmptyArea 
        :group-id="props.groupId"
        icon-name="mdi-sword-cross">
      </EmptyArea>
    </template>
  </div>
</template>
<style>
@media print {
  .setting-button,
  .round-select,
  .information-icon,
  .empty-player-button {
    display: none !important;
  }
}
.round-select {
  margin-left: 70px;
  width:90px;
}
.headline {
  padding: .1em .1em .1em .5em;
  border-left: solid .3em #388E3C;
}
.home-header {
  max-height: 60px;
}
.home-table-design {
  /* テーブルのヘッダーを固定にするために、テーブル内のセルの境界を分離 */
  border-collapse: separate!important;
  /* テーブルにおける隣り合うセルの境界同士の間隔 */
  border-spacing: 0;
  /* テーブルの列幅は固定 */
  table-layout: fixed;
  min-width: 1000px;
  text-align: center;
  margin: auto;
  border-right: 1px solid #BDBDBD;
  border-left: 1px solid #BDBDBD;
  border-bottom: 1px solid #BDBDBD;
  box-shadow: 0 0 2px 0 #757575;
  border-radius: 8px;
}
.home-table-header th {
  /* ヘッダーを画面上部の位置で固定 */
  position: sticky!important;
  /* 画面全体のヘッダーの高さに合わせる */
  top: 65px;
  z-index: 1;
  padding: .5em;
  border-top: 2px solid #66BB6A;
  border-bottom: 2px solid #66BB6A;
  color: #FFFFFF;
  background-color: #66BB6A;
}
.home-table-header-match {
  /* 線の重なりを防ぐ */
  border-top: none !important;
   /* 画面全体のヘッダー + テーブルヘッダーの1段目の高さに合わせる */
  top: 108px !important;
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
.home-table-body-matches-opponent {
  width: 45px;
}
.home-table-body-matches-result {
  width: 65px;
}
.result-win {
  background-color: #B9F6CA; /* green-accent-1 */
}
.result-lose {
  background-color: #FFCDD2; /* red-lighten-4 */
}
.result-draw {
  background-color: #FFF9C4; /* yellow-lighten-4 */
}
.home-table-header tr:first-child th:first-child {
  border-top-left-radius: 8px;
}
.home-table-header tr:first-child th:last-child {
  border-top-right-radius: 8px;
}
.home-table-body tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}
.home-table-body tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}
</style>