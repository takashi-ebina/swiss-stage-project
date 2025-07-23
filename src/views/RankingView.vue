<script setup lang="ts">
import { useRoute } from 'vue-router'
import Ranking from '@/components/Ranking.vue'
const route = useRoute();
</script>
<template>
  <v-container class="pa-2">
    <div v-if="route.params.groupId === '1'">
      <Ranking :groupId="1"/>
    </div>
    <div v-else-if="route.params.groupId === '2'">
      <Ranking :groupId="2"/>
    </div>
    <div v-else-if="route.params.groupId === '3'">
      <Ranking :groupId="3"/>
    </div>
    <div v-else-if="route.params.groupId === '4'">
      <Ranking :groupId="4"/>
    </div>
    <div v-else-if="route.params.groupId === '5'">
      <Ranking :groupId="5"/>
    </div>
    <div v-else-if="route.params.groupId === '6'">
      <Ranking :groupId="6"/>
    </div>
    <div v-else-if="route.params.groupId === '7'">
      <Ranking :groupId="7"/>
    </div>
    <div v-else-if="route.params.groupId === '8'">
      <Ranking :groupId="8"/>
    </div>
  </v-container>
</template>
<style>
</style>