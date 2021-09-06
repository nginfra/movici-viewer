<template>
  <div>
    <template v-if="reduce">
      <div class="has-text-centered">
        <BButton
          @click="showEditModal = !showEditModal"
          type="is-small"
          class="is-primary"
          icon-left="folder"
        />
      </div>
    </template>
    <template v-else>
      <BField>
        {{ $t('resources.project') }}:
        <strong>{{ projectName | truncate({ length: 26 }) }}</strong>
      </BField>
      <BField>
        {{ $t('resources.scenario') }}:
        <strong>{{ currentScenario | truncate({ length: 26 }) }}</strong>
      </BField>
      <div class="buttons is-left">
        <BButton
          @click="showEditModal = !showEditModal"
          type="is-small"
          icon-right="folder"
          class="is-primary"
        >
          {{ $t('webviz.selectProjectScenario') }}
        </BButton>
      </div>
    </template>
    <WebvizSettingsModal
      :value="local"
      @input="$emit('input', $event)"
      :active="showEditModal"
      @close="showEditModal = false"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import WebvizSettingsModal from './WebvizSettingsModal.vue';
import { Project, VisualizationSettings, VisualizationMode } from '@/types';
import cloneDeep from 'lodash/cloneDeep';
import { mapState } from 'vuex';

// false positive with typescript-eslint == 4.14.0
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IProjectState {
  projects: {
    currentProject?: Project;
  };
}
@Component({
  name: 'WebvizSettings',
  components: { WebvizSettingsModal },
  computed: {
    ...mapState({
      projectName: state => {
        return (
          (state as IProjectState).projects.currentProject?.display_name ?? '<no project selected>'
        );
      }
    })
  }
})
export default class WebvizSettings extends Vue {
  @Prop({ type: Boolean, default: false }) readonly reduce?: boolean;
  @Prop([Object]) readonly value?: VisualizationSettings;
  showEditModal = false;
  local: VisualizationSettings | null = null;

  mounted() {
    this.updateLocal();
  }

  get currentScenario(): string {
    const noneSelected = '[' + (this.$t('scenario.noneSelected') as string) + ']';
    if (this.local?.mode !== VisualizationMode.SCENARIO) return noneSelected;

    return this.local?.scenario?.display_name ?? noneSelected;
  }

  @Watch('value')
  updateLocal() {
    if (this.value) {
      this.local = cloneDeep(this.value);
    }
  }
}
</script>

<style scoped></style>
