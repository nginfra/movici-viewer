<template>
  <section>
    <h1 class="title">{{ title | upperFirst }}</h1>
    <!-- Start Scenario general information-->
    <MovProjectPicker :disabled="editMode"></MovProjectPicker>
    <div v-if="scenario" class="has-background-white is-fluid">
      <div class="has-padding">
        <b-tabs v-model="activeTab">
          <b-message
            v-for="(error, index) in errors"
            type="is-danger"
            has-icon
            icon-size="is-small"
            :key="index"
          >
            {{ error }}
          </b-message>
          <b-tab-item disabled :label="$t('scenario.editor')">
            <Configurator :value="scenario" @cancel="goBack" @save="validateBeforeSave" />
          </b-tab-item>
          <b-tab-item :label="$t('scenario.rawConfig')">
            <RawConfig
              :value="scenario"
              :label="$t('scenario.config')"
              @save="validateBeforeSave"
              @error="addErrors"
              @cancel="goBack"
            />
          </b-tab-item>
          <b-tab-item :disabled="!simulation" :label="$t('scenario.overview')">
            <Overview :value="scenario" :simulation="simulation" @cancel="goBack" />
          </b-tab-item>
          <b-tab-item :disabled="!hasTimeline" :label="$t('resources.timeline')">
            <Timeline :value="scenario" @cancel="goBack" />
          </b-tab-item>
          <b-tab-item :disabled="!hasTimeline" :label="$t('resources.analysis')">
            <Analysis :value="scenario" />
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
    <div v-else>
      <p>{{ $t('scenario.invalid') }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import RawConfig from '@/components/global/RawConfig.vue';
import Configurator from './Configurator.vue';
import Overview from './Overview.vue';
import Timeline from './Timeline.vue';
import Analysis from './Analysis.vue';
import { EventBus } from '../../eventbus';
import { successMessage } from '../../snackbar';
import { Scenario, Simulation } from '@/types';
import ScenarioStore from '@/store/modules/ScenarioStore';

const TabIds = ['editor', 'config', 'overview', 'timeline'];

@Component({
  name: 'ScenarioDetail',
  components: {
    Configurator,
    RawConfig,
    Timeline,
    Overview,
    Analysis
  }
})
export default class ScenarioDetail extends Vue {
  @Prop({ type: String }) readonly uuid!: string;
  scenario: Partial<Scenario> | null = null;
  simulation: Simulation | null = null;
  errors: string[] = [];
  activeTab = 1;

  get addMode() {
    return !this.uuid;
  }

  get editMode() {
    return !!this.uuid;
  }

  get title() {
    return this.addMode ? this.$t('scenario.addNew') : this.$t('scenario.edit');
  }

  get hasTimeline() {
    return this.scenario?.has_timeline;
  }

  get activeTabId() {
    return TabIds[this.activeTab];
  }

  @Watch('activeTab')
  afterActiveTab() {
    this.errors = [];
    EventBus.$emit('scenarios-active-tab', this.activeTabId);
  }

  async initializeThisScenario() {
    if (this.editMode) {
      this.scenario = await ScenarioStore.getScenario(this.uuid);
      if (this.scenario && this.scenario.uuid) {
        this.simulation = await ScenarioStore.getSimulation(this.scenario.uuid);
        this.scenario.has_simulation = !!this.simulation;
      }
    } else {
      this.scenario = {
        name: '',
        display_name: '',
        models: []
      };
    }
  }

  async validateBeforeSave(scenario: Scenario) {
    await ScenarioStore.setCurrentScenario(scenario);

    if (this.editMode) {
      await this.updateScenario();
    } else {
      await this.addScenario();
    }
    this.goBack();
  }

  async updateScenario() {
    await ScenarioStore.updateScenario();
    successMessage('Scenario successfully updated');
  }

  async addScenario() {
    await ScenarioStore.addScenario({});
    successMessage('Scenario successfully created');
  }

  goBack() {
    this.$router.push({ name: 'Scenarios' });
  }

  addErrors(errors: string[]) {
    if (Array.isArray(errors)) {
      this.errors = errors;
    } else if (typeof errors === 'string') {
      this.errors = [errors];
    } else {
      console.log('invalid error', errors);
    }
  }

  mounted() {
    this.initializeThisScenario();
  }
}
</script>

<style scoped></style>
