<template>
  <section>
    <h1 class="title">{{ $t('resources.projects') }}</h1>
    <div class="has-background-white has-padding-5">
      <div class="level">
        <div class="level-left">
          <!-- bulk actions select -->
          <MovActionBar
            :actions="['edit', 'delete']"
            :enabled="enabledActions()"
            @edit="onEdit(checkedRows[0])"
            @delete="confirmDelete(checkedRows)"
            size="is-small"
          ></MovActionBar>
          <!-- end bulk actions select -->
        </div>
        <div class="level-right">
          <b-field class="mr-2 mb-0">
            <b-input
              :placeholder="$t('actions.search') + '...'"
              type="search"
              icon="search"
              v-model="search"
            >
            </b-input>
          </b-field>
          <router-link :to="{ name: 'ProjectAdd' }" custom v-slot="{ navigate }">
            <b-button @click="navigate" icon-left="plus" type="is-primary">
              {{ $t('project.addNew') | upperFirst }}
            </b-button>
          </router-link>
        </div>
      </div>
      <b-table
        v-if="projects.length"
        :data="filteredProjects"
        :checked-rows.sync="checkedRows"
        :is-row-checkable="row => row.uuid"
        checkable
        default-sort="display_name"
      >
        <b-table-column
          field="display_name"
          :label="$t('properties.displayName')"
          sortable
          v-slot="props"
        >
          <a @click="onEdit(props.row)">
            {{ props.row.display_name }}
          </a>
        </b-table-column>
        <b-table-column field="name" :label="$t('properties.internalName')" sortable v-slot="props">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column
          field="scenarios"
          :label="$t('resources.scenarios')"
          centered
          width="100"
          v-slot="props"
        >
          <a @click="activateProjectIdAndGo(props.row.uuid, { name: 'Scenarios' })">
            {{ props.row.scenario_count }}
          </a>
        </b-table-column>
        <b-table-column
          field="datasets"
          :label="$t('resources.datasets')"
          centered
          width="100"
          v-slot="props"
        >
          <a @click="activateProjectIdAndGo(props.row.uuid, { name: 'Datasets' })">
            {{ props.row.dataset_count }}
          </a>
        </b-table-column>
        <b-table-column
          custom-key="actions"
          :label="$t('properties.actions')"
          centered
          width="100"
          v-slot="props"
        >
          <MovActionBar
            :actions="['edit', 'delete']"
            size="is-small"
            @delete="confirmDelete([props.row])"
            @edit="onEdit(props.row)"
          ></MovActionBar>
        </b-table-column>
      </b-table>

      <p v-if="!projects || !projects.length">{{ $t('project.nonAvailable') | upperFirst }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { UUID, Project } from '@/types';
import ProjectStore from '@/store/modules/ProjectStore';

@Component({ name: 'Projects' })
export default class Projects extends Vue {
  checkedRows: Project[] = [];
  projects: Project[] = [];
  search = '';

  get filteredProjects() {
    // Filters dataset generators according to search box
    return this.projects.filter((project: Project) => {
      return project.display_name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  async getAllProjects() {
    this.projects = (await ProjectStore.getAllProjects()) ?? [];
  }

  // Call this before rerouting to datasets or scenario views so that it loads the correct data for that workspace
  async activateProjectIdAndGo(uuid: UUID, route: string) {
    await ProjectStore.setActiveProjectId(uuid);
    this.$router.push(route);
  }

  enabledActions() {
    if (!this.checkedRows.length) {
      return [];
    } else {
      return this.checkedRows.length === 1 ? ['edit', 'delete'] : ['delete'];
    }
  }

  confirmDelete(deleteItems: Project[]) {
    const deleteSingle = {
        message:
          'Are you sure you want to <b>delete</b> this project and all its scenarios and datasets? This action cannot be undone.',
        title: 'Delete project',
        confirmText: 'Delete project'
      },
      deleteMultiple = {
        message:
          'Are you sure you want to <b>delete</b> these projects and all its scenarios and datasets? This action cannot be undone.',
        title: 'Delete project(s)',
        confirmText: 'Delete project(s)'
      },
      message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;

    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deleteProjects(deleteItems)
    });
  }

  deleteProjects(itemList: Project[]) {
    const deleteRequests = itemList.map(element => {
      return ProjectStore.deleteProject(element);
    });

    Promise.all(deleteRequests).then(() => {
      this.checkedRows = [];
      this.getAllProjects();
    });
  }

  onEdit(item: Project) {
    if (item.uuid) {
      this.$router.push({
        name: 'ProjectEdit',
        params: { uuid: item.uuid }
      });
    }
  }

  async mounted() {
    await this.getAllProjects();
  }
}
</script>

<style scoped></style>
