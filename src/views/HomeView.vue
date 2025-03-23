<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePlayerStore } from "@/stores/playerStore";
import { resultOptions } from "@/constants/resultOptions";
import { roundOptions } from "@/constants/roundOptions";
import type { Result } from "@/types/result";
import type { Match } from "@/types/match";
import type { Player } from "@/types/player";
import type { Round } from "@/types/round";

const $PlayerStore = usePlayerStore();
const selectedRound = ref<Round>({ value: 1 });

watch($PlayerStore.players, (newPlayers, oldPlayers) => {
  newPlayers.forEach((player, index) => {
    player.sos = player.matches
      .filter((matche) => matche.opponent !== "" && matche.opponent !== "-99")
      .map((matche) => newPlayers[parseInt(matche.opponent) - 1].points)
      .reduce((sum, points) => sum + points, 0);
    player.sodos = player.matches
      .filter((matche) => matche.opponent !== "" && matche.opponent !== "-99")
      .map((matche) => newPlayers[parseInt(matche.opponent) - 1].sos)
      .reduce((sum, sos) => sum + sos, 0);
    player.rankingScore = (player.points * 1000000) + (player.sos * 1000) + (player.sodos * 2);
    const tmpPlayers = newPlayers.slice();
    tmpPlayers.sort((a, b) => b.rankingScore - a.rankingScore);
    player.ranking = tmpPlayers.findIndex(tmpPlayer => tmpPlayer.rankingScore === player.rankingScore) + 1;
  });
},
  { deep: true }
);

function getResultClass(result: Result) {
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

function execMatch() {
  for (const player of $PlayerStore.players) {
    if (player.name.trim() === "") break;
    if (player.matches[selectedRound.value.value - 1].opponent !== "") continue;
    const points = player.points;
    player.matches[selectedRound.value.value - 1].opponent = "-99";
    const tmpPlayers = selectedRound.value.value % 2 !== 0 ? $PlayerStore.players : [...$PlayerStore.players].reverse();
    for (const opponentPlayer of tmpPlayers) {
      if (player.id === opponentPlayer.id
        || opponentPlayer.name.trim() === ""
        || existsOpponent(opponentPlayer, selectedRound.value.value)
        || isAlreadyMatch(player, opponentPlayer, selectedRound.value.value)) {
        continue;
      }
      const opponentPoints = opponentPlayer.points;
      const tmp = Math.abs(points - opponentPoints);
      if (tmp >= 0 && tmp <= 0.5) {
        player.matches[selectedRound.value.value - 1].opponent = opponentPlayer.id.toString();
        opponentPlayer.matches[selectedRound.value.value - 1].opponent = player.id.toString();
        break;
      }
    }
  }
}


function existsOpponent(opponentPlayer: Player, currentRound: number): boolean {
  return opponentPlayer.matches[currentRound - 1].opponent !== "";
}

function isAlreadyMatch(player: Player, opponentPlayer: Player, currentRound: number): boolean {
  for (let i = currentRound; i >= 1; i--) {
    if (parseInt(player.matches[i - 1].opponent) === opponentPlayer.id) {
      return true;
    }
  }
  return false;
}

function onResultChange(match: Match, round: number, ownPlayerIndex: number) {
  if (match.opponent === "") return;
  const opponentIndex = parseInt(match.opponent) - 1;
  if (match.result?.value === 1) {
    $PlayerStore.players[opponentIndex].matches[round].result = { name: "負", value: 0 };
  } else if (match.result?.value === 0) {
    $PlayerStore.players[opponentIndex].matches[round].result = { name: "勝", value: 1 };
  } else if (match.result?.value === 0.5) {
    $PlayerStore.players[opponentIndex].matches[round].result = { name: "ジゴ", value: 0.5 };
  }
  $PlayerStore.players[opponentIndex].points =
    $PlayerStore.players[opponentIndex].matches
      .filter((matche) => matche.result.name !== "")
      .map((matche) => matche.result.value)
      .reduce((sum, resultValue) => sum + resultValue, 0);
  $PlayerStore.players[ownPlayerIndex].points =
    $PlayerStore.players[ownPlayerIndex].matches
      .filter((matche) => matche.result.name !== "")
      .map((matche) => matche.result.value)
      .reduce((sum, resultValue) => sum + resultValue, 0);
}

</script>

<template>
  <div class="home">
    <v-row class="home-header justify-start ma-1">
      <v-col cols="2">
        <h2>対戦表</h2>
      </v-col>
      <v-col cols="2">
        <v-btn class="setting-botton bg-light-green-accent-4 text-white text-body-1 ma-1 pa-4" block @click="execMatch">
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
          <th rowspan="2">SOS</th>
          <th rowspan="2">SOSOS</th>
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
        <tr v-for="(player, index) in $PlayerStore.players" :key="player.id">
          <td>{{ index + 1 }}</td>
          <td class="home-table-body-name">{{ player.name }}</td>
          <td>{{ player.rank.name }}</td>
          <template v-for="(match, round) in player.matches" :key="'match-' + index">
            <td class="home-table-body-matches-opponent" :class="getResultClass(match.result)">
              <v-text-field v-model="match.opponent" variant="underlined" density="compact"></v-text-field>
            </td>
            <td class="home-table-body-matches-result" :class="getResultClass(match.result)">
              <v-select v-model="match.result" :items="resultOptions" item-title="name" item-value="value"
                variant="underlined" return-object density="compact"
                @update:modelValue="onResultChange(match, round, index)">
              </v-select>
            </td>
          </template>
          <template v-if="player.name !== ''">
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