<template>
  <RouterView v-if="store.initialized" />
  <o-loading v-else full-page active icon-size="large" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useMainStore } from "./stores/main";
const store = useMainStore();
store.initializeApp();
</script>
