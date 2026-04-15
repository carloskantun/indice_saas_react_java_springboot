export interface RecordEmployeeOption {
  id: string;
  name: string;
  position: string;
  department: string;
}

export const mockEmployees: RecordEmployeeOption[] = [
  { id: 'emp-001', name: 'Juan Perez', position: 'Production Manager', department: 'Operations' },
  { id: 'emp-002', name: 'Maria Garcia', position: 'Sales Supervisor', department: 'Sales' },
  { id: 'emp-003', name: 'Carlos Lopez', position: 'Warehouse Technician', department: 'Logistics' },
  { id: 'emp-004', name: 'Ana Martinez', position: 'Customer Service Rep', department: 'Customer Service' },
  { id: 'emp-005', name: 'Luis Torres', position: 'IT Coordinator', department: 'Technology' },
  { id: 'emp-006', name: 'Sandra Ramirez', position: 'HR Assistant', department: 'Human Resources' },
  { id: 'emp-007', name: 'Miguel Hernandez', position: 'Quality Analyst', department: 'Quality Control' },
  { id: 'emp-008', name: 'Laura Sanchez', position: 'Marketing Specialist', department: 'Marketing' },
];
