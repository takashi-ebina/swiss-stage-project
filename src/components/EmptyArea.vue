<script setup lang="ts">
const props = defineProps<{
  groupId: number,
  iconName: string,
}>();
</script>
<template>
  <div class="empty-player-area">
    <div class="empty-player-icon">
      <v-icon 
        :icon="props.iconName"
        color="grey-darken-2">
      </v-icon>
    </div>
    <div class="empty-player-title text-h4 text-grey-darken-2">
      GROUP{{ groupId }}は未設定です
    </div>
    <div class="empty-player-content text-subtitle-1 text-grey-darken-2">
      参加者一覧から参加者を登録してください
    </div>
    <div class="empty-player-button">
      <v-btn
        class="bg-green-darken-1 text-white text-body-1 justify-center"
        variant="text"
        :to="'/list/' + props.groupId" 
      >
        参加者を登録する  
      </v-btn>
    </div>
  </div>
</template>
<style>
.empty-player-icon,
.empty-player-title,
.empty-player-content,
.empty-player-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
}

.empty-player-icon {
  font-size: 3em;
}
</style>