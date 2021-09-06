<template>
  <section>
    <h1 class="title">{{ $t('resources.organisations') }}</h1>
    <div class="has-background-white has-padding-5">
      <div class="level">
        <div class="level-left">
          <MovActionBar
            :actions="['edit', 'delete']"
            :enabled="availableActions(checkedRows)"
            @delete="confirmDelete(checkedRows)"
            size="is-small"
          ></MovActionBar>
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
          <router-link custom :to="{ name: 'OrganisationAdd' }" v-slot="{ navigate }">
            <b-button type="is-primary" icon-left="plus" @click="navigate">
              {{ $t('organisation.addNew') | upperFirst }}
            </b-button>
          </router-link>
          <!-- end add row button -->
        </div>
      </div>
      <b-table
        v-if="organisations.length"
        :data="filteredOrganisations"
        :checked-rows.sync="checkedRows"
        checkable
        default-sort="organisation"
      >
        <b-table-column field="name" :label="$t('properties.name')" sortable v-slot="props">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="address" :label="$t('properties.address')" sortable v-slot="props">
          {{ props.row.address }}
        </b-table-column>
        <b-table-column field="zip_code" :label="$t('properties.zip_code')" sortable v-slot="props">
          {{ props.row.zip_code }}
        </b-table-column>
        <b-table-column field="city" :label="$t('properties.city')" sortable v-slot="props">
          {{ props.row.city }}
        </b-table-column>
        <b-table-column field="country" :label="$t('properties.country')" sortable v-slot="props">
          {{ props.row.country }}
        </b-table-column>
        <b-table-column
          field="country"
          :label="$t('properties.contact_email')"
          sortable
          v-slot="props"
        >
          <a :href="'mailto:' + props.row.contact_email">{{ props.row.contact_email }}</a>
        </b-table-column>
        <b-table-column
          custom-key="actions"
          :label="$t('properties.actions')"
          width="100"
          v-slot="props"
        >
          <MovActionBar
            :actions="['edit', 'delete']"
            size="is-small"
            @delete="confirmDelete([props.row])"
            @edit="onEdit(props.row)"
          ></MovActionBar>
        </b-table-column>
      </b-table>
      <p v-else>{{ $t('organisation.nonAvailable') | upperFirst }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { successMessage } from '../../snackbar';
import { Organisation } from '@/types';

@Component({
  name: 'Organisations',
  computed: {
    ...mapState({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      organisations: (state: any) => state.organisations.organisations
    })
  }
})
export default class Organisations extends Vue {
  search = '';
  checkedRows: Organisation[] = [];
  organisations!: Organisation[];

  get filteredOrganisations() {
    if (!this.search) {
      return this.organisations;
    } else {
      return this.organisations.filter(organisation => {
        if (organisation.name) {
          return organisation.name.toLowerCase().includes(this.search.toLowerCase());
        } else {
          return false;
        }
      });
    }
  }

  confirmDelete(deleteItems: Organisation[]) {
    const deleteSingle = {
        message:
          'Are you sure you want to <b>delete</b> this organisation? This action cannot be undone.',
        title: 'Delete organisation',
        confirmText: 'Delete organisation'
      },
      deleteMultiple = {
        message:
          'Are you sure you want to <b>delete</b> these organisations? This action cannot be undone.',
        title: 'Delete organisations',
        confirmText: 'Delete organisations'
      },
      message = deleteItems.length > 1 ? deleteMultiple : deleteSingle;

    this.$buefy.dialog.confirm({
      ...message,
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => {
        this.deleteItems(deleteItems).then(() => {
          successMessage('Organisation(s) removed successfully');
        });
      }
    });
  }

  deleteItems(itemList: Organisation[]) {
    const deleteRequests: Promise<void>[] = [];

    itemList.forEach(element => {
      deleteRequests.push(
        this.$store.dispatch('deleteOrganisation', {
          organisation_uuid: element.organisation_uuid
        })
      );
    });

    return Promise.all(deleteRequests).then(() => {
      this.checkedRows = [];
      this.getAllOrganisations();
    });
  }

  getAllOrganisations() {
    this.$store.dispatch('getOrganisations').catch(err => console.error(err));
  }

  onEdit(organisation: Organisation) {
    this.$router.push({
      name: 'OrganisationEdit',
      params: { uuid: organisation.organisation_uuid }
    });
  }

  availableActions(organisations: Organisation[]) {
    if (!organisations.length) {
      return [];
    }

    if (organisations.length === 1) {
      return ['edit', 'delete'];
    }

    if (organisations.length > 1) {
      return ['delete'];
    }
  }

  mounted() {
    this.getAllOrganisations();
  }
}
</script>
