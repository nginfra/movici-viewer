<template>
  <div class="has-background-white is-fluid">
    <b-message type="is-danger" has-icon icon-size="is-small">
      The editor functionality doesn't work yet
    </b-message>
    <b-field grouped>
      <b-field :label="$t('properties.name')" expanded>
        <b-input v-model="value.name"></b-input>
      </b-field>
      <b-field :label="$t('resources.region')">
        <b-select :placeholde="$t('scenario.selectRegion')">
          <option value="1">Region 01</option>
          <option value="2">Region 02</option>
          <option value="2">Region 03</option>
        </b-select>
      </b-field>
    </b-field>
    <b-field :label="$t('properties.description')" expanded>
      <b-input type="textarea"></b-input>
    </b-field>
    <!-- End Scenario general information-->
    <!-- Start Scenario duration-->
    <div class="is-divider" :data-content="$t('scenario.duration')"></div>
    <b-field grouped group-multiline>
      <b-field grouped expanded>
        <b-field :label="$t('scenario.startMoment')" icon="calendar-alt">
          <b-field>
            <b-datepicker :placeholder="$t('scenario.selectDate')" icon="calendar-alt">
            </b-datepicker>
            <b-timepicker :placeholder="$t('scenario.selectTime')" icon="clock" :readonly="false">
            </b-timepicker>
          </b-field>
        </b-field>
      </b-field>
      <b-field grouped expanded>
        <b-field :label="$t('scenario.endMoment')" icon="calendar-alt">
          <b-field>
            <b-datepicker :placeholder="$t('scenario.selectDate')" icon="calendar-alt">
            </b-datepicker>
            <b-timepicker :placeholder="$t('scenario.selectTime')" icon="clock" :readonly="false">
            </b-timepicker>
          </b-field>
        </b-field>
      </b-field>
      <b-field grouped expanded>
        <b-field :label="$t('properties.duration')">
          <b-field>
            <b-field :message="$t('time.days')">
              <b-input class="short" type="number" name="days" placeholder="0"></b-input>
            </b-field>
            <b-field :message="$t('time.hours')">
              <b-input class="short" type="number" max="23" name="hours" placeholder="0"></b-input>
            </b-field>
            <b-field :message="$t('time.minutes')">
              <b-input
                class="short"
                type="number"
                max="59"
                name="minutes"
                placeholder="0"
              ></b-input>
            </b-field>
          </b-field>
        </b-field>
      </b-field>
      <b-field grouped expanded>
        <b-field grouped>
          <b-field :label="$t('properties.timeScale')">
            <b-field>
              <b-input
                class="short"
                type="number"
                step=".5"
                name="seconds"
                placeholder="1"
              ></b-input>
              <b-select :placeholder="$t('actions.select') + '...'">
                <option value="1">{{ $t('time.seconds') }}</option>
                <option value="2">{{ $t('time.minutes') }}</option>
                <option value="3">{{ $t('time.hours') }}</option>
              </b-select>
            </b-field>
          </b-field>
        </b-field>
      </b-field>
    </b-field>
    <!-- End Scenario duration-->
    <!-- Start Scenario data-->
    <div class="is-divider" :data-content="$t('properties.data')"></div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-12">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child">
              <p class="subtitle is-size-6 has-text-weight-bold">{{ $t('resources.models') }}</p>
              <!--accordion-->
              <!--accordion item-->
              <b-collapse :open="false" class="card has-background-light is-shadowless">
                <div slot="trigger" slot-scope="props" class="card-header">
                  <p class="card-header-title has-text-primary is-bold">
                    {{ $t('model.selectedType') }}
                  </p>
                  <a class="card-header-icon">
                    <b-icon :icon="props.open ? 'chevron-down' : 'chevron-right'" size="is-small">
                    </b-icon>
                  </a>
                </div>
                <div class="card-content">
                  <div class="content">
                    <b-field :label="$t('properties.name')" expanded>
                      <b-input></b-input>
                    </b-field>
                    <p class="has-padding-top">{{ $t('dataset.selectRequiredTypes') }}</p>
                    <div class="box has-background-white has-padding-2">
                      <p class="subtitle is-size-6 has-text-weight-bold">
                        {{ $t('resources.impactIndicator') }}
                      </p>
                      <div class="field">
                        <b-checkbox v-model="impactindicatorGroup" native-value="dataset01">
                          Dataset 01
                        </b-checkbox>
                      </div>
                      <div class="field">
                        <b-checkbox v-model="impactindicatorGroup" native-value="dataset02">
                          Dataset 02
                        </b-checkbox>
                      </div>
                      <div class="field">
                        <b-checkbox v-model="impactindicatorGroup" native-value="dataset03">
                          Dataset 03
                        </b-checkbox>
                      </div>
                      <hr />
                      <button class="button is-primary is-inverted" slot="trigger">
                        <b-icon icon="plus" size="is-small"></b-icon>
                        <span>{{ $t('dataset.addNew') }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </b-collapse>
              <!--end accordion item-->
              <!--end accordion -->
              <!--dropdown add model type -->
              <b-field grouped class="has-padding-top">
                <b-select :placeholder="$t('model.selectType')" expanded>
                  <option v-for="option in model_types" :value="option.type" :key="option.type">
                    {{ option.name }}
                  </option>
                </b-select>
                <button class="button field is-primary">
                  <b-icon icon="plus" size="is-small"></b-icon>
                  <span>{{ $t('actions.add') }}</span>
                </button>
              </b-field>
              <!--end add model type -->
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child">
              <p class="subtitle is-size-6 has-text-weight-bold">{{ $t('properties.selected') }}</p>
              <div class="has-background-light has-padding">
                <p class="content">
                  <b>{{ $t('resources.impactIndicator') }}:</b>
                  {{ impactindicatorGroup }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <b-field grouped position="is-right">
      <p class="control">
        <button class="button" @click="$emit('cancel')">{{ $t('actions.cancel') }}</button>
      </p>
      <p class="control">
        <button class="button is-primary" @click="$emit('save')">{{ $t('actions.save') }}</button>
      </p>
    </b-field>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Project, Scenario } from '@/types';

@Component({
  name: 'Configurator'
})
export default class Configurator extends Vue {
  @Prop([Object]) value!: Scenario;
  impactindicatorGroup: string[] = [];
  activeTab = 0;
  errors: string[] = ["The editor functionality doesn't work yet"];

  get project(): Project {
    return this.$store.getters.projects;
  }

  get model_types() {
    return this.$store.state.modelTypes.modelTypes;
  }

  getModelTypes() {
    this.$store.dispatch('getModelTypes').catch(err => console.error(err));
  }

  mounted() {
    this.getModelTypes();
  }
}
</script>
<style scoped></style>
