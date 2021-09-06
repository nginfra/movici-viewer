<template>
  <div>
    <div class="is-divider" :data-content="$t('scenario.externalModels')"></div>
    <div v-for="(model, idx) in models" :key="idx">
      <b-field
        :label="model"
        :type="{ 'is-danger': updates[model] && !isJsonString(updates[model]) }"
      >
        <b-input type="textarea" :rows="numOfRows(model)" v-model="updates[model]"></b-input>
      </b-field>
      <button
        class="button is-primary"
        :disabled="!isJsonString(updates[model])"
        @click="sendUpdate(model)"
      >
        Send
      </button>
      <hr />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { successMessage } from '@/snackbar';

export default {
  props: {
    models: {
      name: 'models',
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      minRows: 5,
      updates: {}
    };
  },
  computed: {
    ...mapState({
      scenario_uuid: state => state.scenarios.currentScenario.uuid
    })
  },
  methods: {
    isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    sendUpdate(model_name) {
      this.$store
        .dispatch('simulation/sendUpdate', {
          model_name,
          scenario_uuid: this.scenario_uuid,
          update: JSON.parse(this.updates[model_name])
        })
        .then(() => {
          successMessage(`Succesfully sent update to model "${model_name}"`);
          this.updates[model_name] = '';
        });
    },
    numOfRows(model) {
      let updateLines = 0;
      try {
        updateLines = this.models[model].split(/\r\n|\r|\n/).length;
      } catch (e) {
        if (!(e instanceof TypeError)) {
          throw e;
        }
      }
      return Math.max(this.minRows, updateLines);
    }
  }
};
</script>

<style scoped></style>
