<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Update Password</p>
    </header>
    <section class="modal-card-body">
      <b-field>
        <b-field
          label="Password"
          :type="{ 'is-danger': errors.password }"
          :message="errors.password ? errors.password[0] : ''"
        >
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Your password"
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
          placeholder="Retype your password"
          required
        >
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary" :disabled="!canSave" @click="save">Save</button>
    </footer>
  </div>
</template>
<script>
import { hasOwnProperty } from '@/utils';
import isEmpty from 'lodash/isEmpty';

export default {
  data() {
    return {
      password: null,
      confirmPassword: null,
      errors: {},
      validators: {
        password: [this.required, this.regexMatches],
        confirmPassword: [this.required, this.passwordsMatch]
      },
      regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/
    };
  },
  computed: {
    canSave() {
      return !!this.password && !!this.confirmPassword && !this.hasErrors();
    }
  },
  methods: {
    save() {
      this.$emit('new-password', this.password);
      this.$parent.close();
    },
    validate(field, value) {
      delete this.errors[field];
      let errors = [];
      this.validators[field].forEach(validator => {
        let error = validator(value);
        if (error) errors.push(error);
      });

      if (errors.length) {
        this.errors[field] = errors;
      }
    },
    hasErrors() {
      return !isEmpty(this.errors);
    },
    regexMatches(value) {
      if (!this.regex.exec(value)) return this.$t('messages.passwordComplexity');
    },
    required(value) {
      if (!value) return 'This is a required field';
    },
    passwordsMatch() {
      if (this.password !== this.confirmPassword) return 'The passwords must match';
    },
    hasOwnProperty: hasOwnProperty
  },
  watch: {
    password() {
      this.validate('password', this.password);
    },
    confirmPassword() {
      this.validate('confirmPassword', this.confirmPassword);
    }
  }
};
</script>
<style scoped></style>
