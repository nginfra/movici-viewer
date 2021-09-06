<template>
  <section>
    <h1 class="title">{{ title | upperFirst }}</h1>
    <!-- Start Model Type general information-->
    <div v-if="modelType" class="has-background-white is-fluid">
      <div class="has-padding">
        <b-message
          v-for="(error, index) in errors"
          type="is-danger"
          has-icon
          icon-size="is-small"
          :key="index"
        >
          {{ error }}
        </b-message>
        <b-field grouped position="is-right">
          <p class="control">
            <button class="button" @click="onCancel">{{ $t('actions.cancel') }}</button>
          </p>
          <p class="control">
            <button class="button is-primary" @click="validateAndStoreForSave">
              {{ $t('actions.save') }}
            </button>
          </p>
        </b-field>
        <b-field
          :label="$t('model_type.config')"
          :type="{ 'is-danger': !isJsonString(formattedRawData) }"
        >
          <b-input type="textarea" :rows="numOfRows" v-model="formattedRawData"></b-input>
        </b-field>
        <hr />
        <b-field grouped position="is-right">
          <p class="control">
            <button class="button" @click="onCancel">{{ $t('actions.cancel') }}</button>
          </p>
          <p class="control">
            <button class="button is-primary" @click="validateAndStoreForSave">
              {{ $t('actions.save') }}
            </button>
          </p>
        </b-field>
      </div>
    </div>
    <div v-else>
      <p>{{ $t('model_type.invalid') }}</p>
    </div>
  </section>
</template>
<script lang="ts">
import { ModelType } from '@/types';
import { mapState } from 'vuex';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { successMessage } from '../../snackbar';

@Component({
  name: 'ModelTypeDetail',
  computed: mapState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelType: (state: any) => state.modelTypes.currentModelType
  })
})
export default class ModelTypeDetail extends Vue {
  @Prop([String]) readonly uuid!: string;
  errors: string[] = [];
  formattedRawData = '';
  initialRawData = '';
  minRows = 20;
  modelType!: ModelType;

  get numOfRows() {
    return Math.max(this.minRows, this.formattedRawData.split(/\r\n|\r|\n/).length);
  }
  get hasChanges() {
    return this.formattedRawData !== this.initialRawData;
  }
  get addMode() {
    return !this.uuid;
  }
  get editMode() {
    return !!this.uuid;
  }
  get title() {
    return this.addMode ? this.$t('model_type.addNew') : this.$t('model_type.edit');
  }

  mounted() {
    this.initializeThisModelType().then(() => {});
    this.initializeConfigFromStore();
  }

  getThisModelType() {
    this.$store.dispatch('getModelType', this.uuid).catch(() => {});
  }
  async initializeThisModelType() {
    if (this.editMode) {
      this.getThisModelType();
    } else {
      await this.$store.dispatch('setCurrentModelType', this.getEmptyModelType());
    }
  }
  getEmptyModelType() {
    return {
      name: '',
      strict_validation: 'true',
      dataset_categories: [],
      entity_categories: [],
      schema: {}
    };
  }
  async updateModelType() {
    await this.$store.dispatch('updateModelType');
    successMessage('Model type successfully updated');
  }
  async addModelType() {
    await this.$store.dispatch('addModelType');
    successMessage('Model type successfully created');
  }
  goBack() {
    this.$router.push({ name: 'ModelTypes' });
  }
  addErrors(errors: string[]) {
    if (Array.isArray(errors)) {
      this.errors = errors;
    } else if (typeof errors === 'string') {
      this.errors = [errors];
    } else {
      console.log('invalid error', errors);
    }
  }
  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  initializeConfigFromStore() {
    this.formattedRawData = JSON.stringify(this.modelType, null, 2);
    this.initialRawData = this.formattedRawData;
  }
  async validateAndStoreForSave() {
    if (!this.isJsonString(this.formattedRawData)) {
      this.addErrors(['The config contains invalid JSON']);
      return;
    }

    await this.$store.dispatch('setCurrentModelType', JSON.parse(this.formattedRawData));
    this.saveAndReturn();
  }
  saveAndReturn() {
    let action = this.editMode ? this.updateModelType() : this.addModelType();
    action.then(() => {
      this.goBack();
    });
  }
  onCancel() {
    if (this.hasChanges) {
      this.confirmCancel();
    } else {
      this.goBack();
    }
  }
  confirmCancel() {
    this.$buefy.dialog.confirm({
      message: 'You have unsaved changes, do you want to discard them?',
      confirmText: 'Discard Changes',
      type: 'is-warning',
      hasIcon: true,
      onConfirm: () => this.$emit('cancel')
    });
  }
  @Watch('modelType')
  reinitialize() {
    this.initializeConfigFromStore();
  }
}
</script>
<style scoped></style>
