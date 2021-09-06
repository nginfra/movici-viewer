<template>
  <section>
    <h1 class="title">{{ title | upperFirst }}</h1>
    <div v-if="editMode && !organisation.organisation_uuid">
      <p>{{ $t('organisation.invalid') }}</p>
    </div>
    <div v-else class="has-background-white is-fluid">
      <div class="has-padding">
        <b-field :label="$t('properties.name')" expanded>
          <b-input v-model="organisation.name" />
        </b-field>
        <b-field :label="$t('properties.address')" expanded>
          <b-input v-model="organisation.address" />
        </b-field>
        <b-field grouped>
          <b-field :label="$t('properties.zip_code')" expanded>
            <b-input v-model="organisation.zip_code" />
          </b-field>
          <b-field :label="$t('properties.place')" expanded>
            <b-input v-model="organisation.city" />
          </b-field>
          <b-field :label="$t('properties.country')" expanded>
            <b-input v-model="organisation.country" />
          </b-field>
        </b-field>
        <b-field :label="$t('properties.chamber_of_commerce')" expanded>
          <b-input v-model="organisation.chamber_of_commerce" />
        </b-field>
        <b-field :label="$t('properties.contact_email')" expanded>
          <b-input v-model="organisation.contact_email" />
        </b-field>
        <b-field v-if="this.editMode" :label="$t('properties.createdOn')" expanded>
          <b-input :value="organisation.created_on | dateTimeString" disabled />
        </b-field>
        <b-field grouped position="is-right">
          <p class="control">
            <button class="button" @click="goBack">{{ $t('actions.cancel') }}</button>
          </p>
          <p class="control">
            <button class="button is-primary" @click="onSave">{{ $t('actions.save') }}</button>
          </p>
        </b-field>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Watch, Prop, Component, Vue } from 'vue-property-decorator';
import { successMessage } from '../../snackbar';
import { mapState } from 'vuex';
import { Organisation, UUID } from '@/types';
import pick from 'lodash/pick';

@Component({
  name: 'OrganisationDetail',
  computed: {
    ...mapState({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      organisation: (state: any) => state.organisations.organisation
    })
  }
})
export default class OrganisationDetail extends Vue {
  checkedOrganisatons: Organisation[] = [];
  organisation!: Organisation;

  @Prop({
    type: String
  })
  uuid!: UUID;

  get addMode() {
    return !this.uuid;
  }

  get editMode() {
    return !!this.uuid;
  }

  get title() {
    return this.addMode ? this.$t('organisation.addNew') : this.$t('organisation.edit');
  }

  onSave() {
    if (this.addMode) {
      this.addOrganisation();
    } else {
      this.editOrganisation();
    }
  }

  editOrganisation() {
    return this.$store.dispatch('updateOrganisation', this.getEditPayload()).then(() => {
      successMessage('Organisation successfully updated');
      this.initilialize();
    });
  }

  addOrganisation() {
    return this.$store.dispatch('addOrganisation', this.getAddPayload()).then(resp => {
      successMessage(`Organisation ${this.organisation.name} successfully created`);
      this.goToEdit(resp.organisation_uuid);
    });
  }

  goBack() {
    this.$router.push({ name: 'Organisations' });
  }

  @Watch('uuid')
  initilialize() {
    if (this.editMode) {
      this.$store.dispatch('getOrganisation', this.uuid);
    } else {
      this.$store.dispatch('clearOrganisation');
    }
  }

  getEditPayload() {
    return {
      organisation_uuid: this.uuid,
      ...pick(this.organisation, [
        'name',
        'address',
        'zip_code',
        'city',
        'country',
        'chamber_of_commerce',
        'contact_email',
        'limits'
      ])
    };
  }

  getAddPayload() {
    return pick(this.organisation, [
      'name',
      'address',
      'zip_code',
      'city',
      'country',
      'chamber_of_commerce',
      'contact_email',
      'limits'
    ]);
  }

  goToEdit(uuid: UUID) {
    this.$router.push({
      name: 'OrganisationEdit',
      params: { uuid }
    });
  }

  mounted() {
    this.initilialize();
  }
}
</script>
<style scoped></style>
