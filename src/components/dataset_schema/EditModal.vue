<template>
  <Modal :title="title" :active="active" @close="$emit('close')">
    <template v-slot:content>
      <div class="column">
        <b-field
          v-for="field in fields"
          :key="field.name"
          :label="field.name"
          :message="errors[field.name] || ''"
          :type="{ 'is-danger': errors[field.name] }"
        >
          <b-input
            v-if="field.type === 'text'"
            :value="local[field.boundVariable]"
            @input="local[field.boundVariable] = $event"
            :placeholder="field.name"
          />
          <b-select
            v-else-if="field.type === 'choice'"
            :value="local[field.boundVariable]"
            @input="local[field.boundVariable] = $event"
            :placeholder="field.name"
          >
            <option v-for="choice in field.choices" :value="choice" :key="choice">
              {{ choice }}
            </option>
          </b-select>
        </b-field>
      </div>
    </template>
    <template v-slot:footer>
      <button id="save-btn" class="button is-primary" @click="saveAndClose">
        {{ $t('actions.save') }}
      </button>
      <button v-if="mode === 'edit'" id="delete-btn" class="button is-danger" @click="onDelete">
        Remove
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import upperFirst from 'lodash/upperFirst';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Modal from '@/components/general/Modal.vue';
import { Field } from '@/types';

@Component({
  name: 'EditModal',
  components: { Modal }
})
export default class EditModal<T> extends Vue {
  @Prop({ type: Boolean }) readonly active!: boolean;
  @Prop({ type: Object }) readonly value!: T;
  @Prop({ type: Array }) readonly fields!: Field<T>[];
  @Prop({ type: String }) readonly resource!: string;
  @Prop({
    type: String,
    default: 'add',
    validator(value: unknown): boolean {
      if (typeof value === 'string') {
        return value == 'add' || value == 'edit';
      }
      return false;
    }
  })
  readonly mode!: 'add' | 'edit';
  local: T | null = null;
  shouldValidate = false;

  get title() {
    return upperFirst(this.mode) + ' ' + this.resource;
  }

  get hasErrors() {
    return Object.keys(this.errors).length;
  }

  get requiredFields() {
    return this.fields.filter(f => f.required);
  }

  get errors(): Record<string, string> {
    if (!this.shouldValidate) return {};
    const errors: Record<string, string> = {};
    for (let field of this.requiredFields) {
      if (!this.local?.[field.boundVariable]) {
        errors[field.name] = `${field.name} is a required field`;
      }
    }
    return errors;
  }

  created() {
    this.assignLocal();
  }
  @Watch('value')
  assignLocal() {
    this.local = Object.assign({}, this.value);
  }

  saveAndClose() {
    const out = this.validateBeforeSave();
    if (out) {
      this.$emit('input', out);
      this.$emit('close');
    }
  }

  validateBeforeSave() {
    this.shouldValidate = true;
    if (this.hasErrors) return null;
    return this.local;
  }
  onDelete() {
    this.$emit('close');
    this.$emit('delete', this.local);
  }
}
</script>

<style scoped></style>
