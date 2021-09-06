<template>
  <section>
    <h1 class="title">{{ $t('resources.dataset_generators') }}</h1>
    <MovProjectPicker />
    <div class="has-background-white has-padding-5">
      <div class="level">
        <div class="level-left">
          <MovActionBar
            :actions="['edit', 'delete']"
            :enabled="enabledActions()"
            size="is-small"
            @edit="onEdit(checkedRows[0])"
            @delete="onDeleteMultiple(checkedRows)"
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
            ></b-input>
          </b-field>
          <!-- end search field -->
          <!-- add row button -->
          <router-link custom :to="{ name: 'DatasetGeneratorAdd' }" v-slot="{ navigate }">
            <b-button type="is-primary" icon-left="plus" @click="navigate">
              {{ $t('dataset_generator.addNew') | upperFirst }}
            </b-button>
          </router-link>
          <!-- end add row button -->
        </div>
      </div>
      <b-table
        v-if="dataset_generators.length"
        :data="filteredDatasetGenerators"
        :checked-rows.sync="checkedRows"
        checkable
        default-sort="name"
      >
        <b-table-column field="name" :label="$t('properties.name')" sortable v-slot="props">
          <router-link
            custom
            v-slot="{ navigate }"
            :to="{ name: 'DatasetGeneratorEdit', params: { uuid: props.row.uuid } }"
          >
            <a @click="navigate">{{ props.row.name }}</a>
          </router-link>
        </b-table-column>
        <b-table-column
          field="created_on"
          :label="$t('dataset_generator.created_on')"
          width="200"
          sortable
          v-slot="props"
          >{{ props.row.created_on.toLocaleString('NL') }}</b-table-column
        >
        <b-table-column
          field="last_modified"
          :label="$t('dataset_generator.last_modified')"
          width="200"
          sortable
          v-slot="props"
        >
          <div v-if="props.row.last_modified">
            {{ props.row.last_modified.toLocaleString('NL') }}
          </div>
        </b-table-column>
        <b-table-column
          field="status"
          :label="$t('dataset_generator.status')"
          width="150"
          sortable
          v-slot="props"
        >
          <span
            class="tag"
            v-if="props.row.last_workload_status"
            :class="statusClass(props.row.last_workload_status)"
          >
            {{ props.row.last_workload_status }}
          </span>
        </b-table-column>
        <b-table-column
          custom-key="actions"
          :label="$t('properties.actions')"
          width="150"
          v-slot="props"
        >
          <MovActionBar
            size="is-small"
            :actions="actionsRow(props.row)"
            :enabled="enabledActionsRow(props.row)"
            @cancel="onCancel(props.row.uuid)"
            @generate="onGenerate(props.row)"
            @edit="onEdit(props.row)"
            @delete="onDeleteSingle(props.row)"
            @logs="onShowLogs(props.row)"
          ></MovActionBar>
        </b-table-column>
      </b-table>
      <p v-else>{{ $t('dataset_generator.nonAvailable') | upperFirst }}</p>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { getClassFromStatus } from '@/utils';
import GenerateDialog from './GenerateDialog.vue';
import DatasetGeneratorsStore from '@/store/modules/DatasetGeneratorsStore';
import ProjectStore from '@/store/modules/ProjectStore';
import { ShortDatasetGenerator } from '@/types';
import { successMessage } from '@/snackbar';

@Component({
  name: 'DatasetGenerator'
})
export default class DatasetGenerator extends Vue {
  @Prop({ type: Number, default: 3000 }) readonly pollingInterval!: number;
  search = '';
  checkedRows = [];
  polling: NodeJS.Timeout | null = null;

  get activeProject() {
    return ProjectStore.activeProject;
  }

