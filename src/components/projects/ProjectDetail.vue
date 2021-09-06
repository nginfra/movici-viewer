<template>
  <section v-if="project">
    <h1 class="title">{{ title | upperFirst }}</h1>
    <div v-if="editMode && !project.uuid">
      <p>{{ $t('project.invalid') }}</p>
    </div>
    <div v-else class="has-background-white is-fluid">
      <div class="has-padding">
        <div class="is-flex">
          <b-field class="is-flex-grow-1 mr-2" :label="$t('properties.displayName')" expanded>
            <b-input v-model="project.display_name"></b-input>
          </b-field>
          <b-field class="is-flex-grow-1" :label="$t('properties.internalName')" expanded>
            <b-input v-model="project.name" :disabled="editMode"></b-input>
          </b-field>
        </div>
        <div class="is-pulled-right">
          <b-button class="mr-2" @click="goBack">{{ $t('actions.cancel') }}</b-button>
          <b-button type="is-primary" @click="onSave">{{ $t('actions.save') }}</b-button>
        </div>
        <div class="is-clearfix"></div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import cloneDeep from 'lodash/cloneDeep';
import { UUID, Project } from '@/types';
import ProjectStore from '@/store/modules/ProjectStore';

@Component({
  name: 'ProjectDetail'
})
export default class ProjectDetail extends Vue {
  // "Project" as an UI term was renamed to "Workspace" in the general translation files,
  // for now we will stick with project in the files naming as this might not be the final term
  // eventually we can change all "project" mentions in code to the final term
  @Prop({ type: String }) uuid!: UUID;
  project: Partial<Project> | null = null;

  get addMode() {
    return !this.uuid;
  }

  get editMode() {
    return !!this.uuid;
  }

  get title() {
    return this.addMode ? this.$t('project.addNew') : this.$t('project.edit');
  }

  async onSave() {
    if (this.project) {
      const action = this.addMode ? 'addProject' : 'updateProject';
      await ProjectStore[action](this.project as Project);
      this.goBack();
    }
  }

  getProjectByUUID(uuid: UUID) {
    return ProjectStore.getProjectByUUID(uuid);
  }

  goBack() {
    this.$router.push({ name: 'Projects' });
  }

  mounted() {
    if (this.editMode) {
      this.project = cloneDeep(this.getProjectByUUID(this.uuid)) || null;
    } else {
      this.project = {
        name: '',
        display_name: ''
      };
    }
  }
}
</script>
<style scoped></style>
