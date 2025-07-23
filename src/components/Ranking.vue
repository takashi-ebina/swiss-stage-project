<script setup lang="ts">
import { computed } from 'vue'
import { playerUtil } from "@/utils/playerUtil";
import { util } from "@/utils/util";
import { usePlayerStore } from "@/stores/playerStore";
import EmptyArea from '@/components/EmptyArea.vue'
const props = defineProps<{ groupId: number }>();
const playerStore = usePlayerStore();

const filteredPlayers = computed(() => {
  const rankingSortedPlayers = playerUtil.getPlayersByGroupId(playerStore.players, props.groupId).slice().filter((player) => player.profile.name !== "");
  rankingSortedPlayers.sort((a, b) => b.rankingScore - a.rankingScore);
  return rankingSortedPlayers;
});

function getRankingClass(ranking: number) {
  switch (ranking) {
    case 1: return "gold";
    case 2: return "silver";
    case 3: return "bronze";
    default: return "";
  }
}

function getIconClass(ranking: number) {
  switch (ranking) {
    case 1: return "mdi-crown";
    case 2: return "mdi-medal";
    case 3: return "mdi-trophy";
    default: return "";
  }
}

function getIconColorClass(ranking: number) {
  switch (ranking) {
    case 1: return "yellow-darken-1";
    case 2: return "blue-grey-darken-1";
    case 3: return "deep-orange-darken-4";
    default: return "";
  }
}

function isEmpty(target: string) {
  return util.isNullOrUndefined(target) || target.trim() === "";
}
</script>

<template>
  <div class="ranking">
    <v-row class="ranking-header ma-1">
      <v-col cols="3" class="justify-start">
        <h2 class="headline"><b>ランキング</b></h2>
      </v-col>
    </v-row>

    <template v-if="filteredPlayers.length > 0">
      <div class="top-ranking-row">
        <div v-for="(player, index) in filteredPlayers.filter((_, i) => i <= 2)"
             :key="player.profile.id"
             :class="['top-rank-card', getRankingClass(index + 1)]">
          <div class="top-rank-points-label">{{ player.points }} pt</div>
          <div class="rank-content">
            <div class="rank-position">
              <v-icon class="rank-icon" size="x-large" :color="getIconColorClass(index + 1)">{{ getIconClass(index + 1) }}</v-icon>
              <span>{{ index + 1 }}位</span>
            </div>
            <div class="rank-info">
              <div class="rank-name">{{ player.profile.name }}</div>
              <div class="rank-organization text-grey-darken-2">{{ isEmpty(player.profile.organization) ? "　" : player.profile.organization }}</div>
              <div class="top-rank-stats text-grey-darken-2">
                SOS: {{ player.sos }} | SODOS: {{ player.sodos }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="others-area">
        <div
          v-for="(player, index) in filteredPlayers.filter((_, i) => i > 2)"
          :key="player.profile.id"
          class="other-rank-card bg-white"
        >
          <div class="circle_number bg-grey-lighten-3">{{ index + 4 }}</div>
          <div class="topic-text2">
            <div class="topic-line2">
              <div class="rank-name">{{ player.profile.name }}</div>
            </div>
            <div class="topic-line2">
              <div class="rank-organization text-grey-darken-2">{{ player.profile.organization }}</div>
            </div>
          </div>
          <div class="rank-stats text-grey-darken-2">SOS: {{ player.sos }} | SODOS: {{ player.sodos }}</div>
          <div class="points-label">{{ player.points }} pt</div>
        </div>
      </div>
    </template>
    <template v-else>
      <EmptyArea :group-id="props.groupId" icon-name="mdi-trophy" />
    </template>
  </div>
</template>

<style>
.ranking-header {
  max-height: 60px;
}
.headline {
  padding: .1em .1em .1em .5em;
  border-left: solid .3em #388E3C;
}
.top-ranking-row {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  gap: 10px;
}
.top-rank-card {
  position: relative;
  width: 32%;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  color: #222;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  text-align: left;
  /* 最初は非表示 */
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
}
/* フェードインアニメーション */
@keyframes fadeIn {
  from {
    /* 透明 */
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    /* 不透明 */
    opacity: 1;
    transform: translateY(0);
  }
}
.rank-position {
  font-size: 20px;
  font-weight: bold;
}
.rank-icon {
  vertical-align: -3px;
}
.rank-position > span{
  margin: 10px;
  font-size: 24px;
  font-weight: bold;
}
.rank-info {
  margin-top: 10px;
}
.rank-name {
  font-weight: bold;
  font-size: 24px;
}
.rank-organization {
  font-size: 16px;
  margin-top: 4px;
}
.top-rank-stats {
  margin-top: 10px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
@media print {
  .gold {
    background: linear-gradient(90deg, #fcf3a5, #faee7e);
    background-image: linear-gradient(90deg, #fcf3a5, #faee7e)!important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .silver {
    background-color: linear-gradient(90deg, #e7e7e7, #cacaca);
    background-image: linear-gradient(90deg, #e7e7e7, #cacaca)!important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .bronze {
    background-color: linear-gradient(90deg, #f7bf87, #d39a65);
    background-image: linear-gradient(90deg, #f7bf87, #d39a65)!important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
.gold {
  background: linear-gradient(90deg, #fcf3a5, #faee7e);
  border: 1px solid #FFD600; /* yellow-accent-4 */
  animation-delay: 0.1s!important;
}
.silver {
  background: linear-gradient(90deg, #e7e7e7, #cacaca);
  border: 1px solid #B0BEC5; /* blue-grey-lighten-3 */
  animation-delay: 0.3s!important;
}
.bronze {
  background: linear-gradient(90deg, #f7bf87, #d39a65);
  border: 1px solid #FF8A65; /* deep-orange-darken-2 */
  animation-delay: 0.5s!important;
}
.circle_number {
  width: 40px;
  height: 40px;
  margin: 8px;
  padding-top: 9px;
  border-radius: 50%;
  text-align: center;
  box-sizing: border-box;
  font-weight: bold;
}
.other-rank-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #BDBDBD;
  box-shadow: 0 0 1px 0 #757575;
  margin: 4px;
  padding: 8px;
  /* 最初は非表示 */
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
  animation-delay: 0.7s!important;
}
.topic-text1 {
  height: 100px;
  line-height: 100px;
  width: 15%;
}
.topic-line1 {
  display: flex;
  justify-content: center;
}
.topic-text2 {
  display: flex;
  flex-direction: column;
  /* 左寄せ */
  align-items: flex-start;
  text-align: left;
  width: 70%;
}
.topic-line2 {
  display: flex;
  flex-wrap: wrap;
  /* 左寄せ */
  justify-content: flex-start;
  width: 100%;
}

.rank-content {
  margin-top: 10px;
}

.top-rank-points-label {
  position: absolute;
  top: 30px;
  right: 20px;
  background-color: #81C784; /* 緑系 */
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
}
.rank-stats {
  font-size: 16px;
  margin:0 8px;
}
.points-label {
  background-color: #81C784;
  color: white;
  padding: 4px 12px;
  margin:0 8px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
}
</style>
