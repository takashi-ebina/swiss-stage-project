<script setup lang="ts">
import { RouterView, useRouter, useRoute  } from 'vue-router'
import { onMounted, reactive, watch } from 'vue';
import Header from './components/Header.vue'
import { playerUtil } from "@/utils/playerUtil";
import type { ProfileDto } from "@/types/profileDto";
import type { MatchDto } from "@/types/matchDto";
import { useProfileStore } from "@/stores/profileStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useTitleInfoStore } from "@/stores/titleInfoStore";
import { Profile } from "@/models/profile";
import { Player } from "@/models/player";
import { TitleInfo } from "@/models/titleInfo";
import type { TitleInfoDto } from './types/titleInfoDto';
import { constant } from './constants/constant';
const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();
const playerStore = usePlayerStore();
const titleInfoStore = useTitleInfoStore();
const state = reactive({
  isReady: false,
  rail: true,
  tab: 0,
  playerCount: 0,
  allPlayerCount: 0,
  status: ""
});
watch(() => state.tab, (newTab) => {
  // 現在のページパスによって遷移先を分岐
  if (route.path.startsWith('/list')) {
    router.push(`/list/${newTab}`);
  } else if (route.path.startsWith('/ranking')) {
    router.push(`/ranking/${newTab}`);
  } else if (route.path.startsWith('/conf')) {
    router.push(`/conf`);
  } else {
    router.push(`/${newTab}`);
  }
  const playersByGroupId = playerUtil.getNotEmptyPlayers(playerUtil.getPlayersByGroupId(playerStore.players, newTab));
  const players = playerUtil.getNotEmptyPlayers(playerStore.players);
  state.playerCount = playersByGroupId.length;
  state.allPlayerCount = players.length;
  let latestStatus = "未対戦";
  if (playersByGroupId.length > 0) {
    const maxRounds = 5;
    for (let round = 0; round < maxRounds; round++) {
      const allHasOpponent = playersByGroupId.every(p => p.matches[round]?.opponentId !== "");
      const allHasResult = playersByGroupId.every(p => p.matches[round]?.result?.name !== "");
      if (allHasResult) {
        latestStatus = `${round + 1}回戦完了`;
      } else if (allHasOpponent) {
        latestStatus = `${round + 1}回戦実施中`;
        break;
      } else {
        break;
      }
    }
  }
  state.status = latestStatus;
});
onMounted(async () => {
  await window.electronAPI.initDb();
  const profileDtoList: ProfileDto[] = await window.electronAPI.findAllProfiles();
  const matchDtoList: MatchDto[] = await window.electronAPI.findAllMatches();
  const titleInfoDtoList: TitleInfoDto[] = await window.electronAPI.findOneTitleInfo();
  console.log('profileDtoList:',profileDtoList);
  console.log('matchDtoList:',matchDtoList);
  console.log('titleInfoDtoList:',titleInfoDtoList);

  // DBに保存されているデータは初期表示時に画面に表示させる
  if (profileDtoList?.length >= 1) {
    // 参加者リストのデータが保存されている場合
    const savedProfiles: Profile[] = profileDtoList
      .map((profileDto) => Profile.fromDto(profileDto))
      .filter(profile => profile.name.trim() !== "" || profile.rank.name.trim() !== "");

    profileStore.profiles = savedProfiles;
    if (matchDtoList?.length >= 1) {
      // 対戦結果のデータが保存されている場合、対戦結果のデータを参加者ごとにグルーピングする
      const matchDtoListGroupedById: Record<string, MatchDto[]> = {};
        for (const match of matchDtoList) {
          if (!matchDtoListGroupedById[playerUtil.getMatchKey(match)]) {
            matchDtoListGroupedById[playerUtil.getMatchKey(match)] = [];
          }
          matchDtoListGroupedById[playerUtil.getMatchKey(match)].push(match);
        }
        const savedPlayers: Player[] = profileDtoList
          .map((profileDto) => Player.fromDtos(profileDto, matchDtoListGroupedById[playerUtil.getProfileKey(profileDto)]))
          .filter(player => player.profile.name.trim() !== "" || player.profile.rank.name.trim() !== "");
        playerStore.players = savedPlayers;
    } else {
      // 対戦結果のデータが保存されていない場合、参加者のデータだけ設定する
      savedProfiles.forEach((profile, index) => {
        playerStore.players[index].profile = profile;
      });
    }

    for (let groupIdx:number = 1; groupIdx <= constant.GROUP_SIZE; groupIdx++) {
      const existing = profileStore.profiles.filter(p => p.group_id === groupIdx);
      const missingCount = constant.PLAYER_MAX_SIZE - existing.length;
      for (let i = 1; i <= missingCount; i++) {
        const tmpProfile = new Profile(groupIdx, existing.length + i);
        profileStore.profiles.push(tmpProfile);
        playerStore.players.push(Player.fromGroupId(groupIdx));
      }
    }
    playerStore.players.forEach((player) => {
      player.matches.forEach((match, matchIndex) => {
        playerUtil.updatePlayerPoints(playerStore.players, player, match, matchIndex);
      });
    });
    for (let groupIdx:number = 1; groupIdx <= constant.GROUP_SIZE; groupIdx++) {
      playerUtil.updatePlayerMatchScore(playerStore.players, groupIdx);
    }
  }

  if (titleInfoDtoList?.length >= 1) {
    titleInfoStore.titleInfo = new TitleInfo(titleInfoDtoList[0].logo_name, titleInfoDtoList[0].title);
  } else {
    titleInfoStore.titleInfo = new TitleInfo("igo", "swiss-stage-project");
  }

  state.isReady = true;
  state.tab = 1;
  router.push(`/${state.tab}`);
});
</script>

