<template>
  <aside class="sidebar is-primary is-fullheight section is-hidden-touch">
    <template v-for="category in activeCategories">
      <p class="menu-label" :key="category.categoryName">
        {{ $t(category.categoryName) }}
      </p>
      <ul class="menu-list" :key="category.categoryName + '_list'">
        <router-link
          v-for="item in category.items"
          tag="li"
          :key="item.name"
          :to="{ name: item.routeName }"
        >
          <a>{{ $t(item.name) }}</a>
        </router-link>
      </ul>
    </template>
  </aside>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters, mapState } from 'vuex';
import {
  requireAnyOf,
  anyProjectRole,
  anyOrganisation,
  serviceRole,
  globalRole
} from '@/utils/roleHelpers';
import { RoleBinding, RoleType } from '@/types';

interface SideBarItem {
  name: string;
  routeName: string;
  enabled?: boolean;
  show: (roles: RoleBinding[]) => boolean;
}

interface SideBarCategory {
  categoryName: string;
  items: SideBarItem[];
}

@Component({
  computed: {
    ...mapState({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      roles: (state: any) => state.currentUser.user.roles
    }),
    ...mapGetters({
      featureToggle: 'featureToggle'
    })
  }
})
export default class SideBar extends Vue {
  readonly featureToggle!: (feature: string) => boolean;
  roles!: RoleBinding[];
  navBarItems: SideBarCategory[] = [];

  get activeCategories() {
    let out = [];

    for (let i = 0; i < this.navBarItems.length; i++) {
      let category = this.navBarItems[i];
      if (!category.items) {
        continue;
      }
      category.items = this.activeRoutes(category.items);
      if (category.items.length > 0) {
        out.push(category);
      }
    }

    return out;
  }

  activeRoutes(sideBarItems: SideBarItem[]) {
    return sideBarItems.filter((sideBarItem: SideBarItem) => {
      let doShow = false;
      if (sideBarItem.show) {
        doShow = sideBarItem.show(this.roles);
      }

      return doShow && (sideBarItem.enabled === undefined || sideBarItem.enabled);
    });
  }

  createSideBar() {
    this.navBarItems = [
      {
        categoryName: 'sidebar.general',
        items: [
          {
            name: 'sidebar.dashboard',
            routeName: 'Dashboard',
            show() {
              return true;
            }
          },
          {
            name: 'sidebar.visualization',
            routeName: 'WebViz',
            show() {
              return true;
            }
          },
          {
            name: 'sidebar.moviciFlow',
            routeName: 'FlowProjects',
            show: () => {
              return this.featureToggle('flow');
            }
          }
        ]
      },
      {
        categoryName: 'sidebar.simulationManagement',
        items: [
          {
            name: 'resources.projects',
            routeName: 'Projects',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [
                  anyProjectRole(RoleType.viewer),
                  serviceRole('data_engine', RoleType.viewer),
                  anyOrganisation(RoleType.viewer),
                  globalRole(RoleType.viewer)
                ],
                roles
              );
            }
          },
          {
            name: 'resources.datasets',
            routeName: 'Datasets',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [
                  anyProjectRole(RoleType.viewer),
                  serviceRole('data_engine', RoleType.viewer),
                  anyOrganisation(RoleType.viewer),
                  globalRole(RoleType.viewer)
                ],
                roles
              );
            }
          },
          {
            name: 'resources.scenarios',
            routeName: 'Scenarios',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [
                  anyProjectRole(RoleType.viewer),
                  serviceRole('data_engine', RoleType.viewer),
                  anyOrganisation(RoleType.viewer),
                  globalRole(RoleType.viewer)
                ],
                roles
              );
            }
          },
          {
            name: 'resources.views',
            routeName: 'Views',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [
                  anyProjectRole(RoleType.viewer),
                  serviceRole('data_engine', RoleType.viewer),
                  anyOrganisation(RoleType.viewer),
                  globalRole(RoleType.viewer)
                ],
                roles
              );
            }
          },
          {
            name: 'resources.dataset_generators',
            routeName: 'DatasetGenerators',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [
                  anyProjectRole(RoleType.user),
                  serviceRole('dataset_generator', RoleType.viewer),
                  anyOrganisation(RoleType.admin),
                  globalRole(RoleType.user)
                ],
                roles
              );
            }
          }
        ]
      },
      {
        categoryName: 'sidebar.administration',
        items: [
          {
            name: 'resources.organisations',
            routeName: 'Organisations',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [
                  serviceRole('auth_server', RoleType.admin),
                  anyOrganisation(RoleType.admin),
                  globalRole(RoleType.admin)
                ],
                roles
              );
            }
          },
          {
            name: 'resources.users',
            routeName: 'Users',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [
                  serviceRole('auth_server', RoleType.admin),
                  anyOrganisation(RoleType.admin),
                  globalRole(RoleType.admin)
                ],
                roles
              );
            }
          },
          {
            name: 'resources.scopes',
            routeName: 'Scopes',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [serviceRole('auth_server', RoleType.admin), globalRole(RoleType.admin)],
                roles
              );
            }
          },
          {
            name: 'resources.model_types',
            routeName: 'ModelTypes',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [serviceRole('data_engine', RoleType.admin), globalRole(RoleType.admin)],
                roles
              );
            }
          },
          {
            name: 'resources.schema',
            routeName: 'Schema',
            show(roles: RoleBinding[]) {
              return requireAnyOf(
                [serviceRole('data_engine', RoleType.admin), globalRole(RoleType.admin)],
                roles
              );
            }
          }
        ]
      }
    ];
  }

  mounted() {
    this.createSideBar();
  }
}
</script>

<style lang="scss" scoped>
.b-sidebar {
  .sidebar-content {
    overflow: hidden !important;
  }
}
@media screen and (max-width: 1023px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini-mobile {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          ul.menu-list {
            li {
              a {
                span:nth-child(2) {
                  display: none;
                }
              }
              ul {
                padding-left: 0;
                li {
                  a {
                    display: inline-block;
                  }
                }
              }
            }
          }
          .menu-label:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1024px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .menu-list {
            li {
              a {
                span:nth-child(2) {
                  display: none;
                }
              }
              ul {
                padding-left: 0;
                li {
                  a {
                    display: inline-block;
                  }
                }
              }
            }
          }
          .menu-label:not(:last-child) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
