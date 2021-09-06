<template>
  <div class="layer-picker-container is-flex is-flex-direction-column" :class="{ reduce }">
    <EditLayerModal
      :active="showLayerDetails"
      @close="showLayerDetails = false"
      :value="currentItem"
      @input="updateCurrentItem($event)"
      @delete="deleteCurrentItem"
      :mode="mode"
    />
    <div class="overflow">
      <LayerPickerCard
        :class="{ 'mb-4': idx < value.length - 1 }"
        v-for="(layer, idx) in value"
        :mode="mode"
        :key="idx"
        :reduce="reduce"
        :value="layer"
        @input="updateItem(idx, $event)"
        @delete="deleteItem(idx)"
        @edit="startEditingItem(idx)"
      ></LayerPickerCard>
    </div>
    <div class="buttons mt-4 is-flex-shrink" :class="reduce ? 'is-centered' : 'is-right'">
      <BButton class="is-primary" @click="startEditingItem(null)" icon-left="plus">
        <template v-if="!reduce">Add data layer</template>
      </BButton>
    </div>
  </div>
</template>

<script lang="ts">
import LayerPickerCard from './LayerPickerCard.vue';
import EditLayerModal from './EditLayerModal.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { VisualizationMode } from '@/types';
import { VisualizerInfo } from '@/visualizers';

@Component({
  name: 'LayerPicker',
  components: { LayerPickerCard, EditLayerModal }
})
export default class LayerPicker extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  readonly reduce!: boolean;

  @Prop({
    type: String,
    default: VisualizationMode.GEOMETRY,
    validator(value) {
      return Object.values(VisualizationMode).includes(value);
    }
  })
  readonly mode!: VisualizationMode;

  @Prop({
    type: Array,
    default: () => []
  })
  readonly value!: VisualizerInfo[];

  showLayerDetails = false;

  currentIndex: number | null = null;

  get currentItem(): VisualizerInfo | null {
    return this.currentIndex === null ? null : this.value[this.currentIndex];
  }

  startEditingItem(index: number | null) {
    this.currentIndex = index;
    this.showLayerDetails = true;
  }

  updateCurrentItem(val: VisualizerInfo | null) {
    if (val) {
      if (this.currentIndex === null) {
        this.currentIndex = this.value.length;

        this.$emit('input', [...this.value, val]);
      } else {
        this.updateItem(this.currentIndex, val);
      }
    }
  }

  updateItem(idx: number, val: VisualizerInfo) {
    this.$emit(
      'input',
      this.value.map((info, arrayIdx) => {
        return arrayIdx === idx ? val : info;
      })
    );
  }

  deleteCurrentItem() {
    this.currentIndex !== null && this.deleteItem(this.currentIndex);
  }

  deleteItem(idx: number) {
    this.$emit(
      'input',
      this.value.filter((val, arrayIdx) => idx !== arrayIdx)
    );
  }
}
</script>

<style scoped lang="scss">
.buttons {
  background-color: $white-ter;
}
.layer-picker-container {
  height: calc(100vh - 348px);
  &.reduce {
    height: calc(100vh - 264px);
  }
}
</style>
