<template>
  <FlowMainView :location="location" @update:location="updateRoute" />
</template>
<script setup lang="ts">
import { useMoviciFlow } from "@/composables/useMoviciFlow";
import type { FlowLocation } from "@movici-flow-lib/types";
import FlowMainView from "@movici-flow-lib/views/FlowMainView.vue";
import { useRoute, useRouter } from "vue-router";

useMoviciFlow().setupMoviciFlow();
const route = useRoute();
const router = useRouter();
defineProps<{
  location?: FlowLocation;
}>();

function updateRoute(location: FlowLocation) {
  router.push({
    name: route.name ?? undefined,
    params: {
      step: location.step,
    },
    query: {
      project: location.projectName,
      scenario: location.scenarioName,
      view: location.viewUUID,
    },
  });
}
</script>
