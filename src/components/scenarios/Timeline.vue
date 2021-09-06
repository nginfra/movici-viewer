<template>
  <div>
    <TimelineChart :chartData="timeline" @click="downloadUpdate" />
    <b-field grouped group-multiline class="has-padding-bt-3 has-margin-b-4">
      <p class="control">
        <button class="button is-primary" @click="reload">{{ $t('actions.refresh') }}</button>
      </p>

      <b-field label="Minimum Timestamp" label-position="on-border">
        <b-input
          type="number"
          :disabled="showAll"
          step="1"
          placeholder="0"
          v-model="firstTimestampInput"
        ></b-input>
      </b-field>
      <p class="control">
        <button class="button is-primary" :disabled="showAll" @click="shiftBack">
          <b-icon icon="angle-left" size="is-small" />
        </button>
      </p>
      <b-field label="# of timestamps" label-position="on-border">
        <b-select v-model="numTimestamps" :disabled="showAll">
          <option v-bind:value="1">1 timestamp</option>
          <option v-bind:value="5" selected>5 timestamps</option>
          <option v-bind:value="10">10 timestamps</option>
          <option v-bind:value="50">50 timestamps</option>
        </b-select>
      </b-field>

      <p class="control">
        <button class="button is-primary" :disabled="showAll" @click="shiftForward">
          <b-icon icon="angle-right" size="is-small" />
        </button>
      </p>
      <div class="field">
        <b-switch v-model="showAll"
          >Show all <b>({{ updateCount }})</b></b-switch
        >
      </div>
    </b-field>
    <hr />
    <b-table
      :data="timeline"
      paginated
      per-page="50"
      pagination-position="both"
      default-sort-direction="asc"
      default-sort="timestamp"
    >
      <b-table-column field="name" :label="$t('resources.dataset')" sortable v-slot="props">
        <p>{{ props.row.name }}</p>
        <p>{{ props.row.type }}</p>
      </b-table-column>
      <b-table-column field="model_name" :label="$t('resources.model')" sortable v-slot="props">
        <p>{{ props.row.model_name }}</p>
        <p>{{ props.row.model_type }}</p>
      </b-table-column>
      <b-table-column field="timestamp" :label="$t('timeline.timestamp')" sortable v-slot="props">
        {{ props.row.timestamp }}
      </b-table-column>
      <b-table-column field="iteration" :label="$t('timeline.iteration')" v-slot="props">
        {{ props.row.iteration }}
      </b-table-column>

      <b-table-column field="actions" :label="$t('properties.actions')" v-slot="props">
        <MovAction action="download" size="is-small" @click="downloadUpdate(props.row)" />
      </b-table-column>
    </b-table>
    <hr />
    <b-field grouped position="is-right">
      <p class="control">
        <button class="button is-primary" @click="$emit('cancel')">{{ $t('actions.back') }}</button>
      </p>
    </b-field>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TimelineChart from './TimelineChart.vue';
import { EventBus } from '../../eventbus';
import { Scenario, TimelineInfo, Update } from '@/types';
import TimelineStore from '@/store/modules/TimelineStore';

function getIndex(arr: number[], val: number) {
  // Do a binary search to the the first index i where arr[i] >= val
  if (arr.length === 0) return -1;
  if (val < arr[0]) return 0;
  if (val >= arr[arr.length - 1]) return arr.length - 1;

  let start = 0,
    end = arr.length - 1;
  let mid = 0;

  while (start <= end) {
    mid = Math.floor((start + end) / 2);
    if (arr[mid] === val) return mid;
    else if (arr[mid] < val) start = mid + 1;
    else end = mid - 1;
  }
  return mid + 1;
}

@Component({
  name: 'Timeline',
  components: {
    TimelineChart
  }
})
export default class Timeline extends Vue {
  @Prop([Object]) readonly value!: Scenario;
  showAll = false;
  numTimestamps = 5;
  firstTimestampInput = 0;
  timeline: readonly Update[] = [];
  timelineInfo: TimelineInfo | null = null;

  get scenarioUuid() {
    return this.value.uuid;
  }

  get firstTimestampIndex() {
    return getIndex(this.timestamps, this.firstTimestampInput);
  }

  get lastTimestampInput() {
    let firstTimestampIndex = getIndex(this.timestamps, this.firstTimestampInput);
    if (firstTimestampIndex === null) return 0;
    let lastTimestampIndex = firstTimestampIndex + this.numTimestamps - 1;
    lastTimestampIndex = Math.min(lastTimestampIndex, this.timestamps.length - 1);
    return this.timestamps[lastTimestampIndex];
  }

  get updateCount() {
    return this.timelineInfo ? this.timelineInfo.update_count : null;
  }

  get timestamps() {
    return this.timelineInfo ? this.timelineInfo.timestamps : [];
  }

  get firstTimestamp() {
    if (this.timeline.length === 0) {
      return 0;
    }
    return this.timeline[0].timestamp;
  }

  get lastTimestamp() {
    if (this.timeline.length === 0) {
      return 0;
    }
    return this.timeline[this.timeline.length - 1].timestamp;
  }

  async reload() {
    this.timelineInfo = await TimelineStore.getTimelineInfo(this.scenarioUuid);
    this.timeline = await this.getThisTimeline();
  }

  async getThisTimeline() {
    let payload = { scenario_uuid: this.scenarioUuid };
    if (!this.showAll) {
      payload = {
        ...payload,
        ...{
          min_time: this.firstTimestampInput,
          max_time: this.lastTimestampInput
        }
      };
    }

    return (await TimelineStore.getUpdatesList(payload)) ?? [];
  }

  downloadUpdate(update: Update) {
    TimelineStore.downloadUpdate(update).catch(err => console.error(err));
  }

  refreshThisTab(tabId: string) {
    if (tabId === 'timeline') {
      if (this.showAll) {
        this.showAll = false;
      } else {
        this.reload();
      }
    }
  }

  shiftBack() {
    let newIndex = Math.max(this.firstTimestampIndex - this.numTimestamps, 0);
    this.firstTimestampInput = this.timestamps[newIndex];
  }

  shiftForward() {
    let newIndex = Math.min(
      this.firstTimestampIndex + this.numTimestamps,
      this.timestamps.length - 1
    );
    this.firstTimestampInput = this.timestamps[newIndex];
  }

  @Watch('firstTimestamp')
  afterFirstTimestamp(value: number) {
    this.firstTimestampInput = value;
  }

  @Watch('firstTimestampInput')
  afterFirstTimestampInput(value: number) {
    if (value === this.firstTimestamp) return;
    this.getThisTimeline();
  }

  @Watch('numTimestamps')
  afterNumTimestamps() {
    this.getThisTimeline();
  }

  @Watch('showAll')
  afterShowAll() {
    this.getThisTimeline();
  }

  created() {
    EventBus.$on('scenarios-active-tab', this.refreshThisTab);
  }

  beforeDestroy() {
    EventBus.$off('scenarios-active-tab', this.refreshThisTab);
  }
}
</script>
<style scoped></style>
