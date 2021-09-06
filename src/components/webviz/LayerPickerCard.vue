<template>
  <div>
    <div class="box has-text-centered" v-show="reduce">
      <BIcon icon="project-diagram"></BIcon>
    </div>
    <div class="box is-flex-space-between" v-show="!reduce">
      <div>
        <span>
          <strong>{{ value.name }}</strong>
        </span>
        <b-icon
          class="center"
          v-if="errors.length"
          icon="exclamation-triangle"
          size="is-small"
          type="is-warning"
          :title="errors.join('\n')"
          style="margin-left: 0.5em"
        ></b-icon>
      </div>

      <MovActionBar
        :actions="['edit', 'delete']"
        size="is-small"
        @edit="$emit('edit')"
        @delete="$emit('delete')"
      >
        <template v-slot:before>
          <ColorPicker v-if="color" v-model="color"></ColorPicker>
          <button class="button is-white is-small" @click="visible = !visible">
            <b-icon
              :icon="visible ? 'eye' : 'eye-slash'"
              size="is-medium"
              :type="visible ? 'is-primary' : 'is-dark'"
            ></b-icon>
          </button>
        </template>
      </MovActionBar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Card from '@/components/general/Card.vue';
import EditLayerModal from '@/components/webviz/EditLayerModal.vue';
import ColorPicker from '@/components/webviz/ColorPicker.vue';
import {
  ActiveEntityLayerSettings,
  LayerKind,
  RGBAColor,
  StaticColorLayerSettings,
  VisualizationMode
} from '@/types';
import { VisualizerInfo } from '@/visualizers';

@Component({
  name: 'LayerPickerCard',
  components: { Card, EditLayerModal, ColorPicker }
})
export default class LayerPickerCard extends Vue {
  @Prop({
    type: Object,
    default() {
      return new VisualizerInfo();
    }
  })
  readonly value!: VisualizerInfo;

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

  collapsed = false;

  get visible() {
    return this.value.visible;
  }
  set visible(val: boolean) {
    this.updateValues({ visible: val });
  }

  get color(): RGBAColor | null {
    if (this.value.settings.kind == LayerKind.STATIC_COLOR) {
      return (this.value.settings as StaticColorLayerSettings)?.color;
    }
    if (this.value.settings.kind == LayerKind.ACTIVE_ENTITY) {
      return (this.value.settings as ActiveEntityLayerSettings)?.color;
    }
    return null;
  }
  set color(val: RGBAColor | null) {
    if (
      val &&
      (this.value.settings.kind == LayerKind.STATIC_COLOR ||
        this.value.settings.kind == LayerKind.ACTIVE_ENTITY)
    ) {
      this.value.settings.color = val;
      this.updateValues({ settings: this.value.settings });
    }
  }

  get errors(): string[] {
    return Object.values(this.value.errors);
  }
  updateValues(values: Partial<VisualizerInfo>) {
    this.$emit('input', Object.assign(new VisualizerInfo(this.value), values));
  }
}
</script>

<style scoped>
.is-flex-space-between {
  display: flex;
  justify-content: space-between;
}
</style>
