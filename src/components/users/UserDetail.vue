<template>
  <section>
    <h1 class="title">{{ title | upperFirst }}</h1>
    <div v-if="editMode && !user.user_uuid">
      <p>{{ $t('user.invalid') }}</p>
    </div>
    <div v-else class="has-background-white is-fluid">
      <div class="has-padding">
        <b-field grouped>
          <b-field :label="$t('properties.firstname')" expanded>
            <b-input v-model="user.firstname" />
          </b-field>
          <b-field :label="$t('properties.middlename')" expanded>
            <b-input v-model="user.middlename" />
          </b-field>
          <b-field :label="$t('properties.lastname')" expanded>
            <b-input v-model="user.lastname" />
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field :label="$t('properties.username')" expanded>
            <b-input v-model="user.username" />
          </b-field>
          <b-field v-if="this.editMode" :label="$t('properties.createdOn')" expanded>
            <b-input :value="user.created_on | dateTimeString" disabled />
          </b-field>
          <b-field :label="$t('properties.organisation')">
            <b-select :placeholder="$t('organisation.select')" v-model="user.organisation_uuid">
              <option v-for="(o, idx) in organisations" :key="idx" :value="o.organisation_uuid">
                {{ o.name }}
              </option>
            </b-select>
          </b-field>
        </b-field>
        <b-checkbox v-model="user.active">{{ $t('properties.active') }}</b-checkbox>
        <b-field grouped>
          <p class="control">
            <button class="button is-primary" @click="resetCooldown">
              {{ $t('actions.resetLoginCooldown') }}
            </button>
          </p>
          <p class="control">
            <button class="button is-primary" @click="isPasswordChangeActive = true">
              {{ $t('actions.changePassword') }}
            </button>
          </p>
        </b-field>
        <b-modal :active.sync="isPasswordChangeActive" has-modal-card>
          <password-dialog @new-password="updatePassword"></password-dialog>
        </b-modal>
        <b-field grouped position="is-right">
          <p class="control">
            <button class="button" @click="goBack">{{ $t('actions.cancel') }}</button>
          </p>
          <p class="control">
            <button class="button is-primary" @click="onSave">{{ $t('actions.save') }}</button>
          </p>
        </b-field>
        <hr />
        <user-roles v-if="editMode"></user-roles>
      </div>
    </div>
  </section>
</template>
<script>
import { successMessage } from '../../snackbar';
import UserRoles from './UserRoles';
import PasswordDialog from './PasswordDialog';
import { mapState } from 'vuex';
import pick from 'lodash/pick';

export default {
  props: {
    uuid: {
      default: false
    }
  },
  components: {
    UserRoles,
    PasswordDialog
  },
  data() {
    return {
      checkedRoles: [],
      isPasswordChangeActive: false
    };
  },
  computed: {
    ...mapState({
      user: state => state.users.user,
      scopes: state => state.authorization.scopes,
      organisations: state => state.organisations.organisations
    }),
    addMode() {
      return !this.uuid;
    },
    editMode() {
      return !!this.uuid;
    },
    title() {
      return this.addMode ? this.$t('user.addNew') : this.$t('user.edit');
    }
  },
  methods: {
    onSave() {
      if (this.addMode) {
        this.addUser();
      } else {
        this.editUser();
      }
    },
    editUser() {
      return this.$store.dispatch('updateUser', this.getEditPayload()).then(() => {
        successMessage('User successfully updated');
        this.initilialize();
      });
    },
    addUser() {
      return this.$store.dispatch('addUser', this.getAddPayload()).then(resp => {
        successMessage(`User ${this.user.username} successfully created`);
        this.goToEdit(resp.user_uuid);
      });
    },
    goBack() {
      this.$router.push({ name: 'Users' });
    },
    getThisUser() {
      this.$store.dispatch('getUser', this.uuid).then(() => {});
    },
    emptyUser() {
      this.$store.dispatch('clearUser').then(() => {});
    },
    getAllOrganisations() {
      this.$store.dispatch('getOrganisations').then(() => {});
    },
    initilialize() {
      this.getAllOrganisations();
      if (this.editMode) {
        this.getThisUser();
      } else {
        this.emptyUser();
      }
    },
    getEditPayload() {
      return {
        user_uuid: this.uuid,
        ...pick(this.user, [
          'organisation_uuid',
          'username',
          'password',
          'firstname',
          'middlename',
          'lastname',
          'active',
          'reset'
        ])
      };
    },
    getAddPayload() {
      return {
        ...pick(this.user, [
          'organisation_uuid',
          'username',
          'firstname',
          'middlename',
          'lastname',
          'active'
        ])
      };
    },
    goToEdit(uuid) {
      this.$router.push({
        name: 'UserEdit',
        params: { uuid: uuid }
      });
    },
    updatePassword(password) {
      return this.$store
        .dispatch('updateUser', {
          password: password,
          user_uuid: this.uuid
        })
        .then(() => {
          successMessage('Password successfully updated');
          this.initilialize();
        });
    },
    resetCooldown() {
      this.user.reset = true;
      this.editUser();
    }
  },
  mounted() {
    this.initilialize();
  },
  watch: {
    uuid() {
      this.initilialize();
    }
  }
};
</script>
<style scoped></style>
