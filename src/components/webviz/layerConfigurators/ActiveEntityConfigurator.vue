<template>
  <div>
    <PropertySelector
      :value="value.property"
      @input="updateValues({ property: $event })"
      :type="{ 'is-danger': errors['property'] }"
      :message="errors['property'] || ''"
      :properties="properties"
      required
    />
    <PropertySelector
      label="Show on hover"
      :value="value.onHover"
      @input="updateValues({ onHover: $event })"
      :type="{ 'is-danger': errors['onHover'] }"
      :message="errors['onHover'] || ''"
      :properties="properties"
      required
    ></PropertySelector>
    <b-field label="Colour">
      <ColorPicker :value="value.color" @input="updateValues({ color: $event })"></ColorPicker>
    </b-field>
    <b-field label="Inverted">
      <b-checkbox :value="value.inverted" @input="updateValues({ inverted: $event })" />
    </b-field>
  </div>
</template>

<script lang="ts">
import ColorPicker from '@/components/webviz/ColorPicker.vue';
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { hexToColorTriple, MoviciColors } from '@/visualizers/maps/colorMaps';
import { ActiveEntityLayerSettings, LayerKind, PropertyType } from '@/types';
import PropertySelector from '@/components/webviz/PropertySelector.vue';
import ValidationProvider from '@/components/mixins/ValidationProvider';
import FormValidator from '@/utils/FormValidator';
import { VisualizerInfo } from '@/visualizers';

const DEFAULT_SETTINGS: ActiveEntityLayerSettings = {
  kind: LayerKind.ACTIVE_ENTITY,
  color: hexToColorTriple(MoviciColors.BLUE),
  property: { component: null, name: 'id', data_type: 'INT', description: '', unit: '' },
  onHover: {
    component: null,
    name: 'id'
  },
  inverted: false
};
@Component({
  name: 'ActiveEntityConfigurator',
  components: { ColorPicker, PropertySelector }
})
export default class ActiveEntityConfigurator extends Mixins(ValidationProvider) {
  @Prop([Object]) readonly value!: ActiveEntityLayerSettings;
  @Prop({
    validator(value: unknown): boolean {
      if (typeof value === 'string') {
        return value == LayerKind.ACTIVE_ENTITY;
      }
      return false;
    }
  })
  readonly kind!: string;

  @Prop([Object]) readonly info!: VisualizerInfo;
  @Prop({
    type: Array,
    default(): PropertyType[] {
      return [];
    }
  })
  readonly properties!: PropertyType[];

  @Prop({ type: Object, default: null }) readonly validator!: FormValidator | null;

  mounted() {
    this.setupValidator();
    this.updateValues(this.value);
  }

  beforeDestroy() {
    this.validator?.removeModule('ActiveEntity');
  }
  setupValidator() {
    this.validator?.addModule({
      name: 'ActiveEntity',
      validators: {
        property: () => {
          if (!this.value.property) {
            return 'Please select an attribute';
          }
        },
        onHover: () => {
          if (!this.value.onHover) {
            return 'Please select an attribute';
          }
        }
      },
      onValidate: e => (this.errors = e)
    });
  }

  updateValues(settings: Partial<ActiveEntityLayerSettings>) {
    if (this.validator) {
      for (const key of Object.keys(settings)) {
        this.validator?.touch(key as string);
      }
    }

    this.$emit(
      'input',
      Object.assign({}, DEFAULT_SETTINGS, this.value, settings, { kind: LayerKind.ACTIVE_ENTITY })
    );
  }
}
</script>

<style scoped></style>
