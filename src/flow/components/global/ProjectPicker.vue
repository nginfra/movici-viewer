<template>
  <b-field
    :label="$t('project.current')"
    :class="size"
    :type="{ 'is-danger': !activeProject }"
    :message="activeProject ? '' : 'Please select a project'"
  >
    <b-select
      :placeholder="$t('project.select')"
      v-model="activeProject"
      :disabled="disabled"
      type="is-danger"
      :size="size"
    >
      <option v-for="project in projects" :value="project" :key="project.uuid">
        {{ project.display_name }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Project } from '@/types';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { projectStore } from '@/store/store-accessor';

// TODO: after making a generic picker, use this as a handler to the store and generic picker as UI
@Component({
  name: 'ProjectPicker'
})
export default class ProjectPicker extends Vue {
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
  @Prop({ type: String, default: '' }) size!: string;
  @Prop({ type: String, default: '' }) uuid!: string;

  get projects(): Project[] {
    return projectStore.projects;
  }

  get activeProject(): Project | null {
    return projectStore.activeProject;
  }

  set activeProject(newValue: Project | null) {
    if (newValue) {
      projectStore.setActiveProjectId(newValue.uuid);
    }
  }

  @Watch('uuid')
  onUUID(uuid: string) {
    const rv = this.projects.find(project => project.uuid === uuid);
    if (rv) this.activeProject = rv;
  }
}
</script>

<style lang="scss" scoped></style>
