<template>
  <div class="flow-wrapper">
    <nav class="top-nav">
      <div class="nav-content">
        <h1 class="nav-title">Movici Viewer</h1>
      </div>
    </nav>
    <div class="main-content">
      <FlowMainView :location="location" @update:location="updateRoute" />
    </div>
  </div>
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

<style scoped>
.flow-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-nav {
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
}

.nav-link {
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
  transition: color 0.2s;
}


.main-content {
  flex: 1;
  overflow: hidden;
}
</style>
