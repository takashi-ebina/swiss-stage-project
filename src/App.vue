<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, reactive } from 'vue';
import Header from './components/Header.vue'
import { util } from "@/utils/util";
import { playerUtil } from "@/utils/playerUtil";
import type { ProfileDto } from "@/types/profileDto";
import type { MatchDto } from "@/types/matchDto";
import { useProfileStore } from "@/stores/profileStore";
import { usePlayerStore } from "@/stores/playerStore";
import { Profile } from "@/models/profile";
import { Player } from "@/models/player";
import type { TitleInfoDto } from './types/titleInfoDto';
import { constant } from './constants/constant';

const $ProfileStore = useProfileStore();
const $PlayerStore = usePlayerStore();
const state = reactive({
  defaultTitle: "",
  defaultLogoName: "",
  isReady: false,
  rail: true,
});

onMounted(async () => {
  await window.electronAPI.initDb();

  const profileDtoList: ProfileDto[] = await window.electronAPI.findAllProfiles();
  const matchDtoList: MatchDto[] = await window.electronAPI.findAllMatches();
  const TitleInfoDtoList: TitleInfoDto[] = await window.electronAPI.findOneTitleInfo();

  if (!util.isNullOrUndefined(profileDtoList) && profileDtoList.length >= 1) {
    const savedProfiles: Profile[] = profileDtoList
      .map((profileDto) => Profile.fromDto(profileDto))
      .filter(profile => profile.name.trim() !== "" || profile.rank.name.trim() !== "");
    $ProfileStore.profiles = savedProfiles;
    if (!util.isNullOrUndefined(matchDtoList) && matchDtoList.length >= 1) {
      const matchDtoListGroupedById: Record<number, MatchDto[]> = {};
        for (const match of matchDtoList) {
          if (!matchDtoListGroupedById[match.id]) {
            matchDtoListGroupedById[match.id] = [];
          }
          matchDtoListGroupedById[match.id].push(match);
        }
        const savedPlayers: Player[] = profileDtoList
          .map((profileDto, index) => Player.fromDtos(profileDto, matchDtoListGroupedById[index + 1]))
          .filter(player => player.profile.name.trim() !== "" || player.profile.rank.name.trim() !== "");
        $PlayerStore.players = savedPlayers;
    } else {
      savedProfiles.forEach((profile, index) => {
        $PlayerStore.players[index].profile = profile;
      });
    }
    while ($ProfileStore.profiles.length < constant.PLAYER_MAX_SIZE) {
      const tmpProfile = new Profile($ProfileStore.profiles.length + 1);
      $ProfileStore.profiles.push(tmpProfile);
      $PlayerStore.players.push(new Player(tmpProfile));
    }
    $PlayerStore.players.forEach((player, playerIndex) => {
      player.matches.forEach((match, matchIndex) => {
        playerUtil.updatePlayerPoints($PlayerStore.players, match, matchIndex, playerIndex);
      });
    });
    playerUtil.updatePlayerMatchScore($PlayerStore.players);
  }

  if (!util.isNullOrUndefined(TitleInfoDtoList) && TitleInfoDtoList.length >= 1) {
    state.defaultTitle = TitleInfoDtoList[0].title;
    state.defaultLogoName = TitleInfoDtoList[0].logo_name;
  } else {
    state.defaultTitle = "swiss-stage-project";
    state.defaultLogoName = "igo"; 
  }
  state.isReady = true;
});

</script>

<template>
  <v-app>
    <v-app-bar flat>
      <Header
        v-if="state.isReady"
        :defaultTitle="state.defaultTitle"
        :defaultLogoName="state.defaultLogoName"
      />
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
