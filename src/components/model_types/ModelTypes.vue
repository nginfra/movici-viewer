<template>
  <section>
    <h1 class="title">{{ $t('resources.model_types') }}</h1>
    <div class="has-background-white has-padding-5">
      <div class="level">
        <div class="level-left">
          <!--or to show it conditionally-->
          <MovActionBar
            :actions="['edit', 'delete']"
            :enabled="availableActions(checkedRows)"
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
          <router-link custom :to="{ name: 'ModelTypeAdd' }" v-slot="{ navigate }">
            <b-button type="is-primary" icon-left="plus" @click="navigate">
              {{ $t('model_type.addNew') | upperFirst }}
            </b-button>
          </router-link>
          <!-- end add row button -->
        </div>
      </div>
      <b-table
        hoverable
        v-if="modelTypes.length"
        :data="filteredModelTypes"
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
            :actions="availableActionsForSingleModelType"
            size="is-small"
            @edit="onEdit(props.row)"
            @delete="confirmDelete([props.row])"
          ></MovActionBar>
        </b-table-column>
      </b-table>
      <p v-else>{{ $t('model_type.nonAvailable') | upperFirst }}</p>
    </div>
  </section>
</template>
<script lang="ts">
import { ModelType } from '@/types';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';

@Component({
  name: 'ModelTypes',
  computed: mapState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelTypes: (state: any) => state.modelTypes.modelTypes
  })
})
export default class ModelTypes extends Vue {
  search = '';
  checkedRows: ModelType[] = [];
  modelTypes!: ModelType[];
  availableActionsForSingleModelType = ['edit', 'delete'];

  get filteredModelTypes() {
    return this.modelTypes.filter(modelType => {
      return modelType.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  async getModelTypes() {
    try {
      await this.$store.dispatch('getModelTypes');
    } catch (err) {
      console.error(err);
    }
  }

  mounted() {
    this.getModelTypes().then(() => {});
  }

  onEdit(item: ModelType) {
    this.$router.push({
      name: 'ModelTypeEdit',
      params: { uuid: item.uuid }
    });
  }

  confirmDelete(deleteItems: ModelType[]) {
    let deleteSingle = {
      message: `Are you sure you want to <b>delete</b> Model Type "${deleteItems[0].name}"? This action cannot be undone.`,
      title: 'Delete Model Type',
      confirmText: 'Delete Model Type'
    };
    let deleteMultiple = {
      message:
        'Are you sure you want to <b>delete</b> these Model Types? This action cannot be undone.',
      title: 'Delete Model Type(s)',
      confirmText: 'Delete Model Type(s)'
    };
    let message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;
    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deleteModelTypes(deleteItems)
    });
  }
  async deleteModelTypes(itemList: ModelType[]) {
    let deleteRequests: Promise<unknown>[] = [];

    itemList.forEach(element => {
      deleteRequests.push(this.$store.dispatch('deleteModelType', element));
    });

    await Promise.all(deleteRequests);
    await this.getModelTypes();
  }
  availableActions(modelTypes: ModelType[]) {
    if (!modelTypes.length) {
      return [];
    }
    if (modelTypes.length === 1) {
      return this.availableActionsForSingleModelType;
    }
    return ['delete'];
  }

  @Watch('modelTypes')
  resetCheckedRows() {
    this.checkedRows = [];
  }
}
</script>
