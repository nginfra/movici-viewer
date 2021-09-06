<template>
  <BModal
    :active="properties.active"
    @close="$emit('close')"
    :can-cancel="['x', 'escape', 'outside']"
    trap-focus
    aria-role="dialog"
    aria-modal
  >
    <video controls v-if="properties.src" autoplay>
      <source :src="properties.src" />
    </video>
  </BModal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'VideoModal'
})
export default class VideoModal extends Vue {
  @Prop()
  properties!: Record<string, unknown>;
}
</script>

<style lang="scss" scoped>
video {
  width: 100%;
}
</style>
