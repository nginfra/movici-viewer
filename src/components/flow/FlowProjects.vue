<template>
  <FlowContainer class="flow-projects">
    <template #leftPanel>
      <ProjectInfoBox @setProject="setProject" class="mb-2" edit />
      <div class="project-info" v-if="currentProject">
        <div class="details is-size-7 mb-3" v-if="details">
          <div class="mb-1" v-for="(prop, key) in details" :key="key">
            <label>{{ $t('flow.projects.details.' + key) }}: </label>
            <span class="value">{{ prop }}</span>
          </div>
        </div>
        <div class="count-details is-size-7 mb-3" v-if="countDetails">
          <div class="mb-1">
            <label>{{ $t('flow.projects.details.dataset_count') }}: </label>
            <router-link
              custom
              v-slot="{ navigate }"
              :to="'/flow/datasets?' + queryString"
              class="value"
            >
              <a @click="navigate" @keypress.enter="navigate" role="link">
                {{ countDetails.dataset_count }}
              </a>
            </router-link>
          </div>
          <div class="mb-1">
            <label>{{ $t('flow.projects.details.scenario_count') }}: </label>
            <router-link
              custom
              v-slot="{ navigate }"
              :to="'/flow/scenario?' + queryString"
              class="value"
            >
              <a @click="navigate" @keypress.enter="navigate" role="link">
                {{ countDetails.scenario_count }}
              </a>
            </router-link>
          </div>
        </div>
        <div class="description is-size-6 mt-5" v-if="currentProject.description">
          {{ currentProject.description }}
        </div>
      </div>
    </template>
    <template #mainView>
      <template v-if="!currentProject">
        <div class="no-resource">
          <b-image :src="require('@/assets/flow/no-project.png')"></b-image>
          <div class="has-text-centered mt-3">
            <h1 class="is-size-4 has-text-weight-bold">{{ $t('flow.mainView.noProjectTitle') }}</h1>
            <h2 class="is-size-6">{{ $t('flow.mainView.noProjectText') }}</h2>
          </div>
        </div>
      </template>
      <template v-else>
        <MapVis :layer-infos="validLayers" :view-state.sync="viewState">
          <template #control-left="{ map, onViewstateChange, basemap, setBasemap }">
            <SearchBar
              :map="map"
              :view-state="viewState"
              @update:view-state="onViewstateChange($event)"
            />
            <NavigationControl :value="viewState" @input="onViewstateChange($event)" />
            <BaseMapControl :value="basemap" @input="setBasemap" />
          </template>
        </MapVis>
      </template>
    </template>
  </FlowContainer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Project, CameraOptions, Nullable, FlowStoreConfig } from '@/types';
import MapVis from '@/components/webviz/MapVis.vue';
import FlowContainer from './FlowContainer.vue';
import FlowStore from '@/store/modules/FlowStore';
import pick from 'lodash/pick';
import defaults from '@/components/webviz/defaults';
import SearchBar from '@/components/webviz/controls/SearchBar.vue';
import NavigationControl from '@/components/webviz/controls/NavigationControl.vue';
import BaseMapControl from '@/components/webviz/controls/BaseMapControl.vue';
import ProjectInfoBox from './info_box/ProjectInfoBox.vue';
import GeneralStore from '@/store/modules/GeneralStore';
import ProjectStore from '@/store/modules/ProjectStore';

@Component({
  components: {
    FlowContainer,
    MapVis,
    ProjectInfoBox,
    SearchBar,
    NavigationControl,
    BaseMapControl
  }
})
export default class FlowProjects extends Vue {
  @Prop([String]) currentProjectName?: string;
  @Prop([String]) currentScenarioName?: string;

  viewState: Nullable<CameraOptions> = defaults.viewState();

  get projects() {
    return FlowStore.projects;
  }

  get currentProject() {
    return FlowStore.project;
  }

  get details() {
    if (this.currentProject) {
      const details = pick(this.currentProject, ['created_on', 'updated_on', 'tags']);
      details.created_on = this.$options.filters?.dateString(details.created_on);
      return details;
    }
    return null;
  }

  get countDetails() {
    if (this.currentProject) {
      return pick(this.currentProject, ['dataset_count', 'scenario_count']);
    }
    return null;
  }

  // Map Vis getters
  get validLayers() {
    return [];
  }

  get queryString() {
    return FlowStore.queryString;
  }

  /**
   * Watcher for current project, receives a project object, sets in the store and updates main Flow component.
   * If necessary, updates the route with its name as the project query parameter
   */
  async setProject(project: Project) {
    await FlowStore.setCurrentFlowProject(project);

    // this replaces the query string with project
    if (this.currentProjectName !== project.name) {
      await this.$router.push({
        name: 'FlowProjects',
        query: { project: project?.name }
      });
      FlowStore.updateView(null);
    }
  }

  async mounted() {
    if (GeneralStore.isLocalhost) {
      await ProjectStore.getAllProjects();

      const project = 'local_project',
        config: FlowStoreConfig = { currentProjectName: project, getProject: true };

      await FlowStore.setupFlowStore({ config });

      await this.$router.push({
        name: 'FlowDatasets',
        query: { project }
      });
    } else {
      const config = { currentProjectName: this.currentProjectName };

      FlowStore.setLoading({ value: true, msg: 'Loading workspaces...' });

      try {
        await FlowStore.setupFlowStore({ config });
        FlowStore.setLoading({ value: false });
      } catch (error) {
        console.error(error);
        FlowStore.setLoading({ value: false });
      }
    }
  }
}
</script>

<style scoped></style>
