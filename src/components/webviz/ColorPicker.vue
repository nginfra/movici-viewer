<template>
  <b-dropdown v-model="color" :class="{ 'is-up': isUp }">
    <button
      class="button is-small"
      slot="trigger"
      :style="{ 'background-color': hexColor }"
    ></button>
    <b-dropdown-item
      v-for="(color, idx) in colors"
      :value="hexToColorTriple(color)"
      :key="idx"
      :style="{ 'background-color': color }"
    ></b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { colorTripleToHex, hexToColorTriple, MoviciColors } from '@/visualizers/maps/colorMaps';
import { RGBAColor } from '@/types';

@Component({
  name: 'ColorPicker.vue'
})
export default class ColorPicker extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  readonly isUp!: boolean;

  @Prop({
    type: Array,
    validator(value: unknown): boolean {
      if (!(value instanceof Array && value.length == 3)) {
        return false;
      }
      for (const v of value) {
        if (!(typeof v === 'number') || v < 0 || v > 255) {
          return false;
        }
      }
      return true;
    }
  })
  readonly value!: RGBAColor;

  colors: string[] = Object.values(MoviciColors);

  get color(): RGBAColor {
    return this.value || hexToColorTriple(MoviciColors.WHITE);
  }
  set color(value) {
    this.$emit('input', value);
  }

  get hexColor() {
    return colorTripleToHex(this.color);
  }

  colorTripleToHex = colorTripleToHex;
  hexToColorTriple = hexToColorTriple;
}
</script>

<style scoped>
/* >>> means to cascade down to child components */
>>> .dropdown-menu {
  min-width: 1em;
}
>>> .dropdown-item {
  min-height: 1.5em;
}
</style>
