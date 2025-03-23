<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from "@/stores/playerStore";

const $PlayerStore = usePlayerStore();

const filteredPlayers = computed(() => {
  const rankingSortedPlayers = $PlayerStore.players.slice().filter((player) => player.name !== "");
  rankingSortedPlayers.sort((a, b) => b.rankingScore - a.rankingScore);
  return rankingSortedPlayers;
})

function getResultClass(result: number) {
  if (!result) return "";
  switch (result) {
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
</script>
<template>
  <div class="ranking">
    <v-row class="ranking-header justify-start ma-1">
      <v-col cols="2">
        <h2>ランキング</h2>
      </v-col>
    </v-row>

    <template v-if="filteredPlayers.length > 0">
      <div class="ranking-container">
        <div class="top-ranking">
          <div class="rank" :class="getResultClass(index + 1)"
            v-for="(player, index) in filteredPlayers.filter((_, i) => i <= 2)" :key="player.id">
            <span class="rank-number">👑 {{ index + 1 }}位: </span>
            <span class="rank-name">{{ player.name }}</span>
          </div>
        </div>
        <div class="other-ranking">
          <div class="rank" v-for="(player, index) in filteredPlayers.filter((_, i) => i > 2)" :key="player.id">
            <span class="rank-number">{{ index + 4 }}位: </span>
            <span class="rank-name">{{ player.name }}</span>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="d-flex align-center justify-center">
        <v-sheet :elevation="3" :height="300" :width="1000" border rounded
          class="d-flex align-center justify-center text-h3"> 参加者を登録してください</v-sheet>
      </div>
    </template>
  </div>
</template>

<style>
.text-h3 {
  font-family: "游ゴシック", "メイリオ", "MSゴシック" !important;
}

.ranking-container {
  /* 横並び */
  display: flex;
  flex-direction: row;
  background: #FFF;
  padding: 20px;
}

.top-ranking {
  /* 縦並び */
  display: flex;
  flex-direction: column;
  width: 60%;
  gap: 20px;
  padding: 10px;
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
  padding: 30px;
  border-radius: 10px;
  color: #222;
  /* 最初は非表示 */
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
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

.other-ranking {
  /* 縦並び */
  display: flex;
  flex-direction: column;
  width: 40%;
  gap: 5px;
  padding: 10px;
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
</style>
