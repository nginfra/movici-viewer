<template>
  <Modal
    :active="properties.active"
    :title="properties.title"
    @close="$emit('close')"
    :can-cancel="['x', 'escape']"
  >
    <template #content>
      <b-carousel
        :autoplay="false"
        :indicator-inside="false"
        icon-pack="far"
        icon-prev="angle-left"
        icon-next="angle-right"
      >
        <b-carousel-item v-for="(image, i) in properties.images" :key="i">
          <figure class="image" ratio="16by9">
            <img :src="image" />
          </figure>
        </b-carousel-item>
      </b-carousel>
    </template>
    <template #footer v-if="properties.content">
      <div class="is-block">
        <h2
          class="is-size-5 has-text-weight-bold is-block has-color-black mb-3"
          v-if="properties.subtitle"
        >
          {{ properties.subtitle }}
        </h2>
        <div class="content-container" v-html="properties.content"></div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Modal from '@/components/general/Modal.vue';

@Component({
  name: 'CarouselModal',
  components: { Modal }
})
export default class CarouselModal extends Vue {
  @Prop()
  properties!: Record<string, unknown>;
}
</script>

<style lang="scss" scoped>
.carousel {
  max-width: 800px;
}
::v-deep {
  .modal-card-head,
  .modal-card-foot {
    border: 0;
  }
  .modal-card-head {
    padding-bottom: 0;
  }
  .modal-card-foot {
    padding-top: 0;
  }

  .carousel-arrow {
    .icon {
      border: 1px solid $primary;
      &:hover {
        background-color: $primary;
        color: $light;
      }
      &.has-icons-left,
      &.has-icons-right {
        i {
          margin-left: 1px;
          margin-top: 2px;
        }
      }
    }
  }
}
</style>