  get filteredDatasetGenerators() {
    // Filters dataset generators according to search box
    return this.dataset_generators.filter((dataset_generator: ShortDatasetGenerator) => {
      return dataset_generator.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  get dataset_generators(): ShortDatasetGenerator[] {
    return DatasetGeneratorsStore.datasetGenerators;
  }

  async getDatasetGenerators() {
    await DatasetGeneratorsStore.getDatasetGenerators();
  }

  enabledActions() {
    if (!this.checkedRows.length) {
      return [];
    } else {
      return this.checkedRows.length === 1 ? ['edit', 'delete'] : ['delete'];
    }
  }

  statusClass(type: string) {
    return getClassFromStatus(type);
  }

  onEdit(item: ShortDatasetGenerator) {
    this.$router.push({
      name: 'DatasetGeneratorEdit',
      params: { uuid: item.uuid }
    });
  }

  onDeleteSingle(item: ShortDatasetGenerator) {
    this.confirmDelete([item]);
  }

  onDeleteMultiple(items: ShortDatasetGenerator[]) {
    this.confirmDelete(items);
  }

  confirmDelete(deleteItems: ShortDatasetGenerator[]) {
    // TODO: Move to tranlsation files.
    const deleteSingle = {
        message:
          'Are you sure you want to <b>delete</b> this dataset generator? This action cannot be undone.',
        title: 'Delete dataset generator',
        confirmText: 'Delete dataset generator'
      },
      deleteMultiple = {
        message:
          'Are you sure you want to <b>delete</b> these dataset generators? This action cannot be undone.',
        title: 'Delete dataset generator(s)',
        confirmText: 'Delete dataset generator(s)'
      },
      message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;

    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deleteDatasetGenerators(deleteItems)
    });
  }

  deleteDatasetGenerators(itemList: ShortDatasetGenerator[]) {
    successMessage('Deleting generator(s)...');

    const deleteGeneratorRequests = itemList.map(element => {
      return DatasetGeneratorsStore.deleteDatasetGenerator(element);
    });

    Promise.all(deleteGeneratorRequests).then(() => {
      this.checkedRows = [];
      this.getDatasetGenerators();
    });

    successMessage('Generator(s) deleted.');
  }

  onShowLogs(item: ShortDatasetGenerator) {
    this.$router.push({
      name: 'DatasetGeneratorLogs',
      params: { uuid: item.uuid }
    });
  }

  onCancel(generator_uuid: string) {
    this.$buefy.dialog.confirm({
      message: 'Are you sure you want to cancel?',
      type: 'is-warning',
      hasIcon: true,
      onConfirm: async () => {
        await DatasetGeneratorsStore.cancelGeneration(generator_uuid);
        await this.getDatasetGenerators();
      }
    });
  }

  async onGenerate(shortGenerator: ShortDatasetGenerator) {
    const generator = await DatasetGeneratorsStore.getDatasetGenerator(shortGenerator.uuid);
    if (generator) {
      this.$buefy.modal.open({
        parent: this,
        component: GenerateDialog,
        hasModalCard: true,
        props: { generator_uuid: generator.uuid, dataset_generator: generator }
      });
    }
  }

  actionsRow(generator: ShortDatasetGenerator) {
    const actions = [];
    if (
      generator.last_workload_status === 'Running' ||
      generator.last_workload_status === 'Pending'
    ) {
      actions.push('cancel');
    } else {
      actions.push('generate');
    }

    actions.push('logs', 'edit', 'delete');

    return actions;
  }

  enabledActionsRow(generator: ShortDatasetGenerator) {
    let actions = [];

    if (
      generator.last_workload_status === 'Running' ||
      generator.last_workload_status === 'Pending'
    ) {
      // Only running or pending can be cancelled
      actions.push('cancel');
    } else {
      actions.push('generate');
    }

    if (generator.last_workload_status !== null && generator.last_workload_status !== undefined) {
      // If no last workload status, there is no workload and thus no activity logs
      actions.push('logs');
    }

    actions.push('edit', 'delete');

    return actions;
  }

  pollData() {
    // does it need to call each 3 minutes?
    this.polling = setInterval(() => {
      this.getDatasetGenerators();
    }, this.pollingInterval);
  }

  mounted() {
    if (this.activeProject) {
      this.getDatasetGenerators();
      this.pollData();
    }
  }

  beforeDestroy() {
    if (this.polling) {
      clearInterval(this.polling);
    }
  }

  @Watch('activeProject')
  afterActiveProject() {
    if (this.activeProject) {
      this.getDatasetGenerators();
    }
  }
}
</script>
