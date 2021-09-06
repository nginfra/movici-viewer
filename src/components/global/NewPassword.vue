<template>
  <div>
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
      label="Confirm Password"
      :type="{ 'is-danger': errors.hasOwnProperty('confirmPassword') }"
      :message="errors.confirmPassword ? errors.confirmPassword[0] : ''"
    >
      <b-input
        type="password"
        v-model="confirmPassword"
        password-reveal
        placeholder="Confirm new password"
        required
      >
      </b-input>
    </b-field>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import isEmpty from 'lodash/isEmpty';

@Component({ name: 'NewPassword' })
export default class NewPassword extends Vue {
  password: string | null = null;
  confirmPassword: string | null = null;
  errors: Record<string, string[]> = {};
  validators: Record<string, Array<(v: string | null) => string | undefined>> = {
    password: [this.required, this.regexMatches],
    confirmPassword: [this.required, this.passwordsMatch]
  };
  regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/;
  messages: Record<string, string> = {
    requiredField: 'This is a required field',
    passwordsMatch: 'The passwords must match',
    passwordsComplexity: '' + this.$t('messages.passwordComplexity')
  };

  get shouldEmit() {
    return !!this.password && !!this.confirmPassword && !this.hasErrors();
  }

  validate(field: 'password' | 'confirmPassword', value: string | null) {
    delete this.errors[field];

    const errors: string[] = [];
    this.validators[field].forEach(validator => {
      const error = validator(value);
      if (error) {
        errors.push(error);
      }
    });

    if (Object.keys(this.errors).length) {
      this.errors[field] = errors;
    }
  }

  hasErrors() {
    return !isEmpty(this.errors);
  }

  regexMatches(value: string | null) {
    if (value && !this.regex.exec(value)) return this.messages.passwordsComplexity;
  }

  required(value: string | null) {
    if (!value || value === '') return this.messages.requiredField;
  }

  passwordsMatch() {
    if (this.confirmPassword !== null && this.password !== this.confirmPassword)
      return this.messages.passwordsMatch;
  }

  @Watch('password')
  @Watch('confirmPassword')
  validateBeforeEmit() {
    this.validate('password', this.password);
    this.validate('confirmPassword', this.confirmPassword);
    if (this.shouldEmit) {
      this.$emit('input', this.password);
    }
  }
}
</script>
<style scoped></style>
