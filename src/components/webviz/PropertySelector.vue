<template>
  <b-field :label="label" :type="type" :message="message">
    <b-select
      :disabled="disabled"
      :value="value"
      @input="$emit('input', $event)"
      :placeholder="placeholder"
      :required="required"
    >
      <option v-for="prop in properties" :value="prop" :key="propertyString(prop)">
        {{ propertyString(prop) }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PropertyType } from '@/types';
import { propertyString } from '@/utils';

@Component({
  name: 'PropertySelector'
})
export default class PropertySelector extends Vue {
  @Prop({ type: String, default: 'Property' }) readonly label!: string;
  @Prop({ type: String, default: 'choose a component/property' }) readonly placeholder!: string;
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  @Prop({ type: [Object, String], default: '' }) readonly type!: string | Record<string, boolean>;
  @Prop({ type: [String], default: '' }) readonly message!: string;

  @Prop([Object]) readonly value!: PropertyType;
  @Prop({
    type: Array,
    default(): PropertyType[] {
      return [];
    }
  })
  readonly properties!: PropertyType[];

  propertyString = propertyString;
}
</script>
<style scoped></style>
