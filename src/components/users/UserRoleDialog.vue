<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Add User Role</p>
    </header>
    <section class="modal-card-body">
      <b-field :label="$t('resources.scope')">
        <b-select :placeholder="$t('scope.select')" v-model="scopeType" expanded>
          <option v-for="type in scopeTypes" :value="type" :key="type">
            {{ type }}
          </option>
        </b-select>
      </b-field>
      <b-field v-if="scopeType">
        <b-select v-model="scopeName" expanded>
          <option v-for="name in scopeNames" :value="name" :key="name">
            {{ name }}
          </option>
        </b-select>
      </b-field>
      <b-field :label="$t('resources.role')">
        <b-select :placeholder="$t('role.select')" v-model="role">
          <option v-for="role in roles" :value="role.role_name" :key="role.role_name">
            {{ role.display_name }}
          </option>
        </b-select>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary" @click="save">Save</button>
    </footer>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      uuid: null,
      scopeName: null,
      scopeType: null,
      role: null,
      errors: {},
      validators: {}
    };
  },
  computed: {
    ...mapState({
      scopes: state => state.authorization.scopesMap,
      roles: state => state.authorization.roles
    }),
    canSave() {
      return !!this.password && !!this.confirmPassword && !this.hasErrors;
    },
    scopeTypes() {
      return Object.keys(this.scopes);
    },
    scopeNames() {
      return this.scopes[this.scopeType];
    }
  },
  methods: {
    getScopesAndRoles() {
      this.$store.dispatch('getScopes').then(() => {});
      this.$store.dispatch('getRoles').then(() => {});
    },
    getThisUserRole() {
      return {
        scope: `${this.scopeType}:${this.scopeName}`,
        role: this.role
      };
    },
    save() {
      this.$emit('new-user-role', this.getThisUserRole());
      this.$parent.close();
    },
    validate(field, value) {
      delete this.errors[field];
      let errors = [];
      this.validators[field].forEach(validator => {
        let error = validator(value);
        if (error) errors.push(error);
      });

      if (errors.length) {
        this.errors[field] = errors;
      }
    },
    regexMatches(value) {
      if (!this.regex.exec(value)) return "Password doesn't match complexity requirements";
    },
    required(value) {
      if (!value) return 'This is a required field';
    },
    passwordsMatch() {
      if (this.password !== this.confirmPassword) return 'The passwords must match';
    }
  },
  watch: {},
  mounted() {
    this.getScopesAndRoles();
  }
};
</script>
<style scoped></style>
