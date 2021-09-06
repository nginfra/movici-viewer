<template>
  <div class="has-background-white is-fluid">
    <div class="is-pulled-right">
      <b-button class="mr-2" @click="onCancel">{{ $t('actions.cancel') }}</b-button>
      <b-button type="is-primary" @click="reload">{{ $t('actions.refresh') }}</b-button>
    </div>
    <div class="is-clearfix"></div>

    <div class="is-flex">
      <b-field class="mr-2" :label="$t('properties.status')">
        <b-input :value="status" disabled></b-input>
      </b-field>

      <b-field :label="$t('scenario.liveMode')">
        <b-icon
          :icon="liveMode ? 'check-circle' : 'times-circle'"
          :type="liveMode ? 'is-success' : 'is-danger'"
        />
      </b-field>
    </div>

    <LiveMode v-if="liveMode" :value="value" :simulation="simulation" />
    <ExternalModels v-if="showExternalModels" :models="externalModels" />
    <Logs :simulation="simulation" />

    <hr />
    <div class="is-pulled-right">
      <b-button class="mr-2" @click="onCancel">{{ $t('actions.cancel') }}</b-button>
      <b-button type="is-primary" @click="reload">{{ $t('actions.refresh') }}</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Scenario, Simulation, TimeOrientedSimulationInfo } from '@/types';
import { EventBus } from '../../eventbus';
import LiveMode from './LiveMode.vue';
import ExternalModels from './ExternalModels.vue';
import Logs from './Logs.vue';
import ScenarioStore from '@/store/modules/ScenarioStore';
import { getStatusFromScenarioAndSimulation } from '@/utils';

interface ScenarioWithModels extends Scenario {
  models: {
    type: string;
    name: string;
  }[];
}

const logDefaultMessage = 'No logs available (yet)... Try the refresh button :)';

function externalModelsInScenario(scenario: ScenarioWithModels | null): string[] {
  const models: string[] = [];
  if (!scenario) {
    return models;
  }
  for (let i = 0; i < scenario.models.length; i++) {
    let model = scenario.models[i];
    if (model.type === 'external') {
      models.push(model.name);
    }
  }
  return models;
}

@Component({
  name: 'Overview',
  components: {
    LiveMode,
    ExternalModels,
    Logs
  }
})
export default class Overview extends Vue {
  @Prop([Object]) readonly value!: Scenario;
  @Prop([Object]) readonly simulation!: Simulation;

  minRows = 20;
  logs = logDefaultMessage;
  speed = null;
  oldSpeed = null;

  get status() {
    if (this.simulation) {
      return getStatusFromScenarioAndSimulation(this.value, this.simulation);
    } else {
      return this.value.status || 'unknown';
    }
  }

  get numOfRows() {
    return Math.max(this.minRows, this.logs.split(/\r\n|\r|\n/).length);
  }

  get liveMode() {
    return this.simulation && this.simulation.live_mode;
  }

  get externalModels() {
    return externalModelsInScenario(this.value as ScenarioWithModels);
  }

  get showExternalModels() {
    try {
      return this.simulation.status.toLowerCase() === 'running' && this.externalModels.length;
    } catch (e) {
      if (e instanceof TypeError) {
        return false;
      }
      throw e;
    }
  }

  get scenarioEndTime() {
    try {
      return (this.value.simulation_info as TimeOrientedSimulationInfo).duration;
    } catch (e) {
      if (e instanceof TypeError) {
        return null;
      }
      throw e;
    }
  }

  get currentTime() {
    try {
      return this.simulation.current_time;
    } catch (e) {
      if (e instanceof TypeError) {
        return 0;
      }
      throw e;
    }
  }

  async reload() {
    if (this.simulation) {
      await ScenarioStore.getSimulation(this.value.uuid);
      EventBus.$emit('scenarios-update-overview');
    }
  }

  onCancel() {
    this.$emit('cancel');
  }

  refreshThisTab(tabId: string) {
    if (tabId === 'overview') {
      this.reload();
    }
  }

  mounted() {
    this.logs = logDefaultMessage;
  }

  created() {
    EventBus.$on('scenarios-active-tab', this.refreshThisTab);
  }

  beforeDestroy() {
    EventBus.$off('scenarios-active-tab', this.refreshThisTab);
  }
}
</script>
<style scoped></style>
