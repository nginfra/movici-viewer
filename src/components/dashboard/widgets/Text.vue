<template>
  <BaseWidget :opts="opts">
    <template #content>
      <div class="media">
        <div class="media-content">
          <p class="title is-4" :class="'has-text-' + opts.style.titleAlign">{{ opts.title }}</p>
          <p
            class="subtitle is-6"
            :class="'has-text-' + opts.style.titleAlign"
            v-if="opts.subtitle"
          >
            {{ opts.subtitle }}
          </p>
        </div>
      </div>
      <div class="content">
        <div
          class="text block"
          :class="'has-text-' + opts.style.textAlign"
          v-html="opts.content"
        ></div>
      </div>
    </template>
    <template #footer>
      <b-button
        v-if="opts.url"
        :icon-left="opts.buttonIcon"
        type="is-primary"
        tag="a"
        :href="opts.url"
        >{{ opts.buttonText }}</b-button
      >
      <b-button
        v-if="opts.action"
        :icon-left="opts.buttonIcon"
        type="is-primary"
        @click="opts.action()"
        >{{ opts.buttonText }}</b-button
      >
    </template>
  </BaseWidget>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WidgetOpts } from '@/types';
import BaseWidget from './Base.vue';

// example of text widget
// lastUpdates: WidgetOpts = {
//   title: 'Release Notes',
//   content: `- New dashboard with widgets <br>
//     - Movici Flow UI under tests <br>
//     - Movici Flow UI under tests <br>
//     - Movici Flow UI under tests <br>
//     - Movici Flow UI under tests
//   `,
//   style: {
//     imgRatio: 'is-3by1'
//   }
// };

@Component({
  name: 'TextWidget',
  components: {
    BaseWidget
  }
})
export default class TextWidget extends Vue {
  @Prop()
  readonly opts!: WidgetOpts;
}
</script>

<style lang="scss" scoped></style>
