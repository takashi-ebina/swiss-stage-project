<script setup lang="ts">
import { useRoute } from 'vue-router'
import Match from '@/components/Match.vue'
const route = useRoute();
</script>
<template>
  <v-container class="pa-2">
    <div v-if="route.params.groupId === '1'">
      <Match :groupId="1"/>
    </div>
    <div v-else-if="route.params.groupId === '2'">
      <Match :groupId="2"/>
    </div>
    <div v-else-if="route.params.groupId === '3'">
      <Match :groupId="3"/>
    </div>
    <div v-else-if="route.params.groupId === '4'">
      <Match :groupId="4"/>
    </div>
    <div v-else-if="route.params.groupId === '5'">
      <Match :groupId="5"/>
    </div>
    <div v-else-if="route.params.groupId === '6'">
      <Match :groupId="6"/>
    </div>
    <div v-else-if="route.params.groupId === '7'">
      <Match :groupId="7"/>
    </div>
    <div v-else-if="route.params.groupId === '8'">
      <Match :groupId="8"/>
    </div>
  </v-container>
</template>
<style>
</style>