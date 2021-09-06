<template>
  <section>
    <h1 class="title">{{ $t('resources.views') }}</h1>
    <div class="is-flex">
      <MovProjectPicker class="mr-2" />
      <MovScenarioPicker v-model="currentScenario" :scenarios="scenarios" />
    </div>
    <div class="has-background-white has-padding-5">
      <div class="level">
        <div class="level-left">
          <!--or to show it conditionally-->
          <MovActionBar
            :actions="['edit', 'delete']"
            :enabled="enabledActions"
            @edit="onEdit(checkedRows[0])"
            @delete="confirmDelete(checkedRows)"
            size="is-small"
          ></MovActionBar>
        </div>
        <div class="level-right">
          <!-- add search field -->
          <b-field class="mr-2 mb-0">
            <b-input
              :placeholder="$t('actions.search') + '...'"
              type="search"
              icon="search"
              v-model="search"
            >
            </b-input>
          </b-field>
          <!-- end search field -->
          <!-- add row button -->
          <router-link custom :to="{ name: 'ViewAdd' }" v-slot="{ navigate }">
            <b-button type="is-primary" @click="navigate" role="link">
              {{ $t('view.addNew') | upperFirst }}
            </b-button>
          </router-link>
          <!-- end add row button -->
        </div>
      </div>
      <b-table
        v-if="views.length"
        :data="filteredViews"
        :checked-rows.sync="checkedRows"
        :is-row-checkable="row => row.uuid"
        checkable
        default-sort="name"
      >
        <b-table-column field="name" :label="$t('properties.displayName')" sortable v-slot="props">
          <a @click="onEdit(props.row)">
            {{ props.row.name }}
          </a>
        </b-table-column>
        <b-table-column
          custom-key="actions"
          :label="$t('properties.actions')"
          width="150"
          v-slot="props"
        >
          <MovActionBar
            size="is-small"
            :actions="['edit', 'duplicate', 'delete']"
            @edit="onEdit(props.row)"
            @duplicate="onDuplicate(props.row)"
            @delete="confirmDelete([props.row])"
          ></MovActionBar>
        </b-table-column>
      </b-table>
      <div v-else>
        <p v-if="currentScenario">{{ $t('view.nonAvailable') | upperFirst }}</p>
        <p v-if="!currentScenario">Please select a scenario...</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Project, View, UUID, ShortScenario } from '@/types';
import { successMessage } from '../../snackbar';
import ViewStore from '@/store/modules/ViewStore';
import cloneDeep from 'lodash/cloneDeep';
import ScenarioStore from '@/store/modules/ScenarioStore';
import ProjectStore from '@/store/modules/ProjectStore';

@Component({
  name: 'Views'
})
export default class Views extends Vue {
  search = '';
  checkedRows: View[] = [];
  views: View[] = [];

  get activeProject(): Project | null {
    return ProjectStore.activeProject;
  }

  get filteredViews() {
    return this.views.filter((view: View) => {
      return view.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  get scenarios(): ShortScenario[] {
    return ScenarioStore.scenarios;
  }

  get currentScenario() {
    return (ScenarioStore.currentScenario as ShortScenario) ?? null;
  }

  set currentScenario(value) {
    ScenarioStore.setCurrentScenario(value);
  }

  get currentScenarioUUID(): UUID | null {
    return this.currentScenario?.uuid ?? null;
  }

  get enabledActions() {
    if (this.checkedRows.length) {
      if (this.checkedRows.length === 1) {
        return ['delete', 'edit'];
      }
      return ['edit'];
    } else {
      return [];
    }
  }

  async onDuplicate(view: View) {
    if (this.currentScenarioUUID) {
      const clonedView = cloneDeep(view);
      delete clonedView.uuid;
      let i = 0,
        name = '';

      do {
        i++;
        name = `${clonedView.name} (${i})`;
      } while (this.views.filter(v => v.name === name).length);

      clonedView.name = name;

      await ViewStore.createView({ scenarioUUID: this.currentScenarioUUID, view: clonedView });
      await this.loadViews();
      successMessage('Views successfully duplicated');
    }
  }

  onEdit(item: Required<View>) {
    this.$router.push({
      name: 'ViewEdit',
      params: { uuid: item.uuid }
    });
  }

  async confirmDelete(deleteItems: View[]) {
    let dialogOptions;

    if (deleteItems.length === 1) {
      dialogOptions = {
        message: `Are you sure you want to <b>delete</b> view "${deleteItems[0].name}"? This action cannot be undone.`,
        title: 'Delete view',
        confirmText: 'Delete view'
      };
    } else {
      dialogOptions = {
        message:
          'Are you sure you want to <b>delete</b> these views? This action cannot be undone.',
        title: 'Delete views',
        confirmText: 'Delete views'
      };
    }

    this.$buefy.dialog.confirm({
      ...dialogOptions,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: async () => await this.deleteViews(deleteItems)
    });
  }

  async deleteViews(itemList: View[]) {
    let deleteRequests: Promise<unknown>[] = [];

    itemList.forEach(element => {
      if (element.uuid) deleteRequests.push(ViewStore.deleteView(element.uuid));
    });

    await Promise.all(deleteRequests);
    await this.loadViews();
    successMessage('Views successfully deleted');
    this.checkedRows = [];
  }

  @Watch('activeProject', { immediate: true })
  async afterActiveProject() {
    this.views = [];
    if (this.activeProject) {
      await ScenarioStore.getScenariosWithSimulationInfo(this.activeProject.uuid);
    }
  }

  @Watch('currentScenarioUUID', { immediate: true })
  async loadViews() {
    if (this.currentScenarioUUID) {
      this.views = await ViewStore.getViews(this.currentScenarioUUID);
    }
  }
}
</script>
