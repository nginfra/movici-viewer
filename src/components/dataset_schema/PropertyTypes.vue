<template>
  <section>
    <h1 class="title">{{ $t('resources.property_types') }}</h1>
    <div class="level">
      <div class="level-left">
        <!--or to show it conditionally-->
        <MovActionBar
          :actions="availableActionsForSinglePropertyType"
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
        <b-button class="is-primary" @click="startCreatingPropertyType" icon-left="plus">
          {{ $t('property_type.addNew') | upperFirst }}
        </b-button>
      </div>
    </div>
    <b-table
      hoverable
      v-if="propertyTypes.length"
      paginated
      per-page="50"
      pagination-position="both"
      :data="filteredPropertyTypes"
      :checked-rows.sync="checkedRows"
      :is-row-checkable="row => row.uuid"
      checkable
      default-sort="name"
    >
      <b-table-column field="name" :label="$t('properties.name')" sortable v-slot="props">
        {{ props.row.name }}
      </b-table-column>
      <b-table-column field="component" :label="$t('properties.component')" sortable v-slot="props">
        {{ props.row.component }}
      </b-table-column>
      <b-table-column field="data_type" :label="$t('properties.data_type')" sortable v-slot="props">
        {{ props.row.data_type }}
      </b-table-column>
      <b-table-column
        field="description"
        :label="$t('properties.description')"
        sortable
        v-slot="props"
      >
        {{ props.row.description }}
      </b-table-column>
      <b-table-column field="unit" :label="$t('properties.unit')" sortable v-slot="props">
        {{ props.row.unit }}
      </b-table-column>
      <b-table-column field="enum" :label="$t('properties.enum')" sortable v-slot="props">
        {{ props.row.enum_name }}
      </b-table-column>
      <b-table-column
        custom-key="actions"
        :label="$t('properties.actions')"
        width="150"
        v-slot="props"
      >
        <MovActionBar
          :actions="availableActionsForSinglePropertyType"
          size="is-small"
          @edit="onEdit(props.row)"
          @delete="confirmDelete([props.row])"
        ></MovActionBar>
      </b-table-column>
    </b-table>
    <p v-else>{{ $t('property_type.nonAvailable') | upperFirst }}</p>
    <EditModal
      :active="showEditModal"
      @close="showEditModal = false"
      :mode="mode"
      :value="currentPropertyType"
      resource="Property Type"
      :fields="fields"
      @input="savePropertyType($event)"
      @delete="confirmDelete([$event])"
    />
  </section>
</template>
<script lang="ts">
import EditModal from './EditModal.vue';
import { Field, PropertyType } from '@/types';
import { successMessage } from '@/snackbar';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { handleFailedRequest } from '@/store/requests';
import DatasetSchemaStore from '@/store/modules/DatasetSchemaStore';

function emptyPropertyType(): PropertyType {
  return {
    name: '',
    component: null,
    data_type: ''
  };
}

@Component({
  name: 'PropertyTypes',
  components: { EditModal }
})
export default class PropertyTypes extends Vue {
  search = '';
  checkedRows: PropertyType[] = [];
  availableActionsForSinglePropertyType = ['delete', 'edit'];
  showEditModal = false;
  currentPropertyType: PropertyType | null = null;
  mode: 'add' | 'edit' = 'add';

  get propertyTypes() {
    return DatasetSchemaStore.propertyTypes;
  }

  fields: Field<PropertyType>[] = [
    {
      name: this.$t('properties.name') as string,
      boundVariable: 'name',
      type: 'text',
      required: true
    },
    {
      name: this.$t('properties.component') as string,
      boundVariable: 'component',
      type: 'text',
      required: false
    },
    {
      name: this.$t('properties.data_type') as string,
      boundVariable: 'data_type',
      type: 'text',
      required: true
    },
    {
      name: this.$t('properties.description') as string,
      boundVariable: 'description',
      type: 'text',
      required: false
    },
    {
      name: this.$t('properties.unit') as string,
      boundVariable: 'unit',
      type: 'text',
      required: false
    },
    {
      name: this.$t('properties.enum') as string,
      boundVariable: 'enum_name',
      type: 'text',
      required: false
    }
  ];
  get filteredPropertyTypes() {
    return this.propertyTypes.filter(propertyType => {
      return propertyType.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  async getPropertyTypes() {
    try {
      await DatasetSchemaStore.getPropertyTypes();
    } catch (err) {
      console.error(err);
    }
  }
  mounted() {
    this.getPropertyTypes().then(() => {});
  }

  startCreatingPropertyType() {
    this.mode = 'add';
    this.currentPropertyType = emptyPropertyType();
    this.showEditModal = true;
  }
  onEdit(item: PropertyType) {
    this.mode = 'edit';
    this.currentPropertyType = item;
    this.showEditModal = true;
  }
  async savePropertyType(item: PropertyType) {
    this.currentPropertyType = item;

    if (this.mode === 'edit') {
      try {
        if (item.uuid) {
          await DatasetSchemaStore.updatePropertyType(item as Required<PropertyType>);
        }
        successMessage('Property type successfully updated');
      } catch (err) {
        handleFailedRequest(err);
      }
    } else if (this.mode === 'add') {
      try {
        await DatasetSchemaStore.addPropertyType(item);
        successMessage('Property type successfully created');
      } catch (err) {
        handleFailedRequest(err);
      }
    }
    await this.getPropertyTypes();
  }
  confirmDelete(deleteItems: PropertyType[]) {
    let deleteSingle = {
      message: `Are you sure you want to <b>delete</b> Property Type "${deleteItems[0].name}"? This action cannot be undone.`,
      title: 'Delete Property Type',
      confirmText: 'Delete Property Type'
    };
    let deleteMultiple = {
      message:
        'Are you sure you want to <b>delete</b> these Property Types? This action cannot be undone.',
      title: 'Delete Property Type(s)',
      confirmText: 'Delete Property Type(s)'
    };
    let message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;
    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deletePropertyTypes(deleteItems)
    });
  }
  async deletePropertyTypes(itemList: PropertyType[]) {
    let deleteRequests: Promise<unknown>[] = [];

    itemList.forEach(element => {
      if (element.uuid) {
        deleteRequests.push(
          DatasetSchemaStore.deletePropertyType(element as Required<PropertyType>)
        );
      }
    });

    await Promise.all(deleteRequests);
    await this.getPropertyTypes();
  }
  availableActions(propertyTypes: PropertyType[]) {
    if (!propertyTypes.length) {
      return [];
    }
    if (propertyTypes.length === 1) {
      return this.availableActionsForSinglePropertyType;
    }
    return ['delete'];
  }
  @Watch('propertyTypes')
  resetCheckedRows() {
    this.checkedRows = [];
  }
}
</script>
<style scoped></style>
