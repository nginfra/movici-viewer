<template>
  <div class="card">
    <div class="card-content"><span v-html="content" /></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'privacy',
  data() {
    return {
      url: {
        en: '/static/privacy_policy/en.html',
        nl: '/static/privacy_policy/nl.html'
      },
      content: ''
    };
  },
  computed: {
    ...mapGetters({
      language: 'language'
    }),
    localUrl() {
      return this.url[this.language] ? this.url[this.language] : this.url.en;
    }
  },
  methods: {
    getPolicy() {
      axios
        .get(this.localUrl)
        .then(resp => {
          this.content = resp.data;
        })
        .catch(() => {
          this.content = '';
        });
    }
  },
  mounted() {
    this.getPolicy();
  },
  watch: {
    language() {
      this.getPolicy();
    }
  }
};
</script>

<style scoped></style>
