<template>
  <Modal :title="$t('actions.edit')" :active="active" @close="$emit('close')">
    <template v-slot:content>
      <b-field
        :label="$t('project.current')"
        :type="{ 'is-danger': !local }"
        :message="local ? '' : $t('project.select')"
      >
        <b-select :placeholder="$t('project.select')" v-model="project" type="is-danger">
          <option v-for="project in projects" :value="project" :key="project.name">
            {{ project.display_name | truncate({ length: 50 }) }}
          </option>
        </b-select>
      </b-field>
      <b-field grouped>
        <b-field>
          <b-checkbox v-model="useScenario"><strong>Scenario</strong></b-checkbox>
        </b-field>
        <b-field :message="errors['scenario'] || ''" :type="{ 'is-danger': errors['scenario'] }">
          <b-select
            :disabled="!useScenario"
            :placeholder="$t('scenario.select')"
            v-model="scenarioName"
          >
            <option v-for="scenario in scenarios" :value="scenario.name" :key="scenario.name">
              {{ scenario.display_name | truncate({ length: 50 }) }}
            </option>
          </b-select>
        </b-field>
      </b-field>
    </template>
    <template v-slot:footer>
      <button id="save-btn" class="button is-primary" @click="saveAndClose">
        {{ $t('actions.save') }}
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import ModalContent from '../general/ModalContent.vue';
import Modal from '../general/Modal.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapGetters, mapState } from 'vuex';
import { Project, ShortScenario, VisualizationMode, VisualizationSettings } from '@/types';
import defaults from '@/components/webviz/defaults';
import ScenarioStore from '@/store/modules/ScenarioStore';

// false positive with typescript-eslint == 4.14.0
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IState {
  scenarios: {
    scenarios: ShortScenario[];
  };
}
@Component({
  name: 'WebvizSettingsModal',
  components: {
    ModalContent,
    Modal
  },
  computed: {
    ...mapGetters({
      projects: 'projects'
    }),
    ...mapState({ scenarios: state => (state as IState).scenarios.scenarios })
  }
})
export default class WebvizSettingsModal extends Vue {
  @Prop({ type: Boolean, default: false }) readonly active!: boolean;
  @Prop([Object]) value?: VisualizationSettings;
  local: VisualizationSettings = defaults.visualisationSettings();
  scenarios!: ShortScenario[]; // supplied by mapState
  shouldValidate = false;

  get scenarioName(): string | undefined {
    return this.local?.scenario?.name;
  }
  set scenarioName(name: string | undefined) {
    this.local.scenario = name ? this.scenariosByName[name] : null;
  }
  get scenariosByName(): Record<string, ShortScenario> {
    const rv: Record<string, ShortScenario> = {};
    for (const scenario of this.scenarios) {
      rv[scenario.name] = scenario;
    }
    return rv;
  }
  get project(): Project | undefined {
    return this.local.project;
  }
  set project(val: Project | undefined) {
    this.local.project = val || defaults.project();
    if (val) {
      this.$store
        .dispatch('setActiveProjectId', val?.uuid)
        .then(() => {
          this.local.scenario = null;
          return this.getScenarios();
        })
        .then(() => {});
    }
  }
  get useScenario() {
    return this.local.mode === VisualizationMode.SCENARIO;
  }
  set useScenario(val) {
    this.local.mode = val ? VisualizationMode.SCENARIO : VisualizationMode.GEOMETRY;
  }

  get hasErrors() {
    return Object.keys(this.errors).length;
  }

  get errors() {
    if (!this.shouldValidate) return {};
    const errors: Record<string, string> = {};
    if (this.useScenario && !this.local.scenario) {
      errors['scenario'] = 'Please select a scenario';
    }
    return errors;
  }
  saveAndClose() {
    this.shouldValidate = true;
    if (this.hasErrors) return null;

    this.$emit('input', this.local);
    this.$emit('close');
  }

  async mounted() {
    this.updateLocal();
    await this.getScenarios();
  }

  async getScenarios() {
    if (this.project) {
      return await ScenarioStore.getScenariosWithSimulationInfo(this.project.uuid);
    }
  }

  @Watch('value')
  updateLocal() {
    this.local = this.value ? Object.assign({}, this.value) : defaults.visualisationSettings();
  }
}
</script>

<style scoped></style>
