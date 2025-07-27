<script setup lang="ts">
import { reactive, watch } from 'vue'
import { validatorUtil } from '@/utils/validatorUtil';
import { confUtil } from '@/utils/confUtil';
import { ConfInfo } from '@/models/confInfo';
import { groupSizeOptions } from '@/constants/groupSizeOptions';
import { matchSizeOptions } from '@/constants/matchSizeOptions';
import { useTitleInfoStore } from "@/stores/titleInfoStore";
import { useConfInfoStore } from "@/stores/confInfoStore";
const titleInfoStore = useTitleInfoStore();
const confInfoStore = useConfInfoStore();
const state = reactive({
  titleDialog: false,
  logoDialog: false,
  groupDialog: false,
  matchDialog: false,
  inputTitle: titleInfoStore.titleInfo.title,
  inputLogoName: titleInfoStore.titleInfo.logoName,
  inputGroupCount: confUtil.getValue(confInfoStore.confInfo, "group_count"),
  inputMatchCount: confUtil.getValue(confInfoStore.confInfo, "match_count"),
  loading: false,
});
const getImageUrl = (logoName: string) => {
  return new URL(`/src/assets/${logoName}.svg`, import.meta.url).href
}
const setGroupCount = (inputGroupCount: string): void => {
  confInfoStore.confInfo = confInfoStore.confInfo.filter(info => info.key !== "group_count");
  confInfoStore.confInfo.push(new ConfInfo("group_count", inputGroupCount));
}
const setMatchCount = (inputMatchCount: string): void => {
  confInfoStore.confInfo = confInfoStore.confInfo.filter(info => info.key !== "match_count");
  confInfoStore.confInfo.push(new ConfInfo("match_count", inputMatchCount));
}
</script>
<template>
  <div class="configuration">
    <v-row class="configuration-header ma-1">
      <v-col cols="3" class="justify-start">
        <h2 class="headline"><b>設定</b></h2>
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
    <v-row>
      <v-col cols="4">
        <v-card class="conf-card">
          <v-card-title>グループ数</v-card-title>
          <v-card-subtitle>グループ数を設定してください</v-card-subtitle>
          <div class="conf-content d-flex align-center justify-center fill-height">
            <span class="text-h4">{{ confUtil.getValue(confInfoStore.confInfo, "group_count") }}グループ</span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn @click="state.groupDialog = true" class="bg-green-darken-1 text-white">編集</v-btn>
          </v-card-actions>
          <v-dialog v-model="state.groupDialog" width="auto">
            <v-card width="500">
              <v-card-title class="daialog-title">グループ数の設定</v-card-title>
              <v-sheet class="px-3">
                <v-select class="ma-2" v-model="state.inputGroupCount" :items="groupSizeOptions" label="グループ数"></v-select>
              </v-sheet>
              <v-divider></v-divider>
              <template v-slot:actions>
                <v-btn class="bg-grey-lighten-2" text="キャンセル" @click="state.groupDialog = false;"></v-btn>
                <v-btn class="bg-green-darken-1 text-white" text="登録する" @click="state.groupDialog = false; setGroupCount(state.inputGroupCount);"></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="conf-card">
          <v-card-title>対戦数</v-card-title>
          <v-card-subtitle>対戦数を設定してください</v-card-subtitle>
          <div class="conf-content d-flex align-center justify-center fill-height">
            <span class="text-h4">{{ confUtil.getValue(confInfoStore.confInfo, "match_count") }}回戦</span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn @click="state.matchDialog = true" class="bg-green-darken-1 text-white">編集</v-btn>
          </v-card-actions>
          <v-dialog v-model="state.matchDialog" width="auto">
            <v-card width="500">
              <v-card-title class="daialog-title">対戦数の設定</v-card-title>
              <v-sheet class="px-3">
                <v-select class="ma-2" v-model="state.inputMatchCount" :items="matchSizeOptions" label="対戦数"></v-select>
              </v-sheet>
              <v-divider></v-divider>
              <template v-slot:actions>
                <v-btn class="bg-grey-lighten-2" text="キャンセル" @click="state.matchDialog = false;"></v-btn>
                <v-btn class="bg-green-darken-1 text-white" text="登録する" @click="state.matchDialog = false; setMatchCount(state.inputMatchCount);"></v-btn>
              </template>
            </v-card>
          </v-dialog>
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
