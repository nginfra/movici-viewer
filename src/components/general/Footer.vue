<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        © {{ new Date().getFullYear() }} MoViCI {{ $t('misc.allRightsReserved') }}
        <span>
          <a class="has-padding-lr-7" @click="isPrivacyModalActive = true">Privacy</a> |
          <a class="has-padding-lr-7" @click="isTermsModalActive = true">{{
            $t('misc.termsOfUse')
          }}</a>
        </span>
      </p>
    </div>
    <b-modal :active.sync="isPrivacyModalActive" width="640" scroll="keep">
      <app-privacy />
    </b-modal>
    <b-modal :active.sync="isTermsModalActive" width="640" scroll="keep">
      <app-terms />
    </b-modal>
  </footer>
</template>

<script>
import Privacy from './Privacy.vue';
import Terms from './Terms.vue';

export default {
  name: 'Footer',
  data() {
    return {
      isPrivacyModalActive: false,
      isTermsModalActive: false
    };
  },
  components: {
    appPrivacy: Privacy,
    appTerms: Terms
  }
};
</script>

<style scoped></style>
