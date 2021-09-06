<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ $t('misc.termsOfUse') }}</p>
        </div>
      </div>

      <div class="content">
        <i18n path="misc.tosMessage" tax="p">
          <a href="https://movici.nl/disclaimer/">{{ $t('misc.here') }}</a>
        </i18n>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'Terms'
})
class Terms extends Vue {}

export default Terms;
</script>

<style scoped></style>
