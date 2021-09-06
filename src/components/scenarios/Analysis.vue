<template>
  <div class="has-background-white is-fluid">
    <b-field grouped>
      <b-field>
        <b-select placeholder="Select template" v-model="templateIndex">
          <option v-for="(template, idx) in templates" :key="idx" :value="idx">
            {{ template.title }}
          </option>
        </b-select>
      </b-field>
      <p class="control">
        <button class="button" @click="showConfig = !showConfig">
          {{ showConfig ? $t('analysis.simplified') : $t('analysis.advanced') }}
        </button>
      </p>
      <p class="control">
        <button class="button is-primary" @click="sendRequest">
          {{ $t('actions.generate') }}
        </button>
      </p>
    </b-field>
    <b-field
      :label="$t('scenario.config')"
      :type="{ 'is-danger': !isJsonString(formattedRawData) }"
      v-if="showConfig"
    >
      <b-input type="textarea" :rows="numOfRows" v-model="formattedRawData"></b-input>
    </b-field>
    <hr />
    <div v-if="plot">
      <b-field>
        <b-image :src="plot" />
      </b-field>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { AnalysisTemplate, Scenario, ShortScenario } from '@/types';
import ScenarioStore from '@/store/modules/ScenarioStore';

@Component({
  name: 'Analysis'
})
export default class Analysis extends Vue {
  @Prop([Object]) value!: Scenario;
  errors = [];
  templates: AnalysisTemplate[] = [];
  templateIndex: number | null = null;
  formattedRawData = '';
  minRows = 10;
  plot: string | null = null;
  showConfig = false;

  get scenario(): ShortScenario | null {
    return ScenarioStore.currentScenario;
  }

  get numOfRows() {
    if (this.plot) {
      return this.minRows;
    }
    return Math.max(this.minRows, this.formattedRawData.split(/\r\n|\r|\n/).length);
  }

  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  validateConfig() {
    if (!this.isJsonString(this.formattedRawData)) {
      this.$emit('error', ['The config contains invalid JSON']);
      return false;
    }
    return true;
  }

  async sendRequest() {
    if (this.validateConfig()) {
      this.plot = await ScenarioStore.getAnalysisPlot({
        scenario_uuid: this.value.uuid,
        config: JSON.parse(this.formattedRawData)
      });
    }
  }

  @Watch('templateIndex')
  afterTemplateIndex(value: number) {
    this.formattedRawData = JSON.stringify(this.templates[value], null, 2);
  }

  async mounted() {
    this.templates = await ScenarioStore.getAnalysisTemplates();
  }
}
</script>
<style scoped></style>
