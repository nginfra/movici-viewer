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
                  {{ $t('account.resetPassword') }}
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
                  <p class="has-margin-b-5">
                    {{ $t('misc.yourUsername') }}<br />
                    <strong>{{ username.toLowerCase() }}</strong>
                  </p>
                  <p class="has-margin-b-5">{{ $t('account.resetPasswordDescription') }}</p>
                  <MovNewPassword v-model="password" />
                  <div class="has-text-right">
                    <router-link :to="{ name: 'Dashboard' }">{{
                      $t('account.backToLogin')
                    }}</router-link>
                  </div>
                  <div class="field is-grouped has-padding-t-7">
                    <p class="control">
                      <button
                        class="button is-primary"
                        :disabled="!canSubmit"
                        @click="onResetPassword"
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
import { failMessage, successMessage } from '@/snackbar';

export default {
  props: {
    token: {
      type: String,
      default: null
    },
    username: {
      type: String,
      default: null
    },
    firstname: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      password: null,
      statusMessage: {
        logs: null,
        type: null
      }
    };
  },
  computed: {
    canSubmit() {
      return !!this.password;
    }
  },
  methods: {
    onResetPassword() {
      this.$store
        .dispatch('currentUser/doResetPassword', this.getResetPasswordPayload())
        .then(() => {
          successMessage(
            'Congratulations, your password has been reset! Please login to continue.'
          );
          this.goToLogin(3000);
        })
        .catch(() => {
          failMessage('Something went wrong while resetting your password.');
          this.goToLogin(4000);
        });
    },
    getResetPasswordPayload() {
      return {
        password: this.password,
        token: this.token
      };
    },
    goToLogin(timeout) {
      setTimeout(() => this.$router.push({ path: '/' }), timeout);
    }
  }
};
</script>
<style scoped></style>
