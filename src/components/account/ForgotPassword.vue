<template>
  <section class="hero login is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="logo"></div>
        </div>
        <div class="columns is-centered">
          <div class="column is-two-fifths">
            <article class="card is-rounded has-padding-5 has-background-white">
              <div class="card-content">
                <h1>
                  {{ $t('account.forgotPassword') }}
                </h1>
                <b-message
                  :type="statusMessage.type"
                  has-icon
                  icon-size="is-small"
                  v-if="statusMessage.logs"
                >
                  {{ statusMessage.logs }}
                </b-message>
                <div v-else>
                  <p class="has-margin-b-5">{{ $t('account.forgotPasswordDescription') }}</p>
                  <b-field
                    :label="$t('properties.email')"
                    :type="{ 'is-danger': errors.email }"
                    :message="errors.email ? errors.email[0] : ''"
                  >
                    <b-input type="text" v-model="email" required> </b-input>
                  </b-field>
                  <div class="has-text-right">
                    <router-link :to="{ name: 'Dashboard' }"
                      >{{ $t('account.backToLogin') }}?</router-link
                    >
                  </div>
                  <div class="field is-grouped has-padding-t-7">
                    <p class="control">
                      <button
                        class="button is-primary"
                        :disabled="!canSubmit"
                        @click="onForgotPassword"
                      >
                        {{ $t('actions.submit') }}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import isEmpty from 'lodash/isEmpty';

export default {
  data() {
    return {
      email: null,
      errors: {},
      validators: {
        email: [this.required, this.regexMatches]
      },
      regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      statusMessage: {
        logs: null,
        type: null
      }
    };
  },
  computed: {
    canSubmit() {
      return !!this.email && !this.hasErrors();
    }
  },
  methods: {
    onForgotPassword() {
      this.$store
        .dispatch('currentUser/doForgotPassword', {
          username: this.email
        })
        .then(() => {
          this.statusMessage = {
            logs:
              'A reset link has been sent to your email. Please check your junk folder, if necessary.',
            type: 'is-success'
          };
        })
        .catch(() => {
          this.statusMessage = {
            logs: 'Something went wrong while requesting forgot password.',
            type: 'is-danger'
          };
        });
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
      if (!this.regex.exec(value)) return this.$t('messages.emailComplexity');
    },
    required(value) {
      if (!value) return 'This is a required field';
    }
  },
  watch: {
    email() {
      this.validate('email', this.email);
    }
  }
};
</script>
<style scoped></style>
