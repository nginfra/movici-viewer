import { RoleBinding, RoleType } from '@/types';
// @typescript-eslint/no-explicit-any
// noinspection TypeScriptCheckImport

const hierarchy: Record<RoleType, number> = {
  [RoleType.owner]: 0,
  [RoleType.viewer]: 1,
  [RoleType.user]: 2,
  [RoleType.admin]: 3
};

/**
 * Returns true if any of the rules is returned as true based on the given roles
 * @param rules Set of rules functions
 * @param roles Set of necessary roles
 */
export function requireAnyOf(rules: Array<(role: RoleBinding) => boolean>, roles: RoleBinding[]) {
  for (let role, i = 0; i < roles.length; i++) {
    role = roles[i];
    for (let rule, j = 0; j < rules.length; j++) {
      rule = rules[j];
      if (rule(role)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Call rule validation for Project scope
 * @param minimumRole string with a minimum role option that maps to a numeric value representing a hierarchy
 */
export function anyProjectRole(minimumRole: RoleType) {
  return roleValidator('project:', minimumRole);
}

/**
 * Call rule validation for Organisation scope
 * @param minimumRole string with a minimum role option that maps to a numeric value representing a hierarchy
 */
export function anyOrganisation(minimumRole: RoleType) {
  return roleValidator('organisation:', minimumRole);
}

/**
 * Call rule validation for Service scope
 * @param minimumRole string with a minimum role option that maps to a numeric value representing a hierarchy
 */
export function serviceRole(service: string, minimumRole: RoleType) {
  return roleValidator('service:' + service, minimumRole);
}

/**
 * Call rule validation for Global scope
 * @param minimumRole string with a minimum role option that maps to a numeric value representing a hierarchy
 */
export function globalRole(minimumRole: RoleType) {
  return roleValidator('global:system', minimumRole);
}

/**
 * Validates the scope and role
 * @param scopeToCompare scope to be compared
 * @param minimumRole defines the minimum hierarchy necessary for this role
 */
function roleValidator(scopeToCompare: string, minimumRole: RoleType) {
  return (roleBinding: RoleBinding) => {
    const mininumHierarchy = hierarchy[minimumRole];
    return (
      roleBinding.scope.startsWith(scopeToCompare) &&
      hierarchy[roleBinding.role] >= mininumHierarchy
    );
  };
}
