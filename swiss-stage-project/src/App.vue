<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <Header defaultTitle="swiss-stage-project" defaultLogoName="igo" />
  <div>
    <nav>
      <RouterLink to="/">
        <v-icon class="mr-2">mdi-home</v-icon> Home
      </RouterLink>
      <RouterLink to="/list">
        <v-icon class="mr-2">mdi-format-list-bulleted</v-icon> List
      </RouterLink>
      <RouterLink to="/ranking">
        <v-icon class="mr-2">mdi-trophy</v-icon> Ranking
      </RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<style scoped>

@media print {
  nav {
    display:none;
  }
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.logo {
  margin: 0 2rem 0 0;
}

nav {
  text-align: left;
  margin-left: -1rem;
  font-size: 1rem;
  padding: 1rem 0;
  margin-top: 1rem;
}

</style>
