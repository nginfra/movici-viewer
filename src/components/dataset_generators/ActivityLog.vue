<template>
  <div>
    <div class="has-background-white has-padding-5">
      <b-table
        detailed
        :data="workloads"
        default-sort="created_on"
        default-sort-direction="desc"
        :opened-detailed="expandedItem"
        detail-key="uuid"
        @details-open="(row, index) => closeAllOtherDetails(row, index)"
      >
        <b-table-column
          field="created_on"
          :label="$t('dataset_generator.workload.created_on')"
          sortable
          v-slot="props"
          >{{ props.row.created_on.toLocaleString('NL') }}</b-table-column
        >
        <b-table-column field="datasets" :label="$t('resources.datasets')" v-slot="props">
          <div
            v-if="
              props.row.payload && props.row.payload.datasets && props.row.payload.datasets.length
            "
          >
            {{ props.row.payload.datasets.join(', ') }}
          </div>
        </b-table-column>
        <b-table-column
          field="flags"
          :label="$t('dataset_generator.workload.flags')"
          v-slot="props"
        >
          <div
            v-if="props.row.payload && props.row.payload.flags && props.row.payload.flags.length"
          >
            {{ props.row.payload.flags.join(', ') }}
          </div>
        </b-table-column>
        <b-table-column
          field="status"
          :label="$t('dataset_generator.workload.status')"
          sortable
          v-slot="props"
          >{{ props.row.status }}</b-table-column
        >
        <template slot="detail" slot-scope="props">
          <WorkloadLogs :workload_uuid="props.row.uuid" />
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import WorkloadLogs from './WorkloadLogs.vue';
import orderBy from 'lodash/orderBy';
import DatasetGeneratorsStore from '@/store/modules/DatasetGeneratorsStore';
import { DatasetGeneratorWorkload } from '@/types';

@Component({
  name: 'ActivityLog',
  components: {
    WorkloadLogs
  }
})
export default class ActivityLog extends Vue {
  @Prop({ type: String }) generator_uuid!: string;
  expandedItem: string[] = [];
  workloads: DatasetGeneratorWorkload[] = [];

  get orderedWorkloads() {
    return orderBy(this.workloads, 'created_on', 'desc');
  }

  initialize() {
    if (this.generator_uuid === undefined) {
      return;
    }

    this.updateWorkloads();
  }

  async updateWorkloads() {
    if (this.generator_uuid === null) {
      return;
    }

    this.workloads =
      (await DatasetGeneratorsStore.getGeneratorWorkloads(this.generator_uuid)) ?? [];

    if (this.orderedWorkloads.length > 0) {
      this.expandedItem = [this.orderedWorkloads[0].uuid];
    }
  }

  closeAllOtherDetails(row: DatasetGeneratorWorkload) {
    // Ensure that only one workload is expanded
    this.expandedItem = [row.uuid];
  }

  mounted() {
    this.initialize();
  }
}
</script>
