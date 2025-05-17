<script setup lang="ts">
import { ref } from 'vue'
import 'vue-toast-notification/dist/theme-sugar.css';
import { useToast } from 'vue-toast-notification';
import { usePlayerStore } from "@/stores/playerStore";
import { useProfileStore } from "@/stores/profileStore";
import { rankOptions } from '@/constants/rankOptions'
import { Player } from '@/models/player';
import { validatorUtil } from '@/utils/validatorUtil';
import { Profile } from "@/models/profile";
import { constant } from '@/constants/constant';

let $PlayerStore = usePlayerStore();
const $ProfileStore = useProfileStore();
const $toast = useToast();
const dialog = ref(false);

/**
 * プレイヤーの一覧を登録する
 */
const registerPlayers = (): void => {
  let existsDummyPlayer: boolean = false;
  dialog.value = false;
  if (!validatorUtil.validateprofiles($ProfileStore.profiles)) {
    $toast.error("名前と段級位は両方入力するか、両方空にしてください", { position: "top" });
    return;
  } 

  $ProfileStore.profiles.sort((a, b) => a.rank.value - b.rank.value);

  // IDを振り直し、不要なプレイヤーを削除
  $ProfileStore.profiles = $ProfileStore.profiles
    .map((profile, index) => profile.updateProfileId(index + 1))
    .filter(profile => profile.name.trim() !== "" || profile.rank.name.trim() !== "");

  // 奇数ならダミープレイヤーを追加
  if ($ProfileStore.profiles.length % 2 !== 0) {
    $ProfileStore.profiles.push(new Profile($ProfileStore.profiles.length + 1, "", "ダミーユーザー", { name: "20級", value: 20 }));
    existsDummyPlayer = true;
  }
  // プレイヤーの要素数が 32 未満の場合、空のプレイヤーを追加
  while ($ProfileStore.profiles.length < constant.PLAYER_MAX_SIZE) {
    $ProfileStore.profiles.push(new Profile($ProfileStore.profiles.length + 1));
  }
  $PlayerStore.players = $ProfileStore.profiles.map(p => new Player(p.clone()));
  $toast.success("登録に成功しました!" + (existsDummyPlayer ? "<br><br>参加者が奇数のため、ダミーユーザーを追加しています" : ""), { position: "top" });
  
};
</script>

<template>
  <div class="list">
    <v-row class="list-header justify-start ma-1">
      <v-col cols="2">
        <h2>参加者リスト</h2>
      </v-col>
      <v-col cols="2">
        <v-btn class="register-botton bg-light-green-accent-4 text-white text-body-1 ma-1 pa-4" block
          @click="dialog = true">
          参加者の登録
        </v-btn>
      </v-col>
      <v-dialog v-model="dialog" width="auto">
        <v-card width="500">
          <v-card-title class="daialog-title">参加者の登録</v-card-title>
          <v-card-text>
            対戦表の結果がリセットされますが問題ないですか？
          </v-card-text>
          <template v-slot:actions>
            <v-btn text="キャンセル" @click="dialog = false"></v-btn>
            <v-btn text="登録する" @click="registerPlayers()"></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </v-row>
    <table class="list-table-design">
      <thead class="list-table-header">
        <tr>
          <th class="list-table-header-no">No</th>
          <th class="list-table-header-organization">所属</th>
          <th class="list-table-header-name required">名前</th>
          <th class="list-table-header-rank required">段級位</th>
        </tr>
      </thead>
      <tbody class="list-table-body">
        <tr v-for="(player, index) in $ProfileStore.profiles" :key="player.id">
          <td>{{ index + 1 }}</td>
          <td>
            <v-text-field v-model="player.organization" variant="underlined" density="compact" maxlength="30"
              :rules="[validatorUtil.checkOrganizationLength]">
            </v-text-field>
          </td>
          <td>
            <v-text-field v-model="player.name" variant="underlined" density="compact" maxlength="20"
              :rules="[validatorUtil.checkNameLength]">
            </v-text-field>
          </td>
          <td>
            <v-select v-model="player.rank" :items="rankOptions" item-title="name" item-value="rank"
              variant="underlined" return-object density="compact">
            </v-select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
@media print {
  .register-botton {
    display: none !important;
  }
}

.list-table-design {
  /* テーブルのヘッダーを固定にするために、テーブル内のセルの境界を分離 */
  border-collapse: separate;
  /* テーブルにおける隣り合うセルの境界同士の間隔 */
  border-spacing: 0;
  /* テーブルの列幅は固定 */
  table-layout: fixed;
  text-align: center;
  margin: auto;
}

.list-table-header th {
  /* ヘッダーを画面上部の位置で固定 */
  position: sticky;
  top: 0;
  z-index: 1;
  padding: .5em;
  border-top: 2px solid #64dd17;
  border-bottom: 2px solid #64dd17;
  color: #64dd17;
  background-color: #fff;
}

.list-table-body th,
.list-table-body td {
  /* ホワイトスペースを統合するが、行は折り返さない */
  white-space: nowrap;
  padding: .01em .5em;
}

.list-table-header-no {
  width: 10px;
}

.list-table-header-organization {
  width: 400px;
}

.list-table-header-name {
  width: 400px;
}

.list-table-header-rank {
  width: 100px;
}

.daialog-title {
  font-size: 1rem;
  color: #fff;
  background-color: hsla(160, 100%, 37%, 0.8);
}

.required::after {
  content: " *";
  color: #ff4b00;
  vertical-align: middle;
}
</style>
