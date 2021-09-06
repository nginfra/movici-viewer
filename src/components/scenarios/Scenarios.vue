<template>
  <section>
    <h1 class="title">{{ $t('resources.scenarios') }}</h1>
    <MovProjectPicker></MovProjectPicker>
    <div class="has-background-white has-padding-5">
      <div class="level">
        <div class="level-left">
          <MovActionBar
            :actions="['edit', 'play', 'reset', 'logs', 'delete']"
            :enabled="enabledActions(checkedRows)"
            @delete="confirmDelete(checkedRows)"
            @play="runMultiple(checkedRows)"
            @reset="confirmReset(checkedRows)"
            @edit="onEdit(checkedRows[0])"
            @logs="downloadLogs(checkedRows)"
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
          <router-link :to="{ name: 'ScenarioAdd' }" custom v-slot="{ navigate }">
            <b-button @click="navigate" icon-left="plus" type="is-primary">
              {{ $t('scenario.addNew') | upperFirst }}
            </b-button>
          </router-link>
          <!-- end add row button -->
        </div>
      </div>
      <b-table
        v-if="scenarios.length"
        :data="filteredScenarios"
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
        <b-table-column
          field="status"
          :label="$t('properties.status')"
          sortable
          width="130"
          v-slot="props"
        >
          <span class="tag" :class="statusIconMap[props.row.status].type">{{
            props.row.status
          }}</span>
        </b-table-column>
        <b-table-column
          custom-key="actions"
          :label="$t('properties.actions')"
          width="180"
          v-slot="props"
        >
          <MovActionBar
            :actions="['play', 'reset', 'logs', 'duplicate', 'edit', 'delete']"
            :enabled="enabledActionsForScenario(props.row)"
            size="is-small"
            @edit="onEdit(props.row)"
            @duplicate="onDuplicate(props.row)"
            @delete="confirmDelete([props.row])"
            @play="onRunScenario(props.row)"
            @reset="confirmReset([props.row])"
            @logs="downloadLogs([props.row])"
          ></MovActionBar>
        </b-table-column>
      </b-table>
      <p v-else>{{ $t('scenario.nonAvailable') | upperFirst }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Scenario, Project, ShortScenario } from '@/types';
import { successMessage } from '../../snackbar';
import ScenarioStore from '@/store/modules/ScenarioStore';
import ViewStore from '@/store/modules/ViewStore';
import ProjectStore from '@/store/modules/ProjectStore';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  name: 'Scenarios'
})
export default class Scenarios extends Vue {
  search = '';
  statusIconMap: Record<string, { icon: string; type: string; pack?: string }> = {
    Failed: {
      icon: 'exclamation-circle',
      type: 'is-danger'
    },
    Unknown: {
      icon: 'question-circle',
      type: 'is-warning'
    },
    Invalid: {
      icon: 'cog',
      type: 'is-inactive'
    },
    Ready: {
      icon: 'play-circle',
      type: 'is-primary'
    },
    Pending: {
      icon: 'ellipsis-h',
      type: 'is-primary'
    },
    Running: {
      icon: 'spinner fa-pulse',
      type: 'is-primary'
    },
    Succeeded: {
      icon: 'check-circle',
      type: 'is-success'
    }
  };
  checkedRows: Scenario[] = [];

  get activeProject(): Project | null {
    return ProjectStore.activeProject;
  }

  get scenarios(): ShortScenario[] {
    return ScenarioStore.scenarios ?? [];
  }

