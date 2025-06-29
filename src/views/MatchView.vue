<script setup lang="ts">
import { reactive } from 'vue'
import Match from '@/components/Match.vue'
const state = reactive({
  tab: 1,
});
</script>
<template>
  <v-container class="pa-2">
    <v-tabs
      v-model="state.tab"
    >
      <v-tab :value=1 slider-color='green-darken-1' color='green-darken-1'>Group 1</v-tab>
      <v-tab :value=2 slider-color='green-darken-1' color='green-darken-1'>Group 2</v-tab>
      <v-tab :value=3 slider-color='green-darken-1' color='green-darken-1'>Group 3</v-tab>
      <v-tab :value=4 slider-color='green-darken-1' color='green-darken-1'>Group 4</v-tab>
    </v-tabs>
    <div v-if="state.tab === 1">
      <Match :groupId="1"/>
    </div>
    <div v-else-if="state.tab === 2">
      <Match :groupId="2"/>
    </div>
    <div v-else-if="state.tab === 3">
      <Match :groupId="3"/>
    </div>
    <div v-else-if="state.tab === 4">
      <Match :groupId="4"/>
    </div>
  </v-container>
</template>
<style>
  .v-tab {
    border-bottom: 1px #BDBDBD solid;
  }
</style>