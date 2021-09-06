<template>
  <section>
    <h1 class="title">{{ $t('resources.datasets') }}</h1>
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
            >
            </b-input>
          </b-field>
          <!-- end search field -->
          <!-- add row button -->
          <router-link :to="{ name: 'DatasetAdd' }" custom v-slot="{ navigate }">
            <b-button @click="navigate" icon-left="plus" type="is-primary">
              {{ $t('dataset.addNew') | upperFirst }}
            </b-button>
          </router-link>
          <!-- end add row button -->
        </div>
      </div>
      <b-table
        v-if="datasets.length"
        :data="filteredDatasets"
        :checked-rows.sync="checkedRows"
        :is-row-checkable="row => row.uuid"
        checkable
        default-sort="name"
      >
        <b-table-column field="name" :label="$t('properties.name')" sortable v-slot="props">
          <a @click="onEdit(props.row)">
            {{ props.row.name }}
          </a>
        </b-table-column>
        <b-table-column field="type" :label="$t('properties.type')" sortable v-slot="props">
          {{ props.row.type }}
        </b-table-column>
        <b-table-column field="status" :label="$t('properties.status')" width="130" v-slot="props">
          <span class="tag" :class="status(props.row).type">{{ status(props.row).name }}</span>
        </b-table-column>
        <b-table-column
          field="download"
          :label="$t('dataset.initData')"
          centered
          width="100"
          v-slot="props"
        >
          <MovAction
            action="download"
            size="is-small"
            @click="getInitData(props.row)"
            :disabled="!canDownload(props.row)"
          ></MovAction>
        </b-table-column>
        <b-table-column
          custom-key="actions"
          :label="$t('properties.actions')"
          width="100"
          v-slot="props"
        >
          <MovActionBar
            :actions="['edit', 'delete']"
            size="is-small"
            @edit="onEdit(props.row)"
            @delete="onDeleteSingle(props.row)"
          ></MovActionBar>
        </b-table-column>
      </b-table>
      <p v-else>{{ $t('dataset.nonAvailable') | upperFirst }}</p>
    </div>
    <b-loading :is-full-page="false" :active.sync="isDownloading"></b-loading>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Dataset } from '@/types';
import ProjectStore from '@/store/modules/ProjectStore';
import DatasetsStore from '@/store/modules/DatasetsStore';

@Component({ name: 'Datasets' })
export default class Datasets extends Vue {
  search = '';
  datasets: Dataset[] = [];

  checkedRows: Dataset[] = [];
  isDownloading = false;

  get activeProject() {
    return ProjectStore.activeProject;
  }

  get filteredDatasets() {
    return this.datasets.filter((dataset: Dataset) => {
      return dataset.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  @Watch('activeProject', { immediate: true })
  async getDatasets() {
    if (this.activeProject) {
      this.datasets = await DatasetsStore.getDatasets(this.activeProject.uuid);
    }
  }

  getInitData(dataset: Dataset) {
    this.isDownloading = true;
    DatasetsStore.downloadInitData(dataset)
      .catch(err => console.error(err))
      .finally(() => {
        this.isDownloading = false;
      });
  }

  enabledActions() {
    if (!this.checkedRows.length) {
      return [];
    } else {
      return this.checkedRows.length === 1 ? ['edit', 'delete'] : ['delete'];
    }
  }

  onEdit(item: Dataset) {
    this.$router.push({
      name: 'DatasetEdit',
      params: { uuid: item.uuid }
    });
  }

  onDeleteSingle(item: Dataset) {
    this.confirmDelete([item]);
  }

  onDeleteMultiple(items: Dataset[]) {
    this.confirmDelete(items);
  }

  confirmDelete(deleteItems: Dataset[]) {
    let deleteSingle = {
      message:
        'Are you sure you want to <b>delete</b> this dataset and its init data? This action cannot be undone.',
      title: 'Delete dataset',
      confirmText: 'Delete dataset'
    };
    let deleteMultiple = {
      message:
        'Are you sure you want to <b>delete</b> these datasets and their init data? This action cannot be undone.',
      title: 'Delete dataset(s)',
      confirmText: 'Delete dataset(s)'
    };
    let message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;
    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deleteDatasets(deleteItems)
    });
  }

  deleteDatasets(itemList: Dataset[]) {
    const deleteRequests = itemList.map(element => {
      return DatasetsStore.deleteDataset(element);
    });

    Promise.all(deleteRequests).then(() => {
      this.checkedRows = [];
      this.getDatasets();
    });
  }

  status(datasetRow: Dataset) {
    const status = datasetRow.has_data ? 'Done' : 'Empty',
      statusIconMap = {
        Empty: {
          icon: 'exclamation-triangle',
          type: 'is-warning',
          name: 'Empty'
        },
        Done: {
          icon: 'check-circle',
          type: 'is-success',
          name: 'Done'
        }
      },
      statusObj = statusIconMap[status];

    return statusObj;
  }

  canDownload(datasetRow: Dataset) {
    return datasetRow.has_data;
  }
}
</script>
