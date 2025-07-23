<script setup lang="ts">
import { reactive } from 'vue'
import { validatorUtil } from '@/utils/validatorUtil';
import { useTitleInfoStore } from "@/stores/titleInfoStore";
const titleInfoStore = useTitleInfoStore();
const state = reactive({
  titleDialog: false,
  logoDialog: false,
  inputTitle: titleInfoStore.titleInfo.title,
  loading: false,
});
const getImageUrl = (logoName: string) => {
  return new URL(`/src/assets/${logoName}.svg`, import.meta.url).href
}
</script>
<template>
  <div class="configuration">
    <v-row class="configuration-header ma-1">
      <v-col cols="3" class="justify-start">
        <h2 class="headline"><b>設定</b></h2>
        <!-- タブの表示非表示、タブごとの回戦を指定する-->
      </v-col>
    </v-row>
    <v-banner
      class="my-4"
      bg-color="green-lighten-5"
      color="green-lighten-1"
      icon="mdi-information"
      lines="one"
    >
      <v-banner-text>
        設定の保存はヘッダーの保存ボタンから実行してください。
      </v-banner-text>
    </v-banner>
    <v-row>
      <v-col cols="4">
        <v-card class="conf-card">
          <v-card-title>ロゴ</v-card-title>
          <v-card-subtitle>ヘッダーに表示されるロゴ画像を設定してください</v-card-subtitle>
          <div class="conf-content d-flex align-center justify-center fill-height"> 
            <img alt="logo" class="conf-logo" :src="getImageUrl(titleInfoStore.titleInfo.logoName)"/>
          </div>
          <v-card-actions class="justify-end">
            <v-btn @click="state.logoDialog = true" class="bg-green-darken-1 text-white">編集</v-btn>
          </v-card-actions>
          <v-dialog v-model="state.logoDialog" width="auto">
            <v-card width="650">
              <v-card-title class="daialog-title">ロゴの選択</v-card-title>
              <v-sheet class="px-3">
                <div class="image-container">
                  <img alt="logo" class="conf-logo-list pa-3" src="@/assets/igo.svg" @click="state.logoDialog = false; titleInfoStore.titleInfo.logoName='igo'" />
                  <img alt="logo" class="conf-logo-list pa-3" src="@/assets/shogi.svg" @click="state.logoDialog = false; titleInfoStore.titleInfo.logoName='shogi'" />
                  <img alt="logo" class="conf-logo-list pa-3" src="@/assets/chess.svg" @click="state.logoDialog = false; titleInfoStore.titleInfo.logoName='chess'" />
                  <img alt="logo" class="conf-logo-list pa-3" src="@/assets/trophy.svg" @click="state.logoDialog = false; titleInfoStore.titleInfo.logoName='trophy'" />
                </div>
              </v-sheet>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card class="conf-card">
          <v-card-title>大会タイトル</v-card-title>
          <v-card-subtitle>ヘッダーに表示される大会名を設定してください</v-card-subtitle>
          <div class="conf-content d-flex align-center justify-center fill-height"> 
            <span class="text-h3">{{ titleInfoStore.titleInfo.title }}</span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn @click="state.titleDialog = true" class="bg-green-darken-1 text-white">編集</v-btn>
            <v-dialog v-model="state.titleDialog" width="auto">
              <v-card width="500">
                <v-card-title class="title-daialog">大会タイトルの入力</v-card-title>
                <v-sheet class="px-3">
                  <v-text-field v-model="state.inputTitle" variant="underlined" density="compact" maxlength="30"
                    :rules="[validatorUtil.checkTitleLength]"
                  >
                  </v-text-field>
                </v-sheet>
                <v-divider></v-divider>
                <template v-slot:actions>
                  <v-btn class="grey-lighten-2" text="キャンセル" @click="state.titleDialog = false; state.inputTitle = titleInfoStore.titleInfo.title;"></v-btn>
                  <v-btn class="bg-green-darken-1 text-white" text="登録する" @click="state.titleDialog = false; titleInfoStore.titleInfo.title = state.inputTitle;"></v-btn>
                </template>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<style>
.headline {
  padding: .1em .1em .1em .5em;
  border-left: solid .3em #388E3C;
}
.configuration-header {
  max-height: 60px;
}
.conf-card {
  min-height: 200px;
}
.conf-content {
  min-height: 100px;
}
.conf-logo {
  width: 80px;
  height: 80px;
}
.conf-logo-list:hover {
  cursor:pointer;
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
