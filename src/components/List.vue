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
const props = defineProps<{
  groupId: number,
}>();
let playerStore = usePlayerStore();
const $toast = useToast();
const dialog = ref(false);
const profilesStore = useProfileStore();

/**
 * プレイヤーの一覧を登録する
 */
const registerPlayers = (): void => {
  let existsDummyPlayer: boolean = false;
  dialog.value = false;
  if (!validatorUtil.validateProfiles(getProfilesByGroupId(profilesStore.profiles,props.groupId))) {
    $toast.error("名前と段級位は両方入力するか、両方空にしてください", { position: "top" });
    return;
  } 
  let idIndex = 1;
  // IDを振り直し、対象のグループの不要なプレイヤーを削除
  profilesStore.profiles = profilesStore.profiles
    .sort((a, b) => a.rank.value - b.rank.value)
    .map((profile) => 
      profile.group_id === props.groupId
        ? profile.updateProfileId(idIndex++)
        : profile
    )
    .filter(profile => 
      profile.group_id !== props.groupId 
        || (profile.name.trim() !== "" || profile.rank.name.trim() !== "")
      );
  // 奇数ならダミープレイヤーを追加
  let profilesByGroupIdLength = getProfilesByGroupId(profilesStore.profiles, props.groupId).length;
  if (profilesByGroupIdLength % 2 !== 0) {
    profilesStore.profiles.push(new Profile(props.groupId, ++profilesByGroupIdLength, "", "ダミーユーザー", { name: "20級", value: 20 }));
    existsDummyPlayer = true;
  }
  // プレイヤーの要素数が 32 未満の場合、空のプレイヤーを追加
  while (profilesByGroupIdLength < constant.PLAYER_MAX_SIZE) {
    profilesStore.profiles.push(new Profile(props.groupId, ++profilesByGroupIdLength));
  }
  playerStore.players = profilesStore.profiles
    .map((profile) => {
      if (profile.group_id === props.groupId) {
        return Player.fromProfile(profile.group_id, profile.clone());
      }
      const existing = playerStore.players.find(p =>
        p.profile.group_id === profile.group_id && p.profile.id === profile.id
      );
      return existing ?? Player.fromProfile(profile.group_id, profile.clone())
    });
  $toast.success("登録に成功しました!" + (existsDummyPlayer ? "<br><br>参加者が奇数のため、ダミーユーザーを追加しています" : ""), { position: "top" });
  
};

const getProfilesByGroupId = (profiles: Profile[], groupId: number): Profile[] => {
  return profiles.filter(profile => profile.group_id === groupId);
};
/**
 * csvのダウンロードを実施する
 */
const downloadProfileCsv = (): void => {
  const profiles = getProfilesByGroupId(profilesStore.profiles, props.groupId);
  const csvRows = [
    ["所属", "名前", "段級位"],
    ...profiles.map(p => [p.organization, p.name, p.rank.name])
  ];

  const csvContent = csvRows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `group${props.groupId}_profiles.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
/**
 * csvのアップロードを実施する
 */
const uploadProfileCsv = (): void => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv";

  input.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

      const [, ...dataLines] = lines; // ヘッダー除外
      const newProfiles: Profile[] = [];

      let id = 1;
      for (const line of dataLines) {
        const [organization, name, rankName] = line.split(",");

        // 段級位オブジェクトを rankOptions から探す
        const matchedRank = rankOptions.find(opt => opt.name === rankName?.trim());
        if (!matchedRank) continue;

        const newProfile = new Profile(props.groupId, id++, organization.trim(), name.trim(), matchedRank);
        newProfiles.push(newProfile);
      }

      // Storeに反映
      profilesStore.profiles = [
        ...profilesStore.profiles.filter(p => p.group_id !== props.groupId),
        ...newProfiles
      ];

      $toast.success("CSVの読み込みに成功しました！", { position: "top" });
    };
    reader.readAsText(file);
  };

  input.click();
}
</script>
<template>
  <div class="list">
    <v-row class="list-header ma-1">
      <v-col cols="3" class="justify-start">
        <h2 class="headline"><b>参加者一覧</b></h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="justify-end">
        <v-btn 
          class="download-botton text-white text-body-1" 
          prepend-icon="mdi-tray-arrow-down"
          color="green-darken-1"
          variant="outlined"
          text="ダウンロード" 
          @click="downloadProfileCsv"
        >
        </v-btn>
      </v-col>
      <v-col cols="2" class="justify-end">
        <v-btn 
          class="upload-botton text-white text-body-1" 
          prepend-icon="mdi-tray-arrow-up"
          color="green-darken-1"
          variant="outlined" 
          text="アップロード" 
          @click="uploadProfileCsv"
        >
        </v-btn>
      </v-col>
      <v-col cols="2" class="justify-end">
        <v-btn 
          class="register-botton bg-green-darken-1 text-white text-body-1" 
          variant="text" 
          text="参加者の登録" 
          @click="dialog = true"
        >
        </v-btn>
      </v-col>
      <v-dialog v-model="dialog" width="auto">
        <v-card width="500">
          <v-card-title class="daialog-title">参加者の登録</v-card-title>
          <v-card-text>
            対戦表の結果がリセットされますが問題ないですか？
          </v-card-text>
          <v-divider></v-divider>
          <template v-slot:actions>
            <v-btn 
              class="bg-grey-lighten-2" 
              text="キャンセル" 
              @click="dialog = false"
            >
            </v-btn>
            <v-btn 
              class="bg-green-darken-1 text-white" 
              text="登録する" 
              @click="registerPlayers()"
            >
            </v-btn>
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
        <tr 
          v-for="(profile, index) in getProfilesByGroupId(profilesStore.profiles, props.groupId)" 
          :key="profile.id" 
          :class="[index % 2 === 0 ? 'bg-white' : 'bg-grey-lighten-3']"
        >
          <td>{{ index + 1 }}</td>
          <td>
            <v-text-field v-model="profile.organization" variant="underlined" density="compact" maxlength="30"
              :rules="[validatorUtil.checkOrganizationLength]">
            </v-text-field>
          </td>
          <td>
            <v-text-field v-model="profile.name" variant="underlined" density="compact" maxlength="20"
              :rules="[validatorUtil.checkNameLength]">
            </v-text-field>
          </td>
          <td>
            <v-select v-model="profile.rank" :items="rankOptions" item-title="name" item-value="rank"
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
  .download-botton ,
  .upload-botton ,
  .register-botton {
    display: none !important;
  }
}
.headline {
  padding: .1em .1em .1em .5em;
  border-left: solid .3em #388E3C;
}
.list-header {
  max-height: 60px;
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
  border-right: 1px solid #BDBDBD;
  border-left: 1px solid #BDBDBD;
  border-bottom: 1px solid #BDBDBD;
  box-shadow: 0 0 2px 0 #757575;
  border-radius: 8px;
}
.list-table-header th {
  /* ヘッダーを画面上部の位置で固定 */
  position: sticky;
  /* 画面全体のヘッダーの高さに合わせる */
  top: 65px;
  z-index: 1;
  padding: .5em;
  border-top: 2px solid #66BB6A;
  border-bottom: 2px solid #66BB6A;
  color: #FFFFFF;
  background-color: #66BB6A;
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
  background-color: #43A047;
}
.required::after {
  content: " *必須";
  color: #ff4b00;
  vertical-align: top;
  font-size: x-small;
}
.list-table-header tr:first-child th:first-child {
  border-top-left-radius: 8px;
}
.list-table-header tr:first-child th:last-child {
  border-top-right-radius: 8px;
}
.list-table-body tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}
.list-table-body tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}
</style>
