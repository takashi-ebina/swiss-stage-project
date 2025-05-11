<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { validatorUtil } from '@/utils/validatorUtil';
import { useProfileStore } from "@/stores/profileStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useToast } from 'vue-toast-notification';
import { Player } from '@/models/player';
import { Profile } from '@/models/profile';
import { constant } from '@/constants/constant';
import type { TitleInfoDto } from '@/types/titleInfoDto';
const props = defineProps<{
  defaultTitle: string,
  defaultLogoName: string,
}>();
const state = reactive({
  titleDialog: false,
  logoDialog: false,
  title: props.defaultTitle,
  inputTitle: props.defaultTitle,
  logoName: props.defaultLogoName,
});
const $PlayerStore = usePlayerStore();
const $ProfileStore = useProfileStore();
const $toast = useToast();

const getImageUrl = (logoName: string) => {
  return new URL(`/src/assets/${logoName}.svg`, import.meta.url).href
}
const save = async () : Promise<void> => {
  try {
    await window.electronAPI.delete();
    for (const player of $PlayerStore.players) {
      await window.electronAPI.save(player.toProfileDto(), player.toMatchDtoList());
    }
    const titleInfoDto: TitleInfoDto = {logo_name: state.logoName, title: state.title};
    await window.electronAPI.saveTitleInfo(titleInfoDto);
  } catch (err) {
    console.error('DB error:', err);
    $toast.error("保存に失敗しました", { position: "top" });
    return;
  }
  $toast.success("保存に成功しました!", { position: "top" });
}
const print = (): void => {
  alert("印刷の向きは横向きを推奨します");
  window.print();
}
const reset = (): void => {
  $ProfileStore.profiles = Array.from({ length: constant.PLAYER_MAX_SIZE }, () => new Profile());
  $PlayerStore.players = Array.from({ length: constant.PLAYER_MAX_SIZE }, () => new Player());
  state.logoName = "igo";
  state.title = "swiss-stage-project";
  state.inputTitle = "swiss-stage-project";
}
</script>

<template>
  <header>
    <v-tooltip location="bottom" text="クリックして編集する">
      <template v-slot:activator="{ props }">
        <img v-bind="props" @click="state.logoDialog = true" alt="logo" class="logo" :src="getImageUrl(state.logoName)" />
        <v-dialog v-model="state.logoDialog" width="auto">
          <v-card width="500">
            <v-card-title class="daialog-title">ロゴの選択</v-card-title>
            <v-sheet class="px-3">
              <div class="image-container">
                <img alt="logo" class="pa-3" src="@/assets/igo.svg" @click="state.logoDialog = false; state.logoName='igo'" />
                <img alt="logo" class="pa-3" src="@/assets/shogi.svg" @click="state.logoDialog = false; state.logoName='shogi'" />
                <img alt="logo" class="pa-3" src="@/assets/chess.svg" @click="state.logoDialog = false; state.logoName='chess'" />
              </div>
            </v-sheet>
          </v-card>
        </v-dialog>
      </template>
    </v-tooltip>
    <h1 class="title">
      {{ state.title }}
      <sup @click="state.titleDialog = true">
        <v-tooltip location="top"
          text="クリックして編集する">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" opacity="40%" size="x-small" icon="mdi-pencil-outline" class="title-edit-icon"></v-icon>
          </template>
        </v-tooltip>
      </sup>
    </h1>
    <v-dialog v-model="state.titleDialog" width="auto">
      <v-card width="500">
        <v-card-title class="title-daialog">タイトルの入力</v-card-title>
        <v-sheet class="px-3">
          <v-text-field v-model="state.inputTitle" variant="underlined" density="compact" maxlength="30"
            :rules="[validatorUtil.checkTitleLength]">
          </v-text-field>
        </v-sheet>
        <template v-slot:actions>
          <v-btn text="キャンセル" @click="state.titleDialog = false; state.inputTitle = state.title;"></v-btn>
          <v-btn text="Ok"        @click="state.titleDialog = false; state.title = state.inputTitle;"></v-btn>
        </template>
      </v-card>
    </v-dialog>
    
    <v-btn prepend-icon="mdi-reload" class="reset-button bg-light-green-accent-4 text-white text-body-1 ma-1"
      @click="reset();" text="リセット"></v-btn>
    <v-btn prepend-icon="mdi-content-save" class="save-button bg-light-green-accent-4 text-white text-body-1 ma-1"
      @click="save();" text="保存"></v-btn>
    <v-btn prepend-icon="mdi-printer-outline" class="print-button bg-light-green-accent-4 text-white text-body-1 ma-1"
      @click="print();" text="印刷"></v-btn>
  </header>
</template>

<style scoped>
header {
  /* 横並び */
  display: flex;
  flex-direction: row;
  /* 縦・横方向の中央揃え */
  place-items: center;
  gap: 1rem;
  width: 100%;
  height: 70px;
  border-bottom: solid;
  border-bottom-color: #999;
}

.title {
  margin-right: auto;
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
  background-color: hsla(160, 100%, 37%, 0.8);
}

.image-container {
  /* 横並び */
  display: flex;
  flex-direction: row;
  /* 均等に配置 */
  justify-content: space-around;
}

.image-container img {
  max-width: 30%;
  height: auto;
}
</style>