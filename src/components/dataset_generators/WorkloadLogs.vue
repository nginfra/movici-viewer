<template>
  <b-table
    v-if="workloadActivityLogs.length"
    :data="workloadActivityLogs"
    default-sort="created_on"
    default-sort-direction="asc"
  >
    <b-table-column
      field="created_on"
      :label="$t('dataset_generator.workload.activity_log.created_on')"
      sortable
      v-slot="props"
      >{{ props.row.created_on.toLocaleString('NL') }}</b-table-column
    >
    <b-table-column
      field="message"
      :label="$t('dataset_generator.workload.activity_log.message')"
      sortable
      v-slot="props"
      >{{ props.row.message }}</b-table-column
    >
    <b-table-column
      field="verbosity_level"
      :label="$t('dataset_generator.workload.activity_log.verbosity_level')"
      sortable
      v-slot="props"
    >
      {{ props.row.verbosity_level }}
    </b-table-column>
  </b-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DatasetGeneratorsStore from '@/store/modules/DatasetGeneratorsStore';
import { DatasetGeneratorLog, UUID } from '@/types';

@Component({
  name: 'WorkloadLogs'
})
export default class WorkloadLogs extends Vue {
  @Prop({ type: String }) readonly workload_uuid!: UUID;
  workloadActivityLogs: DatasetGeneratorLog[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  polling: any = null;

  async getWorkloadLogs() {
    this.workloadActivityLogs =
      (await DatasetGeneratorsStore.getWorkloadActivityLogs(this.workload_uuid)) ?? [];
  }

  pollData() {
    this.polling = setInterval(() => {
      this.getWorkloadLogs();
    }, 3000);
  }

  initialize() {
    this.getWorkloadLogs();
  }

  mounted() {
    this.initialize();
  }

  created() {
    this.pollData();
  }

  beforeDestroy() {
    clearInterval(this.polling);
  }
}
</script>
