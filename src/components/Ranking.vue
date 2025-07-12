<script setup lang="ts">
import { computed } from 'vue'
import { playerUtil } from "@/utils/playerUtil";
import { util } from "@/utils/util";
import { usePlayerStore } from "@/stores/playerStore";
const props = defineProps<{
  groupId: number,
}>();
const playerStore = usePlayerStore();
const filteredPlayers = computed(() => {
  const rankingSortedPlayers = playerUtil.getPlayersByGroupId(playerStore.players, props.groupId).slice().filter((player) => player.profile.name !== "");
  rankingSortedPlayers.sort((a, b) => b.rankingScore - a.rankingScore);
  return rankingSortedPlayers;
})

/**
 * 順位に応じたクラス名を返却する
 * @param {number} ranking 勝敗の結果
 * @returns {string} クラス名
 */
function getResultClass(ranking: number) {
  if (!ranking) return "";
  switch (ranking) {
    case 1:
      return "gold";
    case 2:
      return "silver";
    case 3:
      return "bronze";
    default:
      return "";
  }
}

function isEmpty(target: string) {
  return util.isNullOrUndefined(target) || target.trim() === "";
}
</script>
<template>
  <div class="ranking">
    <v-row class="ranking-header ma-1">
      <v-col cols="3" class="justify-start ">
        <h2 class="headline"><b>ランキング</b></h2>
      </v-col>
    </v-row>

    <template v-if="filteredPlayers.length > 0">
      <div class="ranking-container">
        <div class="top-ranking">
          <div class="rank" :class="getResultClass(index + 1)"
            v-for="(player, index) in filteredPlayers.filter((_, i) => i <= 2)" :key="player.profile.id"
          >
            <div class="topic-text1">
              <div class="topic-line1">
                <v-icon size="x-large">mdi-crown</v-icon>
              </div>
              <div class="topic-line1">
                <span class="top-rank-number">{{ index + 1 }} </span>
              </div>
            </div>
            <div class="topic-text2">
              <div class="topic-line2">
                <span class="top-rank-organization">{{ isEmpty(player.profile.organization) ? "　": player.profile.organization }}</span>
              </div>
              <div class="topic-line2">
                <span class="top-rank-name">{{ player.profile.name }}</span>
              </div>
            </div>
            <div class="topic-text3">
              {{ player.points + "pt" }}
            </div>
          </div>
          <div class="rank other" 
            v-for="(player, index) in filteredPlayers.filter((_, i) => i > 2 && i <= 7)" :key="player.profile.id"
          >
            <div class="topic-text1">
              <div class="topic-line1">
                <span class="rank-number">{{ index + 4 }} </span>
              </div>
            </div>
            <div class="topic-text2">
              <div class="topic-line">
                <span class="rank-organization">{{ isEmpty(player.profile.organization) ? "　": player.profile.organization }}</span>
              </div>
              <div class="topic-line">
                <span class="rank-name">{{ player.profile.name }}</span>
              </div>
            </div>
            <div class="topic-text3">
              {{ player.points + "pt" }}
            </div>
          </div>
        </div>
        <div class="other-ranking">
          <div class="rank" v-for="(player, index) in filteredPlayers.filter((_, i) => i > 7)" :key="player.profile.id">
            <div class="other-topic-text1">
              <div class="other-topic-line1">
                <span class="rank-number">{{ index + 9 }} </span>
              </div>
            </div>
            <div class="other-topic-text2">
              <div class="other-topic-line2">
                <span class="rank-organization">{{ isEmpty(player.profile.organization) ? "　": player.profile.organization }}</span>
              </div>
              <div class="other-topic-line2">
                <span class="rank-name">{{ player.profile.name }}</span>
              </div>
            </div>
            <div class="other-topic-text3">
              {{ player.points + "pt" }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <v-banner
      class="my-4"
      bg-color="green-lighten-5"
      color="green-lighten-1"
      icon="mdi-information"
      lines="one"
      >
        <v-banner-text>
          参加者を登録してください。
        </v-banner-text>
      </v-banner>
    </template>
  </div>
</template>

<style>
.text-h3 {
  font-family: "游ゴシック", "メイリオ", "MSゴシック" !important;
}
.headline {
  padding: .1em .1em .1em .5em;
  border-left: solid .3em #388E3C;
}
.ranking-header {
  max-height: 60px;
}
.ranking-container {
  /* 横並び */
  display: flex;
  flex-direction: row;
  background: #FFF;
  padding: 20px;
  min-width: 1000px;
}
.top-ranking {
  /* 縦並び */
  display: flex;
  flex-direction: column;
  width: 65%;
  gap: 20px;
  padding: 10px;
}
.topic-line1 {
  display: flex;
  justify-content: center;
}
.topic-text1 {
  height: 100px;
  line-height: 100px;
  width: 15%;
}
.top-rank-number {
  color:#424242;
  font-weight: bold;
  margin-top: -25px;
}
.topic-text2 {
  display: flex;
  flex-direction: column;
  /* 左寄せ */
  align-items: flex-start;
  text-align: left;
  width: 75%;
}
.topic-line2 {
  display: flex;
  flex-wrap: wrap;
  /* 左寄せ */
  justify-content: flex-start;
  width: 100%;
}
.topic-text3 {
  height: 100px;
  line-height: 100px;
  width: 10%;
}
.top-rank-organization, .top-rank-name {
  color:#424242;
  font-weight: bold;
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
.top-ranking .rank {
  /* 横並び */
  display: flex;
  flex-direction: row;
  /* 両端揃え */
  justify-content: space-between;
  font-size: 28px;
  font-weight: bold;
  padding: 15px;
  border-radius: 10px;
  color: #222;
  /* 最初は非表示 */
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}
@media print {
  .gold {
    background-color: #ffd700 !important;
    background-image: linear-gradient(90deg, #ffd700, #ffcc00) !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .silver {
    background-color: #c0c0c0 !important;
    background-image: linear-gradient(90deg, #c0c0c0, #dcdcdc) !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .bronze {
    background-color: #cd7f32 !important;
    background-image: linear-gradient(90deg, #cd7f32, #b87333) !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
.gold {
  background: linear-gradient(90deg, #ffd700, #ffcc00);
  animation-delay: 0.1s!important;
}
.silver {
  background: linear-gradient(90deg, #c0c0c0, #dcdcdc);
  animation-delay: 0.3s!important;
}
.bronze {
  background: linear-gradient(90deg, #cd7f32, #b87333);
  animation-delay: 0.5s!important;
}
.other {
  animation-delay: 0.7s!important;
}
.other-ranking {
  /* 縦並び */
  display: flex;
  flex-direction: column;
  width: 35%;
  gap: 5px;
  padding: 15px;
}
.other-ranking .rank {
  /* 横並び */
  display: flex;
  flex-direction: row;
  /* 両端揃え */
  justify-content: space-between;
  font-size: 16px;
  padding: 8px;
  background: #FFF;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}
.other-topic-line1 {
  display: flex;
  justify-content: center;
}
.other-topic-text1 {
  height: 50px;
  line-height: 50px;
  width: 15%;
}
.other-topic-text2 {
  display: flex;
  flex-direction: column;
  /* 左寄せ */
  align-items: flex-start;
  text-align: left;
  width: 75%;
}
.other-topic-line2 {
  display: flex;
  flex-wrap: wrap;
  /* 左寄せ */
  justify-content: flex-start;
  width: 100%;
}
.other-topic-text3 {
  height: 50px;
  line-height: 50px;
  width: 10%;
}
</style>
