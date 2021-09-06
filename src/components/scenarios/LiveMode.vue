<template>
  <div>
    <div class="is-divider" :data-content="$t('scenario.liveMode')"></div>
    <SpeedSelector :value="speed" @input="updateSpeed" />
    <b-field grouped group-multiline>
      <p class="control">
        <b-button class="button" icon-left="forward" @click="forwardBy(3600)">1 hour</b-button>
      </p>
      <p class="control">
        <b-button class="button" icon-left="forward" @click="forwardBy(3600 * 24)">1 day</b-button>
      </p>
      <b-field label="Forward to" label-position="on-border">
        <b-input v-model="forwardToValue" type="number" class="short"></b-input>
        <b-select v-model="currentMultiplier">
          <option v-for="(val, name) in multipliers" :value="val" :key="name">
            {{ name }}
          </option>
        </b-select>
        <p class="control">
          <b-button class="button is-primary" @click="forwardTo">Go</b-button>
        </p>
      </b-field>
    </b-field>
    <br />
    <b-field grouped>
      <b-field :label="$t('properties.currentTime')">
        <b-input :value="currentTime" disabled></b-input>
      </b-field>
      <b-field :label="$t('properties.endTime')">
        <b-input :value="scenarioEndTime" disabled></b-input>
      </b-field>
    </b-field>
    <progress class="progress is-primary" :value="currentTime" :max="scenarioEndTime"></progress>
  </div>
</template>

<script lang="ts">
import ScenarioStore from '@/store/modules/ScenarioStore';
import SimulationStore from '@/store/modules/SimulationStore';
import { Scenario, Simulation, SimulationMode } from '@/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EventBus } from '../../eventbus';
import SpeedSelector from './SpeedSelector.vue';

function speedFromModels(models: { type: string; speed: number }[]) {
  for (let i = 0; i < models.length; i++) {
    let model = models[i];
    if (model.type === 'live_mode') {
      return model.speed !== undefined ? model.speed : 1;
    }
  }
  return -1;
}

@Component({
  name: 'LiveMode',
  components: {
    SpeedSelector
  }
})
export default class LiveMode extends Vue {
  @Prop([Object]) readonly value!: Scenario;
  @Prop([Object]) readonly simulation!: Simulation;
  speed: number | null = null;
  oldSpeed: number | null = null;
  multipliers = {
    sec: 1,
    min: 60,
    hours: 60 * 60,
    days: 60 * 80 * 24
  };
  currentMultiplier = 60 * 60;
  forwardToValue = 1;

  get scenarioEndTime() {
    try {
      if (this.value.simulation_info?.mode === SimulationMode.TIME_ORIENTED)
        return this.value.simulation_info.duration;
      return null;
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

  async getSpeed() {
    const data = await SimulationStore.getSpeed(this.value.uuid),
      models = this.value.models as { type: string; speed: number }[];

    this.oldSpeed = this.speed;
    if (data && data.speed) {
      this.speed = data && data.speed;
    } else {
      this.speed = speedFromModels(models);
    }

    return this.getSimulation();
  }

  getSimulation() {
    return ScenarioStore.getSimulation(this.value.uuid);
  }

  async updateSpeed(newSpeed: number) {
    if (this.speed !== null && newSpeed !== this.speed) {
      let oldSpeed = this.speed;
      this.speed = newSpeed;
      if (this.simulation.live_mode) {
        try {
          await SimulationStore.updateSpeed({
            uuid: this.value.uuid,
            speed: newSpeed
          });
          await this.getSpeed();
        } catch {
          this.speed = oldSpeed;
        }
      }
    } else {
      this.speed = newSpeed;
    }
  }

  async forwardBy(seconds: number) {
    await this.getSimulation();
    return await this.forwardToSeconds(this.currentTime + seconds);
  }

  async forwardTo() {
    return await this.forwardToSeconds(this.currentMultiplier * this.forwardToValue);
  }

  async forwardToSeconds(seconds: number) {
    return await SimulationStore.forwardTo({
      uuid: this.value.uuid,
      forward_to: seconds
    });
  }

  created() {
    EventBus.$on('scenarios-update-overview', this.getSpeed);
  }

  beforeDestroy() {
    EventBus.$off('scenarios-update-overview', this.getSpeed);
  }
}
</script>

<style scoped lang="scss">
.short {
  max-width: 100px;

  input {
    @include border-radius;
  }
}
</style>
