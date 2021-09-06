<template>
  <section>
    <h1 class="title">{{ $t('resources.schema') }}</h1>
    <div class="has-background-white has-padding-5">
      <b-tabs v-model="activeTab">
        <b-tab-item :label="$t('resources.dataset_types')">
          <DatasetTypes />
        </b-tab-item>
        <b-tab-item :label="$t('resources.entity_types')">
          <EntityTypes />
        </b-tab-item>
        <b-tab-item :label="$t('resources.property_types')">
          <PropertyTypes />
        </b-tab-item>
      </b-tabs>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DatasetTypes from './DatasetTypes.vue';
import EntityTypes from './EntityTypes.vue';
import PropertyTypes from './PropertyTypes.vue';

@Component({
  components: {
    DatasetTypes,
    EntityTypes,
    PropertyTypes
  }
})
export default class DatasetSchema extends Vue {
  activeTab = 0;
}
</script>
