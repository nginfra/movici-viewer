<template>
  <Modal
    :title="$t('feedbackFormWidget.popupTitle')"
    :active="properties.active"
    @close="$emit('close')"
    :can-cancel="['x', 'escape']"
  >
    <template #content>
      <div class="container">
        <p class="mb-3">{{ $t('feedbackFormWidget.popupSubtitle') }}</p>
        <b-field
          :label="$t('feedbackFormWidget.typeLabel')"
          :type="{ 'is-danger': errors['type'] }"
          :message="errors['type'] || ''"
        >
          <b-select
            :value="type"
            @input="validated('type', $event)"
            :placeholder="$t('feedbackFormWidget.typePlaceholder')"
          >
            <option v-for="option in types" :value="option" :key="option">
              {{ $t('feedbackFormWidget.feedbackTypes')[option] }}
            </option>
          </b-select>
        </b-field>
        <b-field
          :label="$t('feedbackFormWidget.messageLabel')"
          :type="{ 'is-danger': errors['message'] }"
          :message="errors['message'] || ''"
        >
          <b-input
            type="textarea"
            minlength="10"
            maxlength="10000"
            rows="5"
            :value="message"
            @input="validated('message', $event)"
            :placeholder="$t('feedbackFormWidget.messagePlaceholder')"
          >
          </b-input>
        </b-field>
      </div>
    </template>
    <template #footer>
      <div class="is-flex is-flex-grow-1 is-justify-content-flex-end">
        <b-button type="is-primary" outlined @click="$emit('close')">
          {{ $t('feedbackFormWidget.cancel') }}
        </b-button>
        <b-button type="is-primary" @click="submit">
          {{ $t('feedbackFormWidget.submit') }}
        </b-button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import Modal from '@/components/general/Modal.vue';
import ValidationProvider from '@/components/mixins/ValidationProvider';
import FormValidator from '@/utils/FormValidator';
import { FeedbackFormType } from '@/types';

@Component({
  name: 'FeedbackForm',
  components: {
    Modal
  }
})
export default class FeedbackForm extends Mixins(ValidationProvider) {
  @Prop()
  properties!: Record<string, unknown>;

  types: FeedbackFormType[] = Object.values(FeedbackFormType);
  type: FeedbackFormType | null = null;
  message = '';
  active = false;

  submit() {
    this.validator?.validate();

    if (this.hasErrors) return null;
    const payload = {
      message: this.message,
      type: this.type
    };

    this.$emit('input', payload);
    this.$emit('close');
  }

  setupValidator() {
    this.validator = new FormValidator({
      validators: {
        type: () => {
          if (!this.type) {
            return this.$t('feedbackFormWidget.validation.type') as string;
          }
        },
        message: () => {
          if (!this.message) {
            return this.$t('feedbackFormWidget.validation.message') as string;
          }

          if (this.message.length < 10) {
            return this.$t('feedbackFormWidget.validation.length') as string;
          }
        }
      },
      onValidate: e => {
        this.errors = e;
      }
    });
  }

  @Watch('properties', { deep: true })
  reset() {
    this.type = null;
    this.message = '';
    this.setupValidator();
  }

  mounted() {
    this.reset();
  }
}
</script>

<style lang="scss" scoped></style>