  get filteredScenarios() {
    return this.scenarios.filter(scenario => {
      return scenario.display_name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  async onDuplicate(scenario: ShortScenario) {
    if (this.activeProject && scenario.uuid) {
      const clonedScenario = cloneDeep(await ScenarioStore.getScenario(scenario.uuid));

      let i = 0,
        name = '',
        display_name = '';

      do {
        i++;
        name = `${clonedScenario.name}_${i}`;
        display_name = `${clonedScenario.display_name} (${i})`;
      } while ((this.scenarios ?? []).filter(v => v.name === name).length);

      clonedScenario.name = name;
      clonedScenario.display_name = display_name;
      clonedScenario.version = 4;

      await ScenarioStore.addScenario({
        projectUUID: this.activeProject?.uuid,
        scenario: clonedScenario
      });
      await this.getScenarios();
      successMessage('Views successfully duplicated');
    }
  }

  async getScenarios() {
    if (this.activeProject) {
      await ScenarioStore.getScenariosWithSimulationInfo(this.activeProject.uuid);
    }
  }

  onEdit(item: Scenario) {
    this.$router.push({
      name: 'ScenarioEdit',
      params: { uuid: item.uuid }
    });
  }

  onRunScenario(item: Scenario) {
    return ScenarioStore.runScenario(item)
      .then(() => {
        successMessage(`Simulation "${item.display_name}" started`);
      })
      .catch(() => {});
  }

  async runMultiple(itemList: Scenario[]) {
    let resetRequests: Promise<void>[] = [];
    itemList.forEach(element => {
      resetRequests.push(this.onRunScenario(element));
    });

    await Promise.all(resetRequests);
    this.checkedRows = [];
    await this.getScenarios();
  }

  onReset(item: Scenario) {
    return ScenarioStore.clearScenario(item).then(() => {
      successMessage(`Scenario "${item.display_name}" successfully reset`);
    });
  }

  confirmReset(resetItems: Scenario[]) {
    const resetSingle = {
        message: `Are you sure you want to <b>reset</b> scenario "${resetItems[0].display_name}"?`,
        title: 'Reset scenario',
        confirmText: 'Reset scenario'
      },
      resetMultiple = {
        message: 'Are you sure you want to <b>reset</b> these scenarios?',
        title: 'Reset scenario(s)',
        confirmText: 'Reset scenario(s)'
      },
      message = resetItems.length > 1 ? resetMultiple : resetSingle;

    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-warning',
      hasIcon: true,
      onConfirm: () => {
        this.resetMultiple(resetItems).then(() => successMessage('Scenarios successfully reset'));
      }
    });
  }

  async resetMultiple(itemList: Scenario[]) {
    let resetRequests: Promise<void>[] = [];
    itemList.forEach(element => {
      resetRequests.push(this.onReset(element));
    });

    await Promise.all(resetRequests);
    this.checkedRows = [];
    await this.getScenarios();
  }

  async confirmDelete(deleteItems: Scenario[]) {
    let dialogOptions;
    if (deleteItems.length === 1) {
      const views = await ViewStore.getViews(deleteItems[0].uuid),
        message = views?.length
          ? `Are you sure you want to <b>delete</b> scenario "${deleteItems[0].display_name}", its simulation results and <b>${views.length} associated views</b>? This action cannot be undone.`
          : `Are you sure you want to <b>delete</b> scenario "${deleteItems[0].display_name}" and its simulation results? This action cannot be undone.`;

      dialogOptions = {
        message,
        title: 'Delete scenario',
        confirmText: 'Delete scenario'
      };
    } else {
      dialogOptions = {
        message:
          'Are you sure you want to <b>delete</b> these scenarios and all of their simulation results and associated views? This action cannot be undone.',
        title: 'Delete scenario(s)',
        confirmText: 'Delete scenario(s)'
      };
    }

    this.$buefy.dialog.confirm({
      ...dialogOptions,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () =>
        this.deleteScenarios(deleteItems).then(() => {
          successMessage('Scenarios successfully removed');
        })
    });
  }

  async deleteScenarios(itemList: Scenario[]) {
    const deleteRequests = itemList.map(item => {
      return ScenarioStore.deleteScenario(item);
    });

    await Promise.all(deleteRequests);
    this.checkedRows = [];
    await this.getScenarios();
  }

  enabledActions(scenarios: Scenario[]) {
    if (!scenarios.length) {
      return [];
    }
    let commonActions = [];
    let candidates = this.enabledActionsForScenario(scenarios[0]);

    for (let i = candidates.length - 1; i >= 0; i--) {
      for (var j = scenarios.length - 1; j > 0; j--) {
        let actions = this.enabledActionsForScenario(scenarios[j]);

        if (actions.indexOf(candidates[i]) === -1) {
          break;
        }
      }

      if (j === 0) {
        commonActions.push(candidates[i]);
      }
    }
    if (scenarios.length > 1) {
      let editIndex = commonActions.indexOf('edit');
      if (editIndex > -1) {
        commonActions.splice(editIndex, 1);
      }
    }
    return commonActions;
  }

  enabledActionsForScenario(scenario: Scenario) {
    if (!scenario.status) {
      return [];
    }

    const alwaysAvailableActions = ['edit', 'duplicate', 'delete'],
      statusActions: Record<string, string[]> = {
        Unknown: [],
        Invalid: [],
        Canceled: [],
        Ready: ['play'],
        Pending: ['reset'],
        Running: ['reset'],
        Succeeded: ['reset'],
        Failed: ['reset']
      },
      status = scenario.status as keyof typeof statusActions,
      actions = statusActions[status];

    Array.prototype.push.apply(actions, alwaysAvailableActions);

    if (scenario.has_simulation) {
      actions.push('logs');
    }

    return actions;
  }

  downloadLogs(scenarios: Scenario[]) {
    const downloadRequests = scenarios.map(scenario => {
      return ScenarioStore.downloadLogs(scenario).catch(err => console.error(err));
    });

    Promise.all(downloadRequests).then(() => {
      this.checkedRows = [];
    });
  }

  @Watch('activeProject', { immediate: true })
  afterActiveProject() {
    if (this.activeProject) {
      this.getScenarios();
    }
  }
}
</script>
