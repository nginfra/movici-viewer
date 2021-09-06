<template>
  <section>
    <h1 class="title">{{ title | upperFirst }}</h1>
    <!-- Start Scenario general information-->
    <div class="is-flex">
      <MovProjectPicker disabled class="mr-2"></MovProjectPicker>
      <MovScenarioPicker
        v-model="currentScenario"
        :scenarios="scenarios"
        disabled
      ></MovScenarioPicker>
    </div>
    <div v-if="view" class="has-background-white is-fluid">
      <div class="has-padding">
        <RawConfig
          :value="view"
          :label="$t('view.config')"
          @save="validateBeforeSave"
          @error="addErrors"
          @cancel="goBack"
        />
      </div>
    </div>
    <div v-else>
      <p>{{ $t('view.invalid') }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import RawConfig from '@/components/global/RawConfig.vue';
import { successMessage } from '../../snackbar';
import { ShortScenario, View } from '@/types';
import ViewStore from '@/store/modules/ViewStore';
import ScenarioStore from '@/store/modules/ScenarioStore';
import ProjectStore from '@/store/modules/ProjectStore';

@Component({
  name: 'ViewDetail',
  components: {
    RawConfig
  }
})
export default class ViewDetail extends Vue {
  @Prop({ type: String }) readonly uuid!: string;
  view: View | null = null;
  errors: string[] = [];

  get projects() {
    return ProjectStore.projects;
  }

  get activeProject() {
    return ProjectStore.activeProject;
  }

  get scenarios(): ShortScenario[] {
    return ScenarioStore.scenarios;
  }

  get currentScenario(): ShortScenario | null {
    return ScenarioStore.currentScenario;
  }

  get addMode(): boolean {
    return !this.uuid;
  }

  get editMode(): boolean {
    return !!this.uuid;
  }

  get title() {
    return this.addMode ? this.$t('view.addNew') : this.$t('view.edit');
  }

  @Watch('uuid', { immediate: true })
  async initializeThisView(uuid: string) {
    if (this.editMode) {
      this.view = await ViewStore.getView(uuid);
    } else {
      this.view = this.getEmptyView();
    }

    if (!this.scenarios.length && this.activeProject) {
      await ScenarioStore.getScenariosWithSimulationInfo(this.activeProject.uuid);
      const scenario = this.scenarios.find(s => this.view?.scenario_uuid === s.uuid);

      if (scenario) {
        ScenarioStore.setCurrentScenario(scenario);
      }
    }
  }

  getEmptyView(): View {
    return {
      name: '',
      config: {
        version: 1,
        visualizers: []
      }
    };
  }

  async validateBeforeSave(view: View) {
    if (view.uuid) {
      await this.updateView(view, view.uuid);
    } else {
      await this.addView(view);
    }
    this.goBack();
  }

  async updateView(view: View, viewUUID: string) {
    await ViewStore.updateView({ viewUUID, view });
    successMessage('View successfully updated');
  }

  async addView(view: View) {
    if (this.currentScenario) {
      await ViewStore.createView({ scenarioUUID: this.currentScenario.uuid, view });
      successMessage('View successfully added');
    }
  }

  goBack() {
    this.$router.push({ name: 'Views' });
  }

  addErrors(errors: string[]) {
    if (Array.isArray(errors)) {
      this.errors = errors;
    } else if (typeof errors === 'string') {
      this.errors = [errors];
    } else {
      throw new Error('invalid error strings: ' + errors);
    }
  }
}
</script>

<style scoped lang="scss"></style>
