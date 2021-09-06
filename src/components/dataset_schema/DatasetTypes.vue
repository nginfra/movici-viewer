<template>
  <section>
    <h1 class="title">{{ $t('resources.dataset_types') }}</h1>
    <div class="level">
      <div class="level-left">
        <MovActionBar
          :actions="availableActionsForSingleDatasetType"
          :enabled="availableActions(checkedRows)"
          @delete="confirmDelete(checkedRows)"
          @edit="onEdit(checkedRows[0])"
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
        <!-- add row buton -->
        <b-button class="is-primary" @click="startCreatingDatasetType" icon-left="plus">
          {{ $t('dataset_type.addNew') | upperFirst }}
        </b-button>
      </div>
    </div>
    <b-table
      hoverable
      v-if="datasetTypes.length"
      :data="filteredDatasetTypes"
      :checked-rows.sync="checkedRows"
      :is-row-checkable="row => row.uuid"
      checkable
      default-sort="name"
    >
      <b-table-column field="name" :label="$t('properties.name')" sortable v-slot="props">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column
        field="format"
        :label="$t('properties.dataset_format')"
        sortable
        v-slot="props"
      >
        {{ props.row.format }}
      </b-table-column>
      <b-table-column
        custom-key="actions"
        :label="$t('properties.actions')"
        width="150"
        v-slot="props"
      >
        <MovActionBar
          :actions="availableActionsForSingleDatasetType"
          size="is-small"
          @edit="onEdit(props.row)"
          @delete="confirmDelete([props.row])"
        ></MovActionBar>
      </b-table-column>
    </b-table>
    <p v-else>{{ $t('dataset_type.nonAvailable') | upperFirst }}</p>
    <EditModal
      :active="showEditModal"
      @close="showEditModal = false"
      :mode="mode"
      :value="currentDatasetType"
      resource="Dataset Type"
      :fields="fields"
      @input="saveDatasetType($event)"
      @delete="confirmDelete([$event])"
    />
  </section>
</template>
<script lang="ts">
import { DatasetFormat, DatasetType, Field } from '@/types';
import { successMessage } from '@/snackbar';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { handleFailedRequest } from '@/store/requests';
import EditModal from '@/components/dataset_schema/EditModal.vue';
import DatasetSchemaStore from '@/store/modules/DatasetSchemaStore';

function emptyDatasetType(): DatasetType {
  return {
    name: '',
    format: DatasetFormat.ENTITY_BASED
  };
}

@Component({
  name: 'DatasetTypes',
  components: { EditModal }
})
export default class DatasetTypes extends Vue {
  search = '';
  checkedRows: DatasetType[] = [];
  availableActionsForSingleDatasetType = ['delete', 'edit'];
  showEditModal = false;
  currentDatasetType: DatasetType | null = null;
  mode: 'add' | 'edit' = 'add';

  fields: Field<DatasetType>[] = [
    {
      name: this.$t('properties.name') as string,
      boundVariable: 'name',
      type: 'text',
      required: true
    },
    {
      name: this.$t('properties.dataset_format') as string,
      boundVariable: 'format',
      type: 'choice',
      required: true,
      choices: Object.values(DatasetFormat)
    }
  ];

  get datasetTypes() {
    return DatasetSchemaStore.datasetTypes;
  }

  get filteredDatasetTypes() {
    return this.datasetTypes.filter(datasetType => {
      return datasetType.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  async getDatasetTypes() {
    try {
      await DatasetSchemaStore.getDatasetTypes();
    } catch (err) {
      console.error(err);
    }
  }
  mounted() {
    this.getDatasetTypes().then(() => {});
  }

  startCreatingDatasetType() {
    this.mode = 'add';
    this.currentDatasetType = emptyDatasetType();
    this.showEditModal = true;
  }
  onEdit(item: DatasetType) {
    this.mode = 'edit';
    this.currentDatasetType = item;
    this.showEditModal = true;
  }
  async saveDatasetType(item: DatasetType) {
    this.currentDatasetType = item;

    if (this.mode === 'edit') {
      try {
        if (item.uuid) {
          await DatasetSchemaStore.updateDatasetType(item as Required<DatasetType>);
        }
        successMessage('Dataset type successfully updated');
      } catch (err) {
        handleFailedRequest(err);
      }
    } else if (this.mode === 'add') {
      try {
        await DatasetSchemaStore.addDatasetType(item);
        successMessage('Dataset type successfully created');
      } catch (err) {
        handleFailedRequest(err);
      }
    }
    await this.getDatasetTypes();
  }
  confirmDelete(deleteItems: DatasetType[]) {
    let deleteSingle = {
      message: `Are you sure you want to <b>delete</b> Dataset Type "${deleteItems[0].name}"? This action cannot be undone.`,
      title: 'Delete Dataset Type',
      confirmText: 'Delete Dataset Type'
    };
    let deleteMultiple = {
      message:
        'Are you sure you want to <b>delete</b> these Dataset Types? This action cannot be undone.',
      title: 'Delete Dataset Type(s)',
      confirmText: 'Delete Dataset Type(s)'
    };
    let message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;
    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deleteDatasetTypes(deleteItems)
    });
  }
  async deleteDatasetTypes(itemList: DatasetType[]) {
    let deleteRequests: Promise<unknown>[] = [];

    itemList.forEach(element => {
      if (element.uuid) {
        deleteRequests.push(DatasetSchemaStore.deleteDatasetType(element as Required<DatasetType>));
      }
    });

    await Promise.all(deleteRequests);
    await this.getDatasetTypes();
  }
  availableActions(datasetTypes: DatasetType[]) {
    if (!datasetTypes.length) {
      return [];
    }
    if (datasetTypes.length === 1) {
      return this.availableActionsForSingleDatasetType;
    }
    return ['delete'];
  }
  @Watch('datasetTypes')
  resetCheckedRows() {
    this.checkedRows = [];
  }
}
</script>
<style scoped></style>
