<template>
  <b-field>
    <b-dropdown aria-role="list" v-model="selected" hoverable position="is-top-right">
      <button class="button" :class="dropdownClass" slot="trigger">
        <b-icon icon="play fa"></b-icon>
      </button>
      <b-dropdown-item v-for="speed in speeds" aria-role="listitem" :key="speed" :value="speed"
        >{{ 'x' + speed }}
      </b-dropdown-item>
    </b-dropdown>
    <b-field>
      <b-radio-button v-model="selected" :native-value="0" type="is-primary">
        <b-icon icon="pause fa"></b-icon>
      </b-radio-button>
      <b-radio-button v-model="selected" :native-value="-1" type="is-primary">
        <b-icon icon="step-forward fa"></b-icon>
      </b-radio-button>
    </b-field>
  </b-field>
</template>

<script>
export default {
  props: {
    value: Number,
    speeds: {
      type: Array,
      default() {
        return [1, 2, 5];
      }
    }
  },
  data() {
    return {
      selected: this.value
    };
  },
  computed: {
    dropdownActive() {
      for (let i = 0; i < this.speeds.length; ++i) {
        if (this.speeds[i] === this.selected) {
          return true;
        }
      }
      return false;
    },
    dropdownClass() {
      if (this.dropdownActive) {
        return 'is-primary';
      }
      return '';
    }
  },
  watch: {
    value() {
      this.selected = this.value;
    },
    selected() {
      if (this.selected !== this.value) {
        this.$emit('input', this.selected);
      }
    }
  }
};
</script>

<style scoped></style>