<template>
  <v-app  class="app">
    <v-app-bar flat>
      <Header v-if="state.isReady"/>
    </v-app-bar>
    <v-navigation-drawer
      :rail="state.rail"
      width="180"
      permanent
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-list"
          title="メニュー"
          @click.stop="state.rail = !state.rail"
        >
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-sword-cross" title="対戦表" :to="'/' + state.tab" exact></v-list-item>
        <v-list-item prepend-icon="mdi-trophy" title="ランキング" :to="'/ranking/' + state.tab" exact></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="参加者一覧" :to="'/list/' + state.tab" exact></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="設定" to="/conf" exact></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="main">
      <v-row>
        <v-col cols="7" class="justify-start">
          <v-tabs
            v-if="state.isReady"
            v-model="state.tab"
            class="tabs"
          >
            <v-tab :value=1 slider-color='green-darken-1' color='green-darken-1'>Group 1</v-tab>
            <v-tab :value=2 slider-color='green-darken-1' color='green-darken-1'>Group 2</v-tab>
            <v-tab :value=3 slider-color='green-darken-1' color='green-darken-1'>Group 3</v-tab>
            <v-tab :value=4 slider-color='green-darken-1' color='green-darken-1'>Group 4</v-tab>
            <v-tab :value=5 slider-color='green-darken-1' color='green-darken-1'>Group 5</v-tab>
            <v-tab :value=6 slider-color='green-darken-1' color='green-darken-1'>Group 6</v-tab>
            <v-tab :value=7 slider-color='green-darken-1' color='green-darken-1'>Group 7</v-tab>
            <v-tab :value=8 slider-color='green-darken-1' color='green-darken-1'>Group 8</v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="5" class="justify-start">
          <v-chip v-if="state.isReady" class="ma-2 bg-red-lighten-3 text-white status-chip" variant="flat" label>
            <span class="ml-2"><v-icon class="status-icon" icon="mdi-account-group"/>{{ state.playerCount }}名参加</span>
            <span class="ml-2"><v-icon class="status-icon" icon="mdi-check-circle-outline"/>{{ state.status }} （全体: {{ state.allPlayerCount }}名）</span>
          </v-chip>
        </v-col>
      </v-row>
      <router-view v-if="state.isReady"/>
    </v-main>
  </v-app>
</template>

<style scoped>

@media print {
  nav,
  .status-chip,
  .tabs {
    display:none;
  }
}
.main {
  background-color: #F5F5F5; /* grey-lighten-4 */
}
.status-icon {
  vertical-align: -2px;
  padding-right: 4px;
}
.v-tab {
  border-bottom: 1px #BDBDBD solid;
}
</style>
