<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from "@/stores/playerStore";

const $PlayerStore = usePlayerStore();

const filteredPlayers = computed(() => {
  const rankingSortedPlayers = $PlayerStore.players.slice();
   rankingSortedPlayers.sort((a, b) => b.rankingScore - a.rankingScore);
  return rankingSortedPlayers;
})

function getResultClass(result) {
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
    <div class="ranking-container">
      <div class="top-ranking">
        <div class="rank" :class="getResultClass(index + 1)" v-for="(player, index) in filteredPlayers.filter((_, i) => i <= 2)" :key="player.id">
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
  </div>
</template>

<style>
.ranking-container {
  display: flex;
  background: #FFF;
  padding: 20px;
}

/* 左側（上位3名） */
.top-ranking {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
}

/* フェードインアニメーション */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 1位、2位、3位のスタイルとアニメーション */
.top-ranking .rank {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28px;
  font-weight: bold;
  padding: 30px;
  border-radius: 10px;
  color: #222;
  opacity: 0;
  /* 最初は非表示 */
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
/* 1位、2位、3位ごとに遅延を加える */
.gold {
  background: linear-gradient(90deg, #ffd700, #ffcc00);
  animation-delay: 0.3s;
  /* 1位は最初に表示 */
}

.silver {
  background: linear-gradient(90deg, #c0c0c0, #dcdcdc);
  animation-delay: 0.6s;
  /* 2位は少し遅れる */
}

.bronze {
  background: linear-gradient(90deg, #cd7f32, #b87333);
  animation-delay: 0.9s;
  /* 3位はさらに遅れる */
}

/* 右側（4位～10位） */
.other-ranking {
  width: 40%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 5px;
}

.other-ranking .rank {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding: 8px;
  background: #FFF;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}
</style>
