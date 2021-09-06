<template>
  <section>
    <h1 class="title">{{ $t('resources.profile') }}</h1>
    <div class="has-background-white is-fluid has-padding">
      <b-field grouped>
        <b-field :label="$t('properties.firstname')" expanded>
          <b-input v-model="user.firstname" disabled />
        </b-field>
        <b-field :label="$t('properties.middlename')" expanded>
          <b-input v-model="user.middlename" disabled />
        </b-field>
        <b-field :label="$t('properties.lastname')" expanded>
          <b-input v-model="user.lastname" disabled />
        </b-field>
      </b-field>
      <b-field grouped>
        <b-field :label="$t('properties.username')" expanded>
          <b-input v-model="user.username" disabled />
        </b-field>
        <b-field :label="$t('properties.createdOn')" expanded>
          <b-input :value="user.created_on | dateTimeString" disabled />
        </b-field>
      </b-field>
      <b-field grouped>
        <p class="control">
          <button class="button is-primary" @click="isPasswordChangeActive = true">
            {{ $t('actions.changePassword') }}
          </button>
        </p>
        <p class="control">
          <button class="button is-danger" @click="confirmDeactivate">
            {{ $t('actions.deactivateAccount') }}
          </button>
        </p>
      </b-field>
      <b-modal :active.sync="isPasswordChangeActive" has-modal-card>
        <template v-slot="{ close }">
          <password-dialog @close="close" @new-password="updatePassword"></password-dialog>
        </template>
      </b-modal>
      <b-field grouped position="is-right">
        <p class="control">
          <button class="button" @click="goBack">{{ $t('actions.cancel') }}</button>
        </p>
        <p class="control">
          <button class="button is-primary" @click="applyChanges">{{ $t('actions.save') }}</button>
        </p>
      </b-field>
      <hr />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { successMessage } from '../../snackbar';
import PasswordDialog from './PasswordDialog.vue';
import { mapState } from 'vuex';
import { User } from '@/types';

@Component({
  name: 'Profile',
  components: {
    PasswordDialog
  },
  computed: {
    ...mapState({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: (state: any) => state.currentUser.user
    })
  }
})
export default class Profile extends Vue {
  isPasswordChangeActive = false;
  user!: User;

  applyChanges() {
    return this.$store.dispatch('currentUser/updateProfile', this.getEditPayload()).then(() => {
      successMessage('User successfully updated');
      this.initialize();
    });
  }

  goBack() {
    this.$router.push({ name: 'Dashboard' });
  }

  getThisUser() {
    this.$store.dispatch('currentUser/getCurrentUser');
  }

  initialize() {
    this.getThisUser();
  }

  getEditPayload() {
    return {
      active: this.user.active
    };
  }

  async updatePassword(passwordChangeRequest: { current: string; new: string }) {
    const resp = await this.$store.dispatch('currentUser/updateProfile', {
      old_password: passwordChangeRequest.current,
      new_password: passwordChangeRequest.new
    });
    if (resp) {
      successMessage('Password successfully updated');
      this.forceLogout();
    }
  }

  confirmDeactivate() {
    this.$buefy.dialog.confirm({
      message:
        'Are you sure you want to <b>deactivate</b> your account? This action can only be undone by an administrator.',
      title: 'Deactivate account',
      confirmText: 'Deactivate account',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deactivateAccount()
    });
  }

  forceLogout() {
    this.$store.dispatch('currentUser/forceLogout').then(() => {
      this.$router.push({ name: 'Home' });
    });
  }

  deactivateAccount() {
    this.user.active = false;
    this.$store.dispatch('currentUser/updateProfile', this.getEditPayload()).then(() => {
      successMessage('User successfully deactivated');
      this.forceLogout();
    });
  }

  mounted() {
    this.initialize();
  }
}
</script>
<style scoped></style>
