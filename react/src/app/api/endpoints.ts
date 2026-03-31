export const endpoints = {
  auth: {
    login: '/api/v1/auth/login',
    logout: '/api/v1/auth/logout',
    me: '/api/v1/auth/me',
  },
  dashboard: {
    modules: '/api/v1/modules',
    units: '/api/v1/org/units',
    businesses: '/api/v1/org/businesses',
  },
  configCenter: {
    currentUser: '/api/v1/config-center/current-user',
    users: '/api/v1/config-center/users',
    empresa: '/api/v1/config-center/company',
    config: '/api/v1/config-center/config',
    saveConfig: '/api/v1/config-center/business-structure',
    saveEmpresa: '/api/v1/config-center/company',
  },
  humanResources: {
    employeesList: '/api/v1/hr/employees',
    employeeCreate: '/api/v1/hr/employees',
    employeeUpdate: '/api/v1/hr/employees',
    employeeDelete: '/api/v1/hr/employees',
    employeeTerminate: '/api/v1/hr/employees',
  },
} as const;
