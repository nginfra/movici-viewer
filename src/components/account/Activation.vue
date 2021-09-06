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
                <div v-if="statusMessage.logs">
                  <h1>{{ $t('account.accountActivation') }}</h1>
                  <b-message :type="statusMessage.type" has-icon icon-size="is-small">
                    {{ statusMessage.logs }}
                  </b-message>
                </div>
                <div v-else>
                  <h1>{{ $t('misc.welcome') }}, {{ firstname | upperFirst }}!</h1>
                  <p class="has-margin-b-5">
                    {{ $t('misc.yourUsername') }}<br />
                    <strong>{{ username.toLowerCase() }}</strong>
                  </p>
                  <p class="has-margin-b-5">{{ $t('misc.completeSetup') }}</p>
                  <MovNewPassword v-model="password" />
                  <div class="field is-grouped has-padding-t-7">
                    <b-checkbox v-model="agreement">
                      {{ $t('misc.agreement') }}
                    </b-checkbox>
                  </div>
                  <div class="field is-grouped has-padding-t-7">
                    <p class="control">
                      <button class="button is-primary" :disabled="!canSave" @click="onActivate">
                        {{ $t('actions.getStarted') }}
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
<script lang="ts">
// @ts-nocheck

import { Vue, Component, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';

@Component({
  computed: {
    ...mapState({})
  }
})
class Activation extends Vue {
  password: string = null;
  agreement: string = null;
  errors = {};
  statusMessage = {
    logs: null,
    type: null
  };
  validators = {
    agreement: [this.required]
  };
  regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/;

  @Prop({ default: null }) readonly token!: string;
  @Prop({ default: null }) readonly username!: string;
  @Prop({ default: null }) readonly firstname!: string;
  @Prop({ default: 'en' }) readonly lang!: string;

  get canSave() {
    return !!this.password && !!this.agreement;
  }

  onActivate() {
    this.$store
      .dispatch('currentUser/doActivateAccount', this.getAccountActivationPayload())
      .then(() => {
        this.statusMessage = {
          logs: 'Account activated successfully!',
          type: 'is-success'
        };
        this.goToLogin(4000);
      })
      .catch(() => {
        this.statusMessage = {
          logs: 'Your account could not be activated. Please contact support.',
          type: 'is-danger'
        };
        this.goToLogin(3000);
      });
  }

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
  }

  hasErrors() {
    return !isEmpty(this.errors);
  }

  regexMatches(value) {
    if (!this.regex.exec(value)) return this.$t('messages.passwordComplexity');
  }

  required(value) {
    if (!value) return 'This is a required field';
  }

  getAccountActivationPayload() {
    return {
      password: this.password,
      token: this.token
    };
  }

  goToLogin(timeout) {
    setTimeout(() => this.$router.push({ path: '/' }), timeout);
  }

  setPassword(password) {
    this.password = password;
  }

  mounted() {
    this.$i18n.locale = this.lang;
  }
}

export default Activation;
</script>
<style scoped></style>
