<template>
  <section>
    <h4 class="title is-5">{{ $t('resources.roles') }}</h4>
    <div class="level-right">
      <b-button icon-left="plus" class="button is-primary" @click="isAddUserRoleActive = true">
        {{ $t('role.add') }}
      </b-button>
    </div>
    <b-modal :active.sync="isAddUserRoleActive" has-modal-card>
      <user-role-dialog @new-user-role="addUserRole"></user-role-dialog>
    </b-modal>
    <b-table :data="user.roles" default-sort="scope">
      <b-table-column field="scope" :label="$t('scope.type')" sortable v-slot="props">
        {{ props.row.scope | scopeType }}
      </b-table-column>
      <b-table-column field="scope" :label="$t('resources.scope')" v-slot="props">
        {{ props.row.scope | scopeValue }}
      </b-table-column>
      <b-table-column field="role" :label="$t('resources.role')" v-slot="props">
        {{ props.row.role }}
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
  </section>
</template>

<script>
import UserRoleDialog from './UserRoleDialog';
import { successMessage } from '../../snackbar';
import { mapState } from 'vuex';

export default {
  components: {
    UserRoleDialog
  },
  data() {
    return {
      isAddUserRoleActive: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.users.user
    })
  },
  methods: {
    confirmDelete(deleteItems) {
      let deleteSingle = {
        message: 'Are you sure you want to <b>delete</b> this role?',
        title: 'Delete role',
        confirmText: 'Delete role'
      };
      let deleteMultiple = {
        message: 'Are you sure you want to <b>delete</b> these roles?',
        title: 'Delete role(s)',
        confirmText: 'Delete role(s)'
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
        deleteRequests.push(
          this.$store.dispatch('deleteUserRole', {
            uuid: this.user.user_uuid,
            userRole: element
          })
        );
      });

      Promise.all(deleteRequests).then(() => {
        this.getThisUser();
      });
    },

    addUserRole(role) {
      this.$store
        .dispatch('addUserRole', {
          uuid: this.user.user_uuid,
          userRole: role
        })
        .then(() => {
          successMessage('Role succesfully added to User');
          this.getThisUser();
        });
    },
    getThisUser() {
      this.$store.dispatch('getUser', this.user.user_uuid).then(() => {});
    }
  },
  mounted() {},
  filters: {
    scopeType: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.split(':')[0];
    },
    scopeValue: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.split(':')[1];
    }
  }
};
</script>

<style scoped></style>
