<template>
  <BaseWidget :opts="opts">
    <template #header>
      <a
        :href="opts.url"
        class="image-container is-block"
        v-if="opts.imgUrl"
        @click="opts.action()"
      >
        <b-image ratio="is-16by9" :src="opts.imgUrl" :alt="opts.imgAlt" />
      </a>
      <div v-if="opts.icon" class="icon-container image">
        <b-icon
          type="is-primary"
          custom-size="fa-5x"
          class="has-text-centered has-ratio"
          :icon="opts.icon"
          :pack="opts.iconPack"
        ></b-icon>
      </div>
    </template>
    <template #content>
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ opts.title }}</p>
          <p class="subtitle is-6" v-if="opts.subtitle">
            {{ opts.subtitle }}
          </p>
        </div>
      </div>
      <div class="content">
        <div class="text block" v-html="opts.content"></div>
      </div>
    </template>
    <template #footer>
      <b-button
        v-if="opts.url"
        :icon-left="opts.buttonIcon"
        :icon-pack="opts.buttonIconPack"
        type="is-primary"
        tag="a"
        :href="opts.url"
        >{{ opts.buttonText }}</b-button
      >
      <b-button
        v-if="opts.action"
        :icon-left="opts.buttonIcon"
        :icon-pack="opts.buttonIconPack"
        type="is-primary"
        @click="opts.action()"
        >{{ opts.buttonText }}</b-button
      >
    </template>
    <template #postFooter>
      <slot></slot>
    </template>
  </BaseWidget>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WidgetOpts } from '@/types';
import BaseWidget from './Base.vue';

@Component({
  name: 'MediaWidget',
  components: {
    BaseWidget
  }
})
export default class MediaWidget extends Vue {
  @Prop()
  readonly opts!: WidgetOpts;
}
</script>

<style lang="scss" scoped>
.image-container {
  overflow: hidden;
  ::v-deep {
    .image img {
      transition: transform 0.5s ease;
    }
    .image:hover img {
      transform: scale(1.05);
    }
  }
}
.icon-container {
  padding-top: 50%;
  .icon {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    ::v-deep {
      i {
        transition: transform 0.5s ease;
        &:hover {
          transform: scale(1.15);
        }
      }
    }
  }
}
.media {
  margin-bottom: 8px !important;
  .title {
    color: $black;
  }
}
.content {
  .text {
    font-size: 18px;
  }
}
</style>
