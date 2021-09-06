<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'DummyConfigurator.vue'
})
export default class DummyConfigurator extends Vue {
  @Prop([Object]) readonly value!: unknown;

  @Prop([String]) readonly kind!: string;
  mounted() {
    this.$emit('input', { kind: this.kind });
  }
}
</script>

<style scoped></style>
