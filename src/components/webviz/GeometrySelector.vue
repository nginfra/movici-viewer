<template>
  <b-field :label="label" v-if="validChoices.length > 1">
    <div class="mt-2 block">
      <b-radio
        v-for="c in choices"
        v-model="choice"
        v-show="c.enabled"
        :key="c.geometry"
        :native-value="c.geometry"
        :size="size"
      >
        {{ c.name }}
      </b-radio>
    </div>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { PropertyType } from '@/types';
import { isLines, isPoints, isPolygons } from '@/visualizers/geometry';
import { EntityGeometry } from '@/types/geometry';

function validEntityGeometry(val: unknown): val is EntityGeometry {
  if (typeof val !== 'string') return false;
  return Object.values(EntityGeometry).indexOf(val as EntityGeometry) !== -1;
}

function validEntityGeometryOrNull(val: unknown): val is EntityGeometry | null {
  if (val === null) return true;
  return validEntityGeometry(val);
}

@Component({
  name: 'GeometrySelector'
})
export default class GeometrySelector extends Vue {
  @Prop({ type: String }) readonly label!: string;
  @Prop({ type: String, default: 'choose a choose a geometry' }) readonly placeholder!: string;
  @Prop({ type: Boolean, default: false }) readonly required!: boolean;
  @Prop({ type: String, default: '' }) readonly size!: string;

  @Prop({
    type: String,
    validator(val): boolean {
      return validEntityGeometryOrNull(val);
    }
  })
  readonly value!: EntityGeometry | null;

  @Prop({
    type: Array,
    default(): PropertyType[] {
      return [];
    }
  })
  readonly properties!: PropertyType[];

  get choices(): { geometry: EntityGeometry; enabled: boolean; name: string }[] {
    return [
      { geometry: EntityGeometry.POINT, enabled: isPoints(this.properties), name: 'Points' },
      { geometry: EntityGeometry.LINE, enabled: isLines(this.properties), name: 'Lines' },
      { geometry: EntityGeometry.POLYGON, enabled: isPolygons(this.properties), name: 'Polygons' }
    ];
  }

  get validChoices(): EntityGeometry[] {
    return this.choices.filter(c => c.enabled).map(c => c.geometry);
  }

  get choice(): EntityGeometry | null {
    return this.value;
  }

  set choice(val: EntityGeometry | null) {
    this.$emit('input', val);
  }

  get firstValue(): EntityGeometry | null {
    return this.validChoices?.[0] ?? null;
  }

  @Watch('validChoices')
  setValidValue() {
    if (!this.choice || !this.validChoices.includes(this.choice)) {
      this.choice = this.firstValue;
    }
  }

  mounted() {
    this.setValidValue();
  }
}
</script>
<style scoped></style>
