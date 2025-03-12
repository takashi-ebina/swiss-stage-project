<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
function execPrint() {
  window.print();
}
</script>

<template>
    <header>
        <img alt="logo igo" class="logo-igo" src="@/assets/igo.svg" width="70" height="70" />
        <h1 class="title">{{ props.title }}</h1>
        <v-btn prepend-icon="mdi-printer-outline" class="print-button bg-light-green-accent-4 text-white text-body-1 ma-1" @click="execPrint()"　text="印刷" ></v-btn>
    </header>
</template>

<style scoped>
header {
  display: flex; /* アイテムを行または列に並べるための1次元のレイアウト */
  gap: 1rem;     /* 要素間の間隔を設定 */
  width: 100%;
  height: 70px;
  border-bottom: solid;
  border-bottom-color: #999;
  place-items: center;
}
 
.title {
  margin-right: auto;
  flex: 6;
}

.logo-igo {
  flex: 1;
}

@media print {
  .print-button {
    display:none;
  }
}



</style>