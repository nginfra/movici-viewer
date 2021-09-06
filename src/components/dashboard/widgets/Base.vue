<template>
  <div
    class="widget card is-flex is-flex-direction-column overflow"
    :class="{ 'image-widget': opts.imgUrl, 'icon-widget': opts.icon }"
  >
    <div class="card-image">
      <slot name="header" />
    </div>
    <div class="card-content is-flex-grow-1" :class="opts.style.contentClass">
      <slot name="content" />
    </div>
    <div
      class="card-footer is-block"
      v-if="opts.url || opts.action"
      :class="opts.style.footerClass"
    >
      <slot name="footer" />
    </div>
    <slot name="postFooter" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WidgetOpts } from '@/types';

@Component({
  name: 'BaseWidget'
})
export default class ImageWidget extends Vue {
  @Prop()
  readonly opts!: WidgetOpts;
}
</script>

<style lang="scss" scoped>
.widget {
  min-height: 500px;
  .card-content {
    padding: 24px 32px 0;
    flex-grow: 1;
  }
  .card-footer {
    border: 0;
    padding: 0 32px 32px;
  }
  &.icon-widget {
    .card-content {
      margin-top: -24px;
      padding: 0 48px;
      flex-grow: 1;
    }
  }
}
@media screen and (max-width: 1440px) {
  .widget {
    min-height: 400px;
  }
}
</style>
