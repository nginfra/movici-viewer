<template>
  <section>
    <h1 class="title">{{ $t('dashboardWelcome') }}</h1>
    <!-- start tiles -->
    <div class="widget-area">
      <div class="columns">
        <div class="column">
          <MediaWidget :opts="webvizWidget"></MediaWidget>
        </div>
        <div class="column">
          <MediaWidget :opts="flowPreviewWidget">
            <component
              v-if="flowPreviewWidget.component"
              v-on="flowPreviewWidget.listeners"
              :is="flowPreviewWidget.component"
              :properties.sync="flowPreviewWidget.componentProps"
            />
          </MediaWidget>
        </div>
        <div class="column">
          <MediaWidget :opts="formFeedbackWidget">
            <component
              v-if="formFeedbackWidget.component"
              v-on="formFeedbackWidget.listeners"
              :is="formFeedbackWidget.component"
              :properties.sync="formFeedbackWidget.componentProps"
            />
          </MediaWidget>
        </div>
      </div>
    </div>
    <!-- end tiles -->
  </section>
</template>
<script lang="ts">
import { FeedbackRequestPayload, WidgetOpts } from '@/types';
import { Component, Vue } from 'vue-property-decorator';
import MediaWidget from './widgets/Media.vue';
import TextWidget from './widgets/Media.vue';
import FeedbackForm from './widgets/content/FeedbackForm.vue';
import CarouselModal from '@/components/general/CarouselModal.vue';
import { successMessage } from '@/snackbar';
import { SendFeedbackForm } from '@/api/requests/dashboard';
import Client from '@/api/client';

@Component({
  components: {
    MediaWidget,
    TextWidget
  }
})
export default class Dashboard extends Vue {
  webvizWidget: WidgetOpts = {
    title: this.$t('visualizationWidget.title') as string,
    imgUrl: '/static/dashboard_widgets/card-visualization.png',
    content: this.$t('visualizationWidget.content') as string,
    url: '/webviz',
    buttonText: this.$t('visualizationWidget.button') as string,
    buttonIcon: 'map',
    buttonIconPack: 'far',
    style: {
      footerClass: 'has-text-right'
    }
  };

  flowPreviewWidget: WidgetOpts = {
    title: this.$t('flowPreviewWidget.title') as string,
    imgUrl: '/static/dashboard_widgets/card-preview-movici-flow.png',
    content: this.$t('flowPreviewWidget.content') as string,
    buttonText: this.$t('flowPreviewWidget.button') as string,
    buttonIcon: 'fa-visibility',
    buttonIconPack: 'fak',
    componentProps: {
      active: false,
      title: ('Coming Soon: ' + this.$t('flowPreviewWidget.title')) as string,
      subtitle: this.$t('flowPreviewWidget.content') as string,
      images: [
        '/static/dashboard_widgets/preview-movici-flow-1.png',
        '/static/dashboard_widgets/preview-movici-flow-2.png',
        '/static/dashboard_widgets/preview-movici-flow-3.png',
        '/static/dashboard_widgets/preview-movici-flow-4.png'
      ],
      content: `<ul class="is-size-6">
          <li>
            <b-icon type="is-primary" class="fak fa-checkmark-on has-text-primary"></b-icon>
            ${this.$t('flowPreviewWidget.list[0]')}
          </li>
          <li>
            <b-icon type="is-primary" class="fak fa-checkmark-on has-text-primary"></b-icon>
            ${this.$t('flowPreviewWidget.list[1]')}
          </li>
          <li>
            <b-icon type="is-primary" class="fak fa-checkmark-on has-text-primary"></b-icon>
            ${this.$t('flowPreviewWidget.list[2]')}
          </li>
          <li>
            <b-icon type="is-primary" class="fak fa-checkmark-on has-text-primary"></b-icon>
            ${this.$t('flowPreviewWidget.list[3]')}
          </li>
          <li>
            <b-icon type="is-primary" class="fak fa-checkmark-on has-text-primary"></b-icon>
            ${this.$t('flowPreviewWidget.list[4]')}
          </li>
          <li>
            <b-icon type="is-primary" class="fak fa-checkmark-on has-text-primary"></b-icon>
            ${this.$t('flowPreviewWidget.list[5]')}
          </li>
        </ul>
      `
    },
    component: CarouselModal,
    listeners: {
      close: () => {
        if (this.flowPreviewWidget.componentProps) {
          this.flowPreviewWidget.componentProps.active = false;
        }
      }
    },
    action: () => {
      if (this.flowPreviewWidget.componentProps) {
        this.flowPreviewWidget.componentProps.active = true;
      }
    },
    style: {
      footerClass: 'has-text-right'
    }
  };

  formFeedbackWidget: WidgetOpts<FeedbackRequestPayload> = {
    title: this.$t('feedbackFormWidget.title') as string,
    icon: 'comment-alt-lines',
    iconPack: 'far',
    buttonIcon: 'pencil-alt',
    buttonText: this.$t('feedbackFormWidget.button') as string,
    component: FeedbackForm,
    content: this.$t('feedbackFormWidget.content') as string,
    componentProps: { active: false },
    action: () => {
      if (this.formFeedbackWidget.componentProps) {
        this.formFeedbackWidget.componentProps.active = true;
      }
    },
    listeners: {
      close: () => {
        if (this.formFeedbackWidget.componentProps) {
          this.formFeedbackWidget.componentProps.active = false;
        }
      },
      input: (payload: FeedbackRequestPayload) => {
        const api: Client = this.$store.getters.api;

        api.request(new SendFeedbackForm(payload)).then(() => {
          successMessage(this.$t('feedbackFormWidget.success') as string);
        });
      }
    },
    style: {
      contentClass: 'has-text-centered',
      footerClass: 'has-text-centered'
    }
  };

  mounted() {}
}
</script>

<style scoped lang="scss">
.widget-area {
  @media screen and (min-width: 1480px) and (max-width: 1920px) {
    .column {
      flex: none;
      width: 33%;
    }
  }
  @media screen and (min-width: 1921px) {
    .column {
      flex: none;
      width: 25%;
    }
  }
}
</style>
