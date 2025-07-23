<script setup lang="ts">
import { useRoute } from 'vue-router'
import List from '@/components/List.vue'
const route = useRoute();
</script>
<template>
  <v-container class="pa-2">
    <div v-if="route.params.groupId === '1'">
      <List :groupId="1"/>
    </div>
    <div v-else-if="route.params.groupId === '2'">
      <List :groupId="2"/>
    </div>
    <div v-else-if="route.params.groupId === '3'">
      <List :groupId="3"/>
    </div>
    <div v-else-if="route.params.groupId === '4'">
      <List :groupId="4"/>
    </div>
    <div v-else-if="route.params.groupId === '5'">
      <List :groupId="5"/>
    </div>
    <div v-else-if="route.params.groupId === '6'">
      <List :groupId="6"/>
    </div>
    <div v-else-if="route.params.groupId === '7'">
      <List :groupId="7"/>
    </div>
    <div v-else-if="route.params.groupId === '8'">
      <List :groupId="8"/>
    </div>
  </v-container>
</template>
<style>
</style>
