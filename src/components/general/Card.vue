<template>
  <div class="card">
    <header class="card-header">
      <slot name="card-header">
        <p class="card-header-title">
          {{ title }}
        </p>
      </slot>
      <a @click="collapsed = !collapsed" class="card-header-icon" aria-label="more options">
        <BIcon class="card-header-icon" :icon="collapsed ? 'angle-up' : 'angle-down'" />
      </a>
    </header>
    <template v-if="!collapsed">
      <div class="card-content">
        <slot name="card-content"> </slot>
      </div>
      <footer class="card-footer">
        <slot name="card-footer"> </slot>
      </footer>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      type: String,
      default: 'Title'
    }
  },
  data() {
    return {
      collapsed: false
    };
  },
  methods: {}
};
</script>

<style scoped></style>
