<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Update Password</p>
    </header>
    <section class="modal-card-body">
      <b-field>
        <b-field label="Current Password">
          <b-input
            type="password"
            v-model="currentPassword"
            password-reveal
            placeholder="Current password"
            required
          >
          </b-input>
        </b-field>
      </b-field>
      <b-field>
        <b-field
          label="New Password"
          :type="{ 'is-danger': errors.password }"
          :message="errors.password ? errors.password[0] : ''"
        >
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="New password"
            required
          >
          </b-input>
        </b-field>
      </b-field>
      <b-field
        label="Retype Password"
        :type="{ 'is-danger': hasOwnProperty(errors, 'confirmPassword') }"
        :message="errors.confirmPassword ? errors.confirmPassword[0] : ''"
      >
        <b-input
          type="password"
          v-model="confirmPassword"
          password-reveal
          placeholder="Retype new password"
          required
        >
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$emit('close')">Cancel</button>
      <button class="button is-primary" :disabled="!canSave" @click="save">Save</button>
    </footer>
  </div>
</template>

<script lang="ts">
import { hasOwnProperty } from '@/utils';
import isEmpty from 'lodash/isEmpty';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Nullable } from '@/types';

type ValidatorFunc = (field: string) => string | null;

// TODO: make keys dynamic
interface Validators {
  password: Array<ValidatorFunc>;
  confirmPassword: Array<ValidatorFunc>;
}

@Component({
  name: 'PasswordDialog'
})
export default class PasswordDialog extends Vue {
  currentPassword: Nullable<string> = null;
  password: Nullable<string> = null;
  confirmPassword: Nullable<string> = null;
  errors: Record<string, string[]> = {};
  validators: Validators = {
    password: [this.required, this.regexMatches],
    confirmPassword: [this.required, this.passwordsMatch]
  };
  regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/;

  hasOwnProperty = hasOwnProperty;

  get canSave() {
    return !!this.password && !!this.confirmPassword && !this.hasErrors();
  }

  save() {
    this.$emit('new-password', {
      current: this.currentPassword,
      new: this.password
    });
    this.$emit('close');
  }

  validate(field: keyof Validators, value: string) {
    delete this.errors[field];
    const fieldErrors: string[] = [];

    this.validators[field].forEach((validator: ValidatorFunc) => {
      const error = validator(value);
      if (error) fieldErrors.push(error);
    });

    if (fieldErrors.length) {
      this.errors[field] = fieldErrors;
    }
  }

  hasErrors() {
    return !isEmpty(this.errors);
  }

  regexMatches(value: string): string | null {
    if (!this.regex.exec(value)) return this.$t('messages.passwordComplexity') as string;
    return null;
  }

  required(value: unknown): string | null {
    if (!value) return 'This is a required field';
    return null;
  }

  passwordsMatch(): string | null {
    if (this.password !== this.confirmPassword) return 'The passwords must match';
    return null;
  }

  @Watch('password')
  passwordWatcher() {
    if (this.password) {
      this.validate('password', this.password);
    }
  }

  @Watch('confirmPassword')
  confirmPasswordWatcher() {
    if (this.confirmPassword) {
      this.validate('confirmPassword', this.confirmPassword);
    }
  }
}
</script>
<style scoped></style>
