<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue';
import Header from './components/Header.vue'
import { util } from "@/utils/util";
import { playerUtil } from "@/utils/playerUtil";
import type { ProfileDto } from "@/types/profileDto";
import type { MatchDto } from "@/types/matchDto";
import { useProfileStore } from "@/stores/profileStore";
import { usePlayerStore } from "@/stores/playerStore";
import { Profile } from "@/models/profile";
import { Player } from "@/models/player";

const $ProfileStore = useProfileStore();
const $PlayerStore = usePlayerStore();

onMounted(async () => {
  await window.electronAPI.initDb();

  const profileDtoList: ProfileDto[] = await window.electronAPI.findAllProfiles();
  const matchDtoList: MatchDto[] = await window.electronAPI.findAllMatches();

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
    while ($ProfileStore.profiles.length < 16) {
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
});

</script>

<template>
  <Header defaultTitle="swiss-stage-project" defaultLogoName="igo" />
  <div>
    <nav>
      <RouterLink to="/">
        <v-icon class="mr-2">mdi-home</v-icon> Home
      </RouterLink>
      <RouterLink to="/list">
        <v-icon class="mr-2">mdi-format-list-bulleted</v-icon> List
      </RouterLink>
      <RouterLink to="/ranking">
        <v-icon class="mr-2">mdi-trophy</v-icon> Ranking
      </RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<style scoped>

@media print {
  nav {
    display:none;
  }
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.logo {
  margin: 0 2rem 0 0;
}

nav {
  text-align: left;
  margin-left: -1rem;
  font-size: 1rem;
  padding: 1rem 0;
  margin-top: 1rem;
}

</style>
