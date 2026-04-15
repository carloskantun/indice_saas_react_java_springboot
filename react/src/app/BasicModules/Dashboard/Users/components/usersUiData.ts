import type { ConfigCenterEmpresaMapUnit } from '../../../../api/configCenter';

export interface BusinessOption {
  id: string;
  name: string;
  unitId: string;
}

export interface BusinessUnitOption {
  id: string;
  name: string;
  businesses: BusinessOption[];
}

export interface ReportingUserOption {
  id: string;
  name: string;
  email: string;
  unitId: string;
  businessId: string;
}

export interface UserUiState {
  units: string[];
  businesses: string[];
  reportingUsers: string[];
  modules?: string[];
  role?: 'Super Admin' | 'Admin' | 'User';
  status?: 'active' | 'pending' | 'inactive';
  hidden?: boolean;
}

const fallbackBusinessUnits: BusinessUnitOption[] = [
  {
    id: 'unit-7',
    name: 'Unit 7',
    businesses: [
      { id: 'biz-7-operations', name: 'Operations', unitId: 'unit-7' },
      { id: 'biz-7-sales', name: 'Sales', unitId: 'unit-7' },
      { id: 'biz-7-logistics', name: 'Logistics', unitId: 'unit-7' },
    ],
  },
  {
    id: 'unit-8',
    name: 'Unit 8',
    businesses: [
      { id: 'biz-8-customer-service', name: 'Customer Service', unitId: 'unit-8' },
      { id: 'biz-8-technology', name: 'Technology', unitId: 'unit-8' },
      { id: 'biz-8-human-resources', name: 'Human Resources', unitId: 'unit-8' },
    ],
  },
  {
    id: 'unit-9',
    name: 'Unit 9',
    businesses: [
      { id: 'biz-9-quality-control', name: 'Quality Control', unitId: 'unit-9' },
      { id: 'biz-9-marketing', name: 'Marketing', unitId: 'unit-9' },
      { id: 'biz-9-finance', name: 'Finance', unitId: 'unit-9' },
    ],
  },
  {
    id: 'unit-10',
    name: 'Unit 10',
    businesses: [
      { id: 'biz-10-product-development', name: 'Product Development', unitId: 'unit-10' },
      { id: 'biz-10-legal', name: 'Legal', unitId: 'unit-10' },
    ],
  },
];

const fallbackReportingUsers: ReportingUserOption[] = [
  { id: 'user-1', name: 'Ana García', email: 'ana.garcia@empresa.com', unitId: 'unit-7', businessId: 'biz-7-operations' },
  { id: 'user-2', name: 'Pedro Martínez', email: 'pedro.martinez@empresa.com', unitId: 'unit-7', businessId: 'biz-7-operations' },
  { id: 'user-3', name: 'Laura Sánchez', email: 'laura.sanchez@empresa.com', unitId: 'unit-7', businessId: 'biz-7-sales' },
  { id: 'user-4', name: 'Diego Fernández', email: 'diego.fernandez@empresa.com', unitId: 'unit-7', businessId: 'biz-7-sales' },
  { id: 'user-5', name: 'Carmen López', email: 'carmen.lopez@empresa.com', unitId: 'unit-7', businessId: 'biz-7-logistics' },
  { id: 'user-6', name: 'Roberto Cruz', email: 'roberto.cruz@empresa.com', unitId: 'unit-8', businessId: 'biz-8-customer-service' },
  { id: 'user-7', name: 'Sofía Ramírez', email: 'sofia.ramirez@empresa.com', unitId: 'unit-8', businessId: 'biz-8-customer-service' },
  { id: 'user-8', name: 'Miguel Torres', email: 'miguel.torres@empresa.com', unitId: 'unit-8', businessId: 'biz-8-technology' },
  { id: 'user-9', name: 'Isabel Morales', email: 'isabel.morales@empresa.com', unitId: 'unit-8', businessId: 'biz-8-technology' },
  { id: 'user-10', name: 'Antonio Ruiz', email: 'antonio.ruiz@empresa.com', unitId: 'unit-9', businessId: 'biz-9-quality-control' },
  { id: 'user-11', name: 'Patricia Jiménez', email: 'patricia.jimenez@empresa.com', unitId: 'unit-9', businessId: 'biz-9-marketing' },
  { id: 'user-12', name: 'Francisco Vargas', email: 'francisco.vargas@empresa.com', unitId: 'unit-10', businessId: 'biz-10-product-development' },
];

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'item';

