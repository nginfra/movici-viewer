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
                  {{ $t('account.login') }}
                </h1>
                <b-message
                  :type="logoutMessageType"
                  has-icon
                  icon-size="is-small"
                  v-if="logoutMessage"
                >
                  {{ logoutMessage }}
                </b-message>
                <b-field :label="$t('properties.username')">
                  <b-input v-model="username" @keyup.native.enter="onLogin"></b-input>
                </b-field>
                <b-field :label="$t('properties.password')">
                  <b-input
                    type="password"
                    v-model="password"
                    password-reveal
                    @keyup.native.enter="onLogin"
                  >
                  </b-input>
                </b-field>
                <div class="has-text-right">
                  <router-link :to="{ name: 'ForgotPassword' }"
                    >{{ $t('account.forgotPassword') }}?</router-link
                  >
                </div>

                <div class="field is-grouped has-padding-t-7">
                  <p class="control">
                    <button class="button is-primary" @click="onLogin">
                      {{ $t('account.login') }}
                    </button>
                  </p>
                  <MovLanguagePicker />
                </div>
                <p class="has-padding-t-7">
                  <i18n path="misc.loginTermsMessage" tag="small">
                    <template v-slot:privacy>
                      <a @click="isPrivacyModalActive = true">{{
                        $t('misc.privacyPolicy').toLowerCase()
                      }}</a>
                    </template>
                    <template v-slot:terms>
                      <a @click="isTermsModalActive = true">{{
                        $t('misc.termsOfUse').toLowerCase()
                      }}</a>
                    </template>
                  </i18n>
                </p>
                <b-modal :active.sync="isPrivacyModalActive" :width="640" scroll="keep">
                  <app-privacy />
                </b-modal>
                <b-modal :active.sync="isTermsModalActive" :width="640" scroll="keep">
                  <app-terms />
                </b-modal>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex';
import Privacy from '../general/Privacy.vue';
import Terms from '../general/Terms.vue';

export default {
  data() {
    return {
      username: '',
      password: '',
      isPrivacyModalActive: false,
      isTermsModalActive: false
    };
  },
  components: {
    appPrivacy: Privacy,
    appTerms: Terms
  },
  methods: {
    onLogin() {
      this.$store
        .dispatch('currentUser/doLogin', {
          username: this.username,
          password: this.password
        })
        .then(() => {});
    }
  },
  computed: {
    ...mapState({
      logoutMessage: state => state.currentUser.logoutMessage,
      logoutMessageType: state => state.currentUser.logoutMessageType
    })
  }
};
</script>
<style scoped></style>
