<template>
  <div>
    <PropertySelector
      :value="property"
      @input="validated('property', $event)"
      :properties="properties"
      required
      :type="{ 'is-danger': errors['property'] }"
      :message="errors['property'] || ''"
    />
    <b-field label="Base colour">
      <ColorPicker :value="baseColor" @input="setBaseColor($event)" />
    </b-field>
  </div>
</template>

<script lang="ts">
import ColorPicker from '@/components/webviz/ColorPicker.vue';
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import {
  colorTripleToHex,
  generateColorSettings,
  hexToColorTriple,
  MoviciColors
} from '@/visualizers/maps/colorMaps';
import WebvizStore from '@/store/modules/webviz';
import {
  RGBAColor,
  ColorMapColorSettings,
  ColorMapLayerSettings,
  ColorRuleSet,
  LayerKind,
  PropertyType
} from '@/types';
import PropertySelector from '@/components/webviz/PropertySelector.vue';
import { VisualizerInfo } from '@/visualizers';
import FormValidator from '@/utils/FormValidator';
import ValidationProvider from '@/components/mixins/ValidationProvider';

const LAYER_KIND = LayerKind.COLOR_MAP;
const DEFAULT_COLOR = hexToColorTriple(MoviciColors.WHITE);

@Component({
  name: 'ColorMapConfigurator',
  components: { ColorPicker, PropertySelector }
})
export default class ColorMapConfigurator extends Mixins(ValidationProvider) {
  @Prop([Object]) readonly value!: ColorMapLayerSettings;

  @Prop({
    validator(value: unknown): boolean {
      if (typeof value === 'string') {
        return value === LAYER_KIND;
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

  baseColor: RGBAColor = DEFAULT_COLOR;

  get property(): PropertyType | null {
    return this.value?.property || null;
  }

  set property(property: PropertyType | null) {
    if (!property) {
      return;
    }
    const newValue = { property };
    if (this.colorRuleSet) {
      Object.assign(
        newValue,
        this.layerSettingsFromColorSettings(
          this.calculateColorSettings(property, this.colorRuleSet)
        )
      );
    }

    this.updateValues(newValue);
  }

  get hexColor(): string {
    return colorTripleToHex(this.baseColor);
  }
  set hexColor(value: string) {
    this.baseColor = hexToColorTriple(value);
  }

  get colorRuleSet() {
    return WebvizStore.colorRuleSet;
  }

  get colorSettings() {
    if (this.colorRuleSet && this.property) {
      return this.calculateColorSettings(this.property, this.colorRuleSet);
    }
    return null;
  }

  setBaseColor(value: RGBAColor) {
    this.baseColor = value;
    const updates: Partial<ColorMapLayerSettings> = { baseColorOverride: this.baseColor };

    const settings = this.colorSettings;
    if (settings) {
      settings.baseColor = this.hexColor;
      Object.assign(updates, this.layerSettingsFromColorSettings(settings));
    }
    this.updateValues(updates);
  }

  calculateColorSettings(property: PropertyType, ruleset: ColorRuleSet): ColorMapColorSettings {
    const settings = generateColorSettings(this.info.entityGroup, property, ruleset);

    if (this.value && this.value.baseColorOverride) {
      settings.baseColor = this.hexColor;
    }
    return settings;
  }

  mounted() {
    this.setupValidator();
    if (this.value && this.value.baseColorOverride) {
      this.baseColor = this.value.baseColorOverride;
    }

    WebvizStore.getColorRuleSet().then(() => {});
  }

  beforeDestroy() {
    this.validator?.removeModule('ColorMap');
  }
  setupValidator() {
    this.validator?.addModule({
      name: 'ColorMap',
      validators: {
        property: () => {
          if (!this.property) {
            return 'Please select an attribute';
          }
        }
      },
      onValidate: e => (this.errors = e)
    });
  }

  @Watch('colorSettings')
  updateBaseColorFromColorSettings(settings: ColorMapColorSettings) {
    if (this.value && !this.value.baseColorOverride) {
      this.hexColor = settings.baseColor;
    }
  }

  @Watch('info')
  publishSettings() {
    if (this.colorSettings) {
      this.updateValues(this.layerSettingsFromColorSettings(this.colorSettings));
    }
  }

  layerSettingsFromColorSettings(settings: ColorMapColorSettings): Partial<ColorMapLayerSettings> {
    return {
      colors: settings.colors.map(([val, color]) => {
        return [val, hexToColorTriple(color || settings.baseColor)];
      }),
      specialColor: hexToColorTriple(settings.specialColor || settings.baseColor),
      undefinedColor: hexToColorTriple(settings.undefinedColor || settings.baseColor)
    };
  }

  updateValues(settings: Partial<ColorMapLayerSettings>) {
    this.$emit('input', Object.assign({}, this.value, settings, { kind: LAYER_KIND }));
  }
}
</script>

<style scoped></style>
