<template>
  <section>
    <h1 class="title">{{ $t('resources.scopes') }}</h1>
    <div class="has-background-white has-padding-5">
      <div class="level">
        <div class="level-left">
          <!-- bulk actions select -->
          <MovActionBar
            actions="delete"
            :enabled="availableActions(checkedRows)"
            @delete="confirmDelete(checkedRows)"
            size="is-small"
          ></MovActionBar>
          <!-- end bulk actions select -->
        </div>
        <div class="level-right">
          <b-button icon="plus" class="button field is-primary" @click="promptAddScope">
            {{ $t('scope.addNew') | upperFirst }}
          </b-button>
        </div>
      </div>
      <b-table
        v-if="scopes.length"
        :data="scopes"
        :checked-rows.sync="checkedRows"
        checkable
        default-sort="scope_name"
      >
        <b-table-column field="scope_name" :label="$t('scope.type')" sortable v-slot="props">
          {{ props.row.scope_name | scopeType }}
        </b-table-column>
        <b-table-column field="scope_name" :label="$t('resources.scope')" v-slot="props">
          {{ props.row.scope_name | scopeName }}
        </b-table-column>
        <b-table-column
          custom-key="actions"
          :label="$t('properties.actions')"
          width="100"
          v-slot="props"
        >
          <MovActionBar
            actions="delete"
            size="is-small"
            @delete="confirmDelete([props.row])"
          ></MovActionBar>
        </b-table-column>
      </b-table>
      <p v-else>{{ $t('scope.nonAvailable') | upperFirst }}</p>
    </div>
  </section>
</template>
<script>
import { successMessage } from '../../snackbar';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      checkedRows: [],
      isAddScopeActive: false
    };
  },
  computed: {
    ...mapState({
      scopes: state => state.authorization.rawScopes
    })
  },
  methods: {
    confirmDelete(deleteItems) {
      let deleteSingle = {
        message: 'Are you sure you want to <b>delete</b> this scope?',
        title: 'Delete scope',
        confirmText: 'Delete scope'
      };
      let deleteMultiple = {
        message: 'Are you sure you want to <b>delete</b> these scopes?',
        title: 'Delete scope(s)',
        confirmText: 'Delete scope(s)'
      };
      let message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;
      this.$buefy.dialog.confirm({
        ...message,
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteItems(deleteItems)
      });
    },
    deleteItems(itemList) {
      let deleteRequests = [];

      itemList.forEach(element => {
        deleteRequests.push(this.$store.dispatch('deleteScope', element));
      });

      Promise.all(deleteRequests).then(() => {
        this.getScopes();
      });
    },
    promptAddScope() {
      this.$buefy.dialog.prompt({
        message: `Add a new scope`,
        inputAttrs: {
          type: 'text',
          placeholder: '<scope-type>:<scope-name>'
        },
        onConfirm: scope => this.addScope(scope)
      });
    },
    addScope(scope) {
      this.$store
        .dispatch('addScope', {
          scope_name: scope
        })
        .then(() => {
          successMessage('Scope successfully added');
          this.getScopes();
        })
        .catch(() => {});
    },
    getScopes() {
      this.$store.dispatch('getScopes').then(() => {});
    },
    availableActions(scopes) {
      if (!scopes.length) {
        return [];
      }

      if (scopes.length >= 1) {
        return ['delete'];
      }
    }
  },
  mounted() {
    this.getScopes();
  },
  filters: {
    scopeType: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.split(':')[0];
    },
    scopeName: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.split(':')[1];
    }
  }
};
</script>
<style scoped></style>
