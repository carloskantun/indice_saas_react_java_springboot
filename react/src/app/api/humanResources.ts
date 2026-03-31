import { apiClient } from '../lib/apiClient';
import { endpoints } from './endpoints';

export interface BackendEmployee {
  id: number;
  full_name: string;
  email: string;
  employee_number?: string;
  status: string;
  position_title?: string;
  department?: string;
  phone?: string;
  hire_date?: string | null;
  salary?: number;
}

interface EmployeesListResponse {
  items: BackendEmployee[];
  count: number;
  summary: {
    total_count: number;
    total_payroll_amount_monthly: number;
  };
}

export const humanResourcesApi = {
  listEmployees() {
    return apiClient<EmployeesListResponse>(endpoints.humanResources.employeesList);
  },

  createEmployee(payload: Record<string, unknown>) {
    return apiClient<BackendEmployee>(endpoints.humanResources.employeeCreate, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateEmployee(id: string | number, payload: Record<string, unknown>) {
    return apiClient<BackendEmployee>(`${endpoints.humanResources.employeeUpdate}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteEmployee(id: string | number) {
    return apiClient<{ success: boolean }>(`${endpoints.humanResources.employeeDelete}/${id}`, {
      method: 'DELETE',
    });
  },

  terminateEmployee(id: string | number) {
    return apiClient<{ success: boolean }>(`${endpoints.humanResources.employeeTerminate}/${id}/terminate`, {
      method: 'POST',
    });
  },
};
