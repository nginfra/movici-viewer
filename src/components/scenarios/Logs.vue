<template>
  <div>
    <div class="is-divider" :data-content="$t('scenario.logs')"></div>
    <b-field>
      <pre>{{ logs }}</pre>
    </b-field>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Simulation } from '@/types';
import { EventBus } from '../../eventbus';
import ScenarioStore from '@/store/modules/ScenarioStore';

const logDefaultMessage = 'No logs available (yet)... Try the refresh button :)';

@Component({
  name: 'Logs'
})
export default class Logs extends Vue {
  @Prop([Object]) readonly simulation!: Simulation;

  minRows = 20;
  logs = logDefaultMessage;

  get numOfRows() {
    return Math.max(this.minRows, this.logs.split(/\r\n|\r|\n/).length);
  }

  get hasSimulation() {
    return this.simulation !== null;
  }

  async getLogs() {
    if (this.hasSimulation) {
      const logs = await ScenarioStore.getLogs(this.simulation.scenario_uuid);
      if (logs) this.logs = logs;
    }
  }

  mounted() {
    this.logs = logDefaultMessage;
  }

  created() {
    EventBus.$on('scenarios-update-overview', this.getLogs);
  }

  beforeDestroy() {
    EventBus.$off('scenarios-update-overview', this.getLogs);
  }
}
</script>
<style scoped>
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
</style>
