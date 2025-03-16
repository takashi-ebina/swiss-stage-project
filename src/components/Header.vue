<script setup lang="ts">
import { ref } from 'vue'
import { rules } from '@/utils/validatorUtil';

const props = defineProps<{
  defaultTitle: string
  defaultLogoName: string
}>();

const titleDialog = ref(false);
const title = ref("");
const inputTitle = ref("");

const logoDialog = ref(false);
const inputLogoName = ref("");

const getImageUrl = (inputLogoName: string) => {
  const logoName = inputLogoName !== "" ? inputLogoName : props.defaultLogoName;
  return new URL(`/src/assets/${logoName}.svg`, import.meta.url).href
}
const execPrint = (): void => {
  window.print();
}
</script>

<template>
  <header>
    <img @click="logoDialog = true" alt="logo" class="logo" :src="getImageUrl(inputLogoName)" />
    <v-dialog v-model="logoDialog" width="auto">
      <v-card width="500">
        <v-card-title class="daialog-title">ロゴの選択</v-card-title>
        <v-sheet class="px-3">
          <div class="image-container">
            <img alt="logo" class="pa-3" src="@/assets/igo.svg" @click="logoDialog = false; inputLogoName='igo'" />
            <img alt="logo" class="pa-3" src="@/assets/shogi.svg" @click="logoDialog = false; inputLogoName='shogi'" />
            <img alt="logo" class="pa-3" src="@/assets/chess.svg" @click="logoDialog = false; inputLogoName='chess'" />
          </div>
        </v-sheet>
      </v-card>
    </v-dialog>
    <h1 @click="titleDialog = true" class="title">{{ title === "" ? props.defaultTitle : title }}</h1>
    <v-dialog v-model="titleDialog" width="auto">
      <v-card width="500">
        <v-card-title class="title-daialog">タイトルの入力</v-card-title>
        <v-sheet class="px-3">
          <v-text-field v-model="inputTitle" variant="underlined" density="compact" maxlength="30"
            :rules="[rules.checkTitleLength]">
          </v-text-field>
        </v-sheet>
        <template v-slot:actions>
          <v-btn text="キャンセル" @click="titleDialog = false; inputTitle = '';"></v-btn>
          <v-btn text="Ok"        @click="titleDialog = false; title = inputTitle;"></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <v-btn prepend-icon="mdi-printer-outline" class="print-button bg-light-green-accent-4 text-white text-body-1 ma-1"
      @click="execPrint();" text="印刷"></v-btn>
  </header>
</template>

<style scoped>
header {
  display: flex; /* アイテムを行または列に並べるための1次元のレイアウト */
  gap: 1rem;     /* 要素間の間隔を設定 */
  width: 100%;
  height: 70px;
  border-bottom: solid;
  border-bottom-color: #999;
  place-items: center;
}

.title {
  margin-right: auto;
  flex: 6;
}

.logo {
  flex: 1;
  width: 70px;
  height: 70px;
}

@media print {
  .print-button {
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
    display: flex;
    justify-content: space-around; /* 子要素を均等に配置します */
    align-items: center; /* 子要素を縦方向の中心に揃えます */
}

.image-container img {
    max-width: 30%; /* 画像の最大幅を設定します */
    height: auto; /* 画像の縦横比を維持します */
}
</style>