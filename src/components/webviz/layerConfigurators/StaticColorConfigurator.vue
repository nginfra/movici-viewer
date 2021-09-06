<template>
  <div v-if="value">
    <b-field label="Colour">
      <ColorPicker :value="value.color" @input="updateValues({ color: $event })"></ColorPicker>
    </b-field>
  </div>
</template>

<script lang="ts">
import ColorPicker from '@/components/webviz/ColorPicker.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { hexToColorTriple, MoviciColors } from '@/visualizers/maps/colorMaps';
import { ActiveEntityLayerSettings, LayerKind, StaticColorLayerSettings } from '@/types';

const LAYER_KIND = LayerKind.STATIC_COLOR;

const DEFAULT_SETTINGS: StaticColorLayerSettings = {
  kind: LAYER_KIND,
  color: hexToColorTriple(MoviciColors.PURPLE)
};

@Component({
  name: 'StaticColorConfigurator.vue',
  components: { ColorPicker }
})
export default class StaticColorConfigurator extends Vue {
  @Prop([Object]) readonly value!: StaticColorLayerSettings;
  @Prop({
    validator(value: unknown): boolean {
      if (typeof value === 'string') {
        return value == LAYER_KIND;
      }
      return false;
    }
  })
  readonly kind!: string;

  mounted() {
    this.updateValues({});
  }

  updateValues(settings: Partial<ActiveEntityLayerSettings>) {
    this.$emit(
      'input',
      Object.assign({}, DEFAULT_SETTINGS, this.value, settings, { kind: LAYER_KIND })
    );
  }
}
</script>

<style scoped></style>
