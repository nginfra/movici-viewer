<template>
  <section>
    <h1 class="title">{{ $t('resources.entity_types') }}</h1>
    <div class="level">
      <div class="level-left">
        <MovActionBar
          :actions="availableActionsForSingleEntityType"
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
        <!-- add row button -->
        <b-button class="is-primary" @click="startCreatingEntityType" icon-left="plus">
          {{ $t('entity_type.addNew') | upperFirst }}
        </b-button>
      </div>
    </div>
    <b-table
      hoverable
      v-if="entityTypes.length"
      :data="filteredEntityTypes"
      :checked-rows.sync="checkedRows"
      :is-row-checkable="row => row.uuid"
      checkable
      default-sort="name"
    >
      <b-table-column field="name" :label="$t('properties.name')" sortable v-slot="props">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column
        custom-key="actions"
        :label="$t('properties.actions')"
        width="150"
        v-slot="props"
      >
        <MovActionBar
          :actions="availableActionsForSingleEntityType"
          size="is-small"
          @edit="onEdit(props.row)"
          @delete="confirmDelete([props.row])"
        ></MovActionBar>
      </b-table-column>
    </b-table>
    <p v-else>{{ $t('entity_type.nonAvailable') | upperFirst }}</p>
    <EditModal
      :active="showEditModal"
      @close="showEditModal = false"
      :mode="mode"
      :value="currentEntityType"
      resource="Entity Type"
      :fields="fields"
      @input="saveEntityType($event)"
      @delete="confirmDelete([$event])"
    />
  </section>
</template>
<script lang="ts">
import { EntityType, Field } from '@/types';
import { successMessage } from '@/snackbar';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { handleFailedRequest } from '@/store/requests';
import EditModal from '@/components/dataset_schema/EditModal.vue';
import DatasetSchemaStore from '@/store/modules/DatasetSchemaStore';

function emptyEntityType(): EntityType {
  return {
    name: ''
  };
}

@Component({
  name: 'EntityTypes',
  components: { EditModal }
})
export default class EntityTypes extends Vue {
  search = '';
  checkedRows: EntityType[] = [];
  availableActionsForSingleEntityType = ['delete', 'edit'];
  showEditModal = false;
  currentEntityType: EntityType | null = null;
  mode: 'add' | 'edit' = 'add';
  fields: Field<EntityType>[] = [
    {
      name: '' + this.$t('properties.name'),
      boundVariable: 'name',
      type: 'text',
      required: true
    }
  ];

  get entityTypes() {
    return DatasetSchemaStore.entityTypes;
  }

  get filteredEntityTypes() {
    return this.entityTypes.filter(entityType => {
      return entityType.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  async getEntityTypes() {
    try {
      await DatasetSchemaStore.getEntityTypes();
    } catch (err) {
      console.error(err);
    }
  }

  startCreatingEntityType() {
    this.mode = 'add';
    this.currentEntityType = emptyEntityType();
    this.showEditModal = true;
  }

  onEdit(item: EntityType) {
    this.mode = 'edit';
    this.currentEntityType = item;
    this.showEditModal = true;
  }

  async saveEntityType(item: EntityType) {
    this.currentEntityType = item;

    if (this.mode === 'edit') {
      try {
        if (item.uuid) {
          await DatasetSchemaStore.updateEntityType(item as Required<EntityType>);
        }
        successMessage('Entity type successfully updated');
      } catch (err) {
        handleFailedRequest(err);
      }
    } else if (this.mode === 'add') {
      try {
        await DatasetSchemaStore.addEntityType(item);
        successMessage('Entity type successfully created');
      } catch (err) {
        handleFailedRequest(err);
      }
    }
    await this.getEntityTypes();
  }

  confirmDelete(deleteItems: EntityType[]) {
    let deleteSingle = {
      message: `Are you sure you want to <b>delete</b> Entity Type "${deleteItems[0].name}"? This action cannot be undone.`,
      title: 'Delete Entity Type',
      confirmText: 'Delete Entity Type'
    };
    let deleteMultiple = {
      message:
        'Are you sure you want to <b>delete</b> these Entity Types? This action cannot be undone.',
      title: 'Delete Entity Type(s)',
      confirmText: 'Delete Entity Type(s)'
    };
    let message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;
    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deleteEntityTypes(deleteItems)
    });
  }

  async deleteEntityTypes(itemList: EntityType[]) {
    const deleteRequests = itemList.map(element => {
      return DatasetSchemaStore.deleteEntityType(element as Required<EntityType>);
    });

    await Promise.all(deleteRequests);
    await this.getEntityTypes();
  }

  availableActions(entityTypes: EntityType[]) {
    if (!entityTypes.length) {
      return [];
    }

    if (entityTypes.length === 1) {
      return this.availableActionsForSingleEntityType;
    }

    return ['delete'];
  }

  @Watch('entityTypes')
  resetCheckedRows() {
    this.checkedRows = [];
  }

  async mounted() {
    await this.getEntityTypes();
  }
}
</script>
<style scoped></style>
