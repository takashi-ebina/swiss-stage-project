<script setup lang="ts">
import { reactive } from 'vue'
import { useTitleInfoStore } from "@/stores/titleInfoStore";
import { useProfileStore } from "@/stores/profileStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useToast } from 'vue-toast-notification';
import { Player } from '@/models/player';
import { Profile } from '@/models/profile';
import { constant } from '@/constants/constant';
import type { TitleInfoDto } from '@/types/titleInfoDto';
const state = reactive({
  loading: false,
});
const titleInfoStore = useTitleInfoStore();
const playerStore = usePlayerStore();
const profileStore = useProfileStore();
const $toast = useToast();

const getImageUrl = (logoName: string) => {
  return new URL(`/src/assets/${logoName}.svg`, import.meta.url).href
}
const save = async () : Promise<void> => {
  state.loading = true;
  try {
    await window.electronAPI.delete();
    for (const player of playerStore.players) {
      console.log(player.toProfileDto());
      await window.electronAPI.save(player.profile.group_id, player.toProfileDto(), player.toMatchDtoList());
    }
    const titleInfoDto: TitleInfoDto = {logo_name: titleInfoStore.titleInfo.logoName, title: titleInfoStore.titleInfo.title};
    await window.electronAPI.saveTitleInfo(titleInfoDto);
  } catch (err) {
    console.error('DB error:', err);
    $toast.error("保存に失敗しました", { position: "top" });
    return;
  } finally {
    state.loading = false;
  }
  $toast.success("保存に成功しました!", { position: "top" });
}
const print = (): void => {
  alert("印刷の向きは横向きを推奨します");
  window.print();
}
const reset = (): void => {
  profileStore.profiles = Array.from({ length: constant.GROUP_SIZE }, (_, groupIdx) =>
    Array.from({ length: constant.PLAYER_MAX_SIZE }, () => new Profile(groupIdx + 1))).flat();
  playerStore.players  = Array.from({ length: constant.GROUP_SIZE }, (_, groupIdx) =>
    Array.from({ length: constant.PLAYER_MAX_SIZE }, () => Player.fromGroupId(groupIdx))).flat();
  titleInfoStore.titleInfo.logoName = "igo";
  titleInfoStore.titleInfo.title = "swiss-stage-project";
}
</script>

<template>
  <div class="header-wrapper">
    <header>
      <img alt="logo" class="logo" :src="getImageUrl(titleInfoStore.titleInfo.logoName)" />
      <h1 class="title">
        {{ titleInfoStore.titleInfo.title }}
      </h1>
      <v-tooltip location="top" text="リセット">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-reload" class="reset-button text-white text-body-1" @click="reset();"></v-btn>
        </template>
      </v-tooltip>
      <v-tooltip location="top" text="保存">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-content-save" class="save-button text-white text-body-1" @click="save();"></v-btn>
        </template>
      </v-tooltip>
      <v-tooltip location="top" text="印刷">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-printer-outline" class="print-button text-white text-body-1" @click="print();"></v-btn>
        </template>
      </v-tooltip>
    </header>
    <v-progress-linear
      v-if="state.loading"
      :indeterminate="state.loading"
      color='primary'
      height='10'
    ></v-progress-linear>
  </div>
</template>

<style scoped>
img {
  /* 参考URL：https://angel-rs.github.io/css-color-filter-generator */
  filter: brightness(0) saturate(100%) invert(96%) sepia(8%) saturate(300%) hue-rotate(42deg) brightness(97%) contrast(89%);
}
.header-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
header {
  /* 横並び */
  display: flex;
  flex-direction: row;
  /* 縦・横方向の中央揃え */
  place-items: center;
  width: 100%;
  height: 65px;
  background: linear-gradient(to bottom right, #388E3C, #66BB6A);
}
.title {
  margin-right: auto;
  color: #fff;
  flex: 6;
}
.logo {
  flex: 1;
  width: 60px;
  height: 60px;
}
@media print {
  .print-button, .save-button, .reset-button,
  .title-edit-icon {
    display: none;
  }
}
.logo-daialog,
.title-daialog {
  font-size: 1rem;
  color: #fff;
  background-color: #43A047;
}
.image-container {
  /* 横並び */
  display: flex;
  flex-direction: row;
  /* 均等に配置 */
  justify-content: space-around;
}
.image-container img {
  max-width: 20%;
  height: auto;
}
</style>