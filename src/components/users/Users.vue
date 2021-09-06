<template>
  <section>
    <h1 class="title">{{ $t('resources.users') }}</h1>
    <div class="has-background-white has-padding-5">
      <div class="level">
        <div class="level-left">
          <!-- bulk actions select -->
          <MovActionBar
            :actions="['invite', 'edit', 'delete']"
            :enabled="availableActions(checkedRows)"
            @edit="onEdit(checkedRows[0])"
            @invite="confirmInvite(checkedRows)"
            @delete="confirmDelete(checkedRows)"
            size="is-small"
          ></MovActionBar>
          <!-- end bulk actions select -->
        </div>
        <div class="level-right">
          <!-- add search field -->
          <b-field class="mr-2 mb-0">
            <b-input
              :placeholder="$t('actions.search') + '...'"
              type="search"
              icon="search"
              v-model="search"
            >
            </b-input>
          </b-field>
          <!-- end search field -->
          <!-- add row button -->
          <router-link custom :to="{ name: 'UserAdd' }" v-slot="{ navigate }">
            <b-button type="is-primary" @click="navigate" role="link">
              {{ $t('user.addNew') | upperFirst }}
            </b-button>
          </router-link>
          <!-- end add row button -->
        </div>
      </div>
      <b-table
        v-if="users.length"
        :data="filteredUsers"
        :checked-rows.sync="checkedRows"
        checkable
        default-sort="user"
      >
        <b-table-column
          field="firstname"
          :label="$t('properties.firstname')"
          sortable
          v-slot="props"
        >
          {{ props.row.firstname }}
        </b-table-column>
        <b-table-column field="lastname" :label="$t('properties.lastname')" sortable v-slot="props">
          {{ props.row.middlename }} {{ props.row.lastname }}
        </b-table-column>
        <b-table-column field="username" :label="$t('properties.username')" sortable v-slot="props">
          {{ props.row.username }}
        </b-table-column>
        <b-table-column
          field="organisation"
          :label="$t('properties.organisation')"
          sortable
          v-slot="props"
        >
          {{ props.row.organisation }}
        </b-table-column>
        <b-table-column
          field="created_on"
          :label="$t('properties.createdOn')"
          sortable
          v-slot="props"
        >
          {{ props.row.created_on | dateTimeString }}
        </b-table-column>
        <b-table-column field="active" :label="$t('properties.active')" sortable v-slot="props">
          <b-checkbox
            v-model="props.row.active"
            @input="confirmActivate(props.row)"
            type="is-info"
          />
        </b-table-column>
        <b-table-column
          custom-key="actions"
          :label="$t('properties.actions')"
          width="120"
          v-slot="props"
        >
          <MovActionBar
            :actions="['invite', 'edit', 'delete']"
            size="is-small"
            @delete="confirmDelete([props.row])"
            @edit="onEdit(props.row)"
            @invite="confirmInvite([props.row])"
          ></MovActionBar>
        </b-table-column>
      </b-table>
      <p v-else>{{ $t('user.nonAvailable') | upperFirst }}</p>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex';
import { successMessage } from '../../snackbar';
import upperFirst from 'lodash/upperFirst';

export default {
  data() {
    return {
      search: '',
      checkedRows: []
    };
  },
  computed: {
    ...mapState({
      users: state => state.users.users
    }),
    filteredUsers() {
      if (!this.search) {
        return this.users;
      } else {
        return this.users.filter(user => {
          if (user.firstname) {
            return user.firstname.toLowerCase().includes(this.search.toLowerCase());
          } else {
            return false;
          }
        });
      }
    }
  },
  methods: {
    confirmDelete(deleteItems) {
      let deleteSingle = {
        message: 'Are you sure you want to <b>delete</b> this user? This action cannot be undone.',
        title: 'Delete user',
        confirmText: 'Delete user'
      };
      let deleteMultiple = {
        message:
          'Are you sure you want to <b>delete</b> these users? This action cannot be undone.',
        title: 'Delete user(s)',
        confirmText: 'Delete user(s)'
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
          this.$store.dispatch('deleteUser', {
            user_uuid: element.user_uuid
          })
        );
      });

      Promise.all(deleteRequests).then(() => {
        this.checkedRows = [];
        this.getAllUsers();
      });
    },
    getAllUsers() {
      this.$store.dispatch('getUsers').catch(err => console.error(err));
    },
    onEdit(item) {
      this.$router.push({
        name: 'UserEdit',
        params: { uuid: item.user_uuid }
      });
    },
    confirmInvite(inviteItems) {
      let inviteSingle = {
        message: 'Are you sure you want to <b>send an invitation</b> to this user?',
        title: 'Invite user',
        confirmText: 'Invite user'
      };
      let inviteMultiple = {
        message: 'Are you sure you want to <b>send an invitation</b> to these users?',
        title: 'Invite user(s)',
        confirmText: 'Invite user(s)'
      };
      let message = inviteItems.length > 1 ? inviteMultiple : inviteSingle;
      this.$buefy.dialog.confirm({
        ...message,
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.inviteItems(inviteItems)
      });
    },
    inviteItems(itemList) {
      let inviteRequests = [];

      itemList.forEach(element => {
        inviteRequests.push(
          this.$store.dispatch('inviteUser', {
            uuid: element.user_uuid
          })
        );
      });

      Promise.all(inviteRequests).then(() => {
        this.checkedRows = [];
        this.getAllUsers();
        successMessage('Invitation has been sent out');
      });
    },
    toggleActive(user) {
      let active = user.active;
      let payload = {
        user_uuid: user.user_uuid,
        active
      };
      let activated = active ? 'activated' : 'deactivated';
      return this.$store.dispatch('updateUser', payload).then(() => {
        successMessage(`User ${user.username} successfully ${activated}`);
      });
    },
    confirmActivate(user) {
      let action = user.active ? 'activate' : 'deactivate';
      let shortText = `${upperFirst(action)} user`;
      let message = {
        message: `Are you sure you want to <b>${action}</b> user ${user.username}?`,
        title: shortText,
        confirmText: shortText
      };
      this.$buefy.dialog.confirm({
        ...message,
        type: 'is-warning',
        hasIcon: true,
        onConfirm: () => this.toggleActive(user),
        onCancel: () => (user.active = !user.active)
      });
    },
    availableActions(users) {
      if (!users.length) {
        return [];
      }

      if (users.length === 1) {
        return ['invite', 'edit', 'delete'];
      }

      if (users.length > 1) {
        return ['invite', 'delete'];
      }
    }
  },
  mounted() {
    this.getAllUsers();
  }
};
</script>
