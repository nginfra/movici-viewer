<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <BSidebar type="is-light" fullheight open :reduce="reduced" :can-cancel="[]">
        <div class="p-2 pt-3 pb-5">
          <div class="block">
            <template v-if="reduced">
              <div class="has-text-centered">
                <router-link :to="{ name: 'Home' }">
                  <div class="logo-symbol"></div>
                </router-link>
                <BButton
                  ref="reduce-button"
                  @click="toggleReduce"
                  icon-right="angle-right"
                  size="is-small"
                />
              </div>
            </template>
            <template v-else>
              <div>
                <router-link :to="{ name: 'Home' }">
                  <div class="logo"></div>
                </router-link>
              </div>
              <BButton
                ref="reduce-button"
                @click="toggleReduce"
                icon-right="angle-left"
                size="is-small"
              />
            </template>
          </div>
          <slot name="below-header" :reduce="reduced"></slot>
        </div>
        <slot name="content" :reduce="reduced"></slot>
      </BSidebar>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'VizSidebar'
})
export default class VizSidebar extends Vue {
  reduced = false;

  toggleReduce() {
    this.reduced = !this.reduced;
  }
}
</script>