const dedupe = <T,>(items: T[]) => Array.from(new Set(items));

export function buildBusinessUnitsData(mapUnits?: ConfigCenterEmpresaMapUnit[]): BusinessUnitOption[] {
  if (!mapUnits || mapUnits.length === 0) {
    return fallbackBusinessUnits;
  }

  const mapped = mapUnits.map((unit, unitIndex) => {
    const unitId = unit.legacy_unit_id
      ? `unit-${unit.legacy_unit_id}`
      : `unit-${unitIndex + 1}-${slugify(unit.name)}`;
    const businesses = (unit.businesses ?? []).map((business, businessIndex) => ({
      id: business.legacy_business_id
        ? `business-${business.legacy_business_id}`
        : `business-${unitId}-${businessIndex + 1}-${slugify(business.name)}`,
      name: business.name,
      unitId,
    }));

    return {
      id: unitId,
      name: unit.name,
      businesses,
    };
  }).filter((unit) => unit.name.trim() !== '');

  if (mapped.length === 0) {
    return fallbackBusinessUnits;
  }

  return mapped;
}

export function buildReportingUsersData(businessUnits: BusinessUnitOption[]): ReportingUserOption[] {
  const source = businessUnits.length > 0 ? businessUnits : fallbackBusinessUnits;
  const businessIds = new Set(source.flatMap((unit) => unit.businesses.map((business) => business.id)));
  const matched = fallbackReportingUsers.filter((user) => businessIds.has(user.businessId));

  if (matched.length > 0) {
    return matched;
  }

  return fallbackReportingUsers;
}

function buildTemplateState(
  index: number,
  businessUnits: BusinessUnitOption[],
  reportingUsers: ReportingUserOption[],
): UserUiState {
  const allBusinesses = businessUnits.flatMap((unit) => unit.businesses);
  const firstUnit = businessUnits[0];
  const secondUnit = businessUnits[1];
  const thirdUnit = businessUnits[2] ?? firstUnit;

  if (index === 0) {
    const units = dedupe([firstUnit?.id, secondUnit?.id].filter(Boolean) as string[]);
    const businesses = allBusinesses
      .filter((business) => units.includes(business.unitId))
      .slice(0, 3)
      .map((business) => business.id);
    return {
      units,
      businesses,
      reportingUsers: reportingUsers.slice(0, 3).map((user) => user.id),
    };
  }

  if (index === 1) {
    const units = firstUnit ? [firstUnit.id] : [];
    const businesses = (firstUnit?.businesses ?? []).slice(0, 2).map((business) => business.id);
    return {
      units,
      businesses,
      reportingUsers: reportingUsers.slice(0, 2).map((user) => user.id),
    };
  }

  if (index === 2) {
    const units = thirdUnit ? [thirdUnit.id] : [];
    const businesses = (thirdUnit?.businesses ?? []).slice(0, 1).map((business) => business.id);
    return {
      units,
      businesses,
      reportingUsers: [],
    };
  }

  return {
    units: [],
    businesses: [],
    reportingUsers: [],
  };
}

export function ensureUserUiState(
  currentState: Record<string, UserUiState>,
  userIds: string[],
  businessUnits: BusinessUnitOption[],
  reportingUsers: ReportingUserOption[],
) {
  const nextState: Record<string, UserUiState> = {};
  let changed = false;

  userIds.forEach((userId, index) => {
    if (currentState[userId]) {
      nextState[userId] = currentState[userId];
      return;
    }

    nextState[userId] = buildTemplateState(index, businessUnits, reportingUsers);
    changed = true;
  });

  Object.keys(currentState).forEach((userId) => {
    if (!userIds.includes(userId)) {
      changed = true;
    }
  });

  return changed ? nextState : currentState;
}
