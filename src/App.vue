<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, reactive } from 'vue';
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

const profileStore = useProfileStore();
const playerStore = usePlayerStore();
const titleInfoStore = useTitleInfoStore();
const state = reactive({
  isReady: false,
  rail: true,
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
});
</script>

<template>
  <v-app>
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
        <v-list-item prepend-icon="mdi-sword-cross" title="対戦表"  to="/" exact></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="参加者リスト"  to="/list" exact></v-list-item>
        <v-list-item prepend-icon="mdi-trophy" title="ランキング"  to="/ranking" exact></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="設定"  to="/conf" exact></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view v-if="state.isReady"/>
    </v-main>
  </v-app>
</template>

<style scoped>

@media print {
  nav {
    display:none;
  }
}
.logo {
  margin: 0 2rem 0 0;
}

</style>
