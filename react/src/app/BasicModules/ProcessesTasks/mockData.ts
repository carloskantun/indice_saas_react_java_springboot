export type AgendaStatus = 'En curso' | 'Pendiente' | 'En riesgo' | 'Completada';
export type AgendaPriority = 'Alta' | 'Media' | 'Baja';

export interface ProcessAgendaItem {
  id: number;
  title: string;
  owner: string;
  area: string;
  project: string;
  dueDate: string;
  startTime: string;
  duration: string;
  priority: AgendaPriority;
  status: AgendaStatus;
  location: string;
  blockers: string[];
  checklist: { label: string; done: boolean }[];
}

export const processAgendaItems: ProcessAgendaItem[] = [
  {
    id: 1,
    title: 'Revision diaria de backlog operativo',
    owner: 'Marta Ruiz',
    area: 'Operaciones',
    project: 'Sprint de integraciones',
    dueDate: 'Hoy',
    startTime: '08:30',
    duration: '45 min',
    priority: 'Alta',
    status: 'En curso',
    location: 'Sala Operativa',
    blockers: ['Falta confirmar prioridad de dos tickets de soporte'],
    checklist: [
      { label: 'Actualizar tareas vencidas', done: true },
      { label: 'Asignar responsables del dia', done: true },
      { label: 'Publicar riesgos en canal de seguimiento', done: false },
    ],
  },
  {
    id: 2,
    title: 'Seguimiento del proyecto de onboarding digital',
    owner: 'Jorge Herrera',
    area: 'Transformacion',
    project: 'Onboarding 2.0',
    dueDate: 'Hoy',
    startTime: '10:00',
    duration: '60 min',
    priority: 'Alta',
    status: 'Pendiente',
    location: 'Zoom',
    blockers: ['Diseño pendiente de aprobar por RH'],
    checklist: [
      { label: 'Revisar dependencias del flujo', done: true },
      { label: 'Confirmar fechas de QA', done: false },
      { label: 'Alinear mensaje de lanzamiento', done: false },
    ],
  },
  {
    id: 3,
    title: 'Cierre semanal de pendientes administrativos',
    owner: 'Sofia Campos',
    area: 'Administracion',
    project: 'Control semanal',
    dueDate: '26 Mar',
    startTime: '12:00',
    duration: '30 min',
    priority: 'Media',
    status: 'Completada',
    location: 'Backoffice',
    blockers: [],
    checklist: [
      { label: 'Cruce de pendientes abiertos', done: true },
      { label: 'Envio de resumen al liderazgo', done: true },
      { label: 'Registro en tablero maestro', done: true },
    ],
  },
  {
    id: 4,
    title: 'Ajuste del flujo de aprobaciones de compras',
    owner: 'Carlos Ibarra',
    area: 'Finanzas',
    project: 'Gobierno de compras',
    dueDate: '27 Mar',
    startTime: '14:00',
    duration: '90 min',
    priority: 'Alta',
    status: 'En riesgo',
    location: 'Comite de compras',
    blockers: ['Proveedor aun no comparte tiempos de respuesta'],
    checklist: [
      { label: 'Documentar cambio de politica', done: true },
      { label: 'Validar firmas necesarias', done: false },
      { label: 'Actualizar manual operativo', done: false },
    ],
  },
  {
    id: 5,
    title: 'Revision quincenal de KPIs de servicio',
    owner: 'Daniela Solis',
    area: 'Servicio',
    project: 'Ritual de desempeno',
    dueDate: '28 Mar',
    startTime: '09:00',
    duration: '45 min',
    priority: 'Media',
    status: 'Pendiente',
    location: 'Sala Norte',
    blockers: [],
    checklist: [
      { label: 'Consolidar metricas', done: true },
      { label: 'Preparar desvio por area', done: false },
      { label: 'Definir acciones correctivas', done: false },
    ],
  },
  {
    id: 6,
    title: 'Liberacion del proceso de mantenimiento preventivo',
    owner: 'Luis Mejia',
    area: 'Mantenimiento',
    project: 'Preventivos Q2',
    dueDate: '29 Mar',
    startTime: '16:00',
    duration: '75 min',
    priority: 'Baja',
    status: 'En curso',
    location: 'Planta 2',
    blockers: ['Esperando confirmacion del calendario de unidades'],
    checklist: [
      { label: 'Cargar checklist tecnico', done: true },
      { label: 'Asignar tecnicos por turno', done: false },
      { label: 'Publicar ventana de mantenimiento', done: false },
    ],
  },
];

export type ProjectStatus = 'En ejecucion' | 'En riesgo' | 'Planeacion' | 'Cerrado';

export interface ProjectMilestone {
  id: number;
  name: string;
  dueDate: string;
  owner: string;
  status: 'Listo' | 'En curso' | 'Pendiente';
}

export interface ProcessProject {
  id: number;
  name: string;
  owner: string;
  area: string;
  progress: number;
  status: ProjectStatus;
  budget: number;
  spent: number;
  team: number;
  dueDate: string;
  priority: AgendaPriority;
  summary: string;
  nextDeliverable: string;
  risks: string[];
  milestones: ProjectMilestone[];
}

export const processProjects: ProcessProject[] = [
  {
    id: 1,
    name: 'Onboarding 2.0',
    owner: 'Jorge Herrera',
    area: 'Transformacion',
    progress: 74,
    status: 'En ejecucion',
    budget: 320000,
    spent: 241500,
    team: 8,
    dueDate: '18 Abr',
    priority: 'Alta',
    summary: 'Estandariza el ingreso de nuevos colaboradores con tareas, firmas y capacitacion digital.',
    nextDeliverable: 'Validacion final del flujo de documentos y accesos.',
    risks: ['Pendiente aprobacion visual del correo de bienvenida', 'Falta definir tutorial corto para lideres'],
    milestones: [
      { id: 11, name: 'Mapa de journey aprobado', dueDate: '25 Mar', owner: 'Producto', status: 'Listo' },
      { id: 12, name: 'QA del flujo automatizado', dueDate: '02 Abr', owner: 'Tecnologia', status: 'En curso' },
      { id: 13, name: 'Lanzamiento interno', dueDate: '18 Abr', owner: 'RH', status: 'Pendiente' },
    ],
  },
  {
    id: 2,
    name: 'Gobierno de compras',
    owner: 'Carlos Ibarra',
    area: 'Finanzas',
    progress: 49,
    status: 'En riesgo',
    budget: 180000,
    spent: 119000,
    team: 5,
    dueDate: '11 Abr',
    priority: 'Alta',
    summary: 'Reduce tiempos de autorizacion y mejora trazabilidad de requisiciones criticas.',
    nextDeliverable: 'Matriz final de aprobadores por monto y tipo de gasto.',
    risks: ['Proveedor externo no confirma SLA', 'Dos unidades siguen usando el flujo anterior'],
    milestones: [
      { id: 21, name: 'Politica unificada', dueDate: '21 Mar', owner: 'Finanzas', status: 'Listo' },
      { id: 22, name: 'Entrenamiento a jefaturas', dueDate: '31 Mar', owner: 'Compras', status: 'En curso' },
      { id: 23, name: 'Activacion en todas las unidades', dueDate: '11 Abr', owner: 'Operaciones', status: 'Pendiente' },
    ],
  },
  {
    id: 3,
    name: 'Preventivos Q2',
    owner: 'Luis Mejia',
    area: 'Mantenimiento',
    progress: 61,
    status: 'En ejecucion',
    budget: 250000,
    spent: 132000,
    team: 6,
    dueDate: '30 Abr',
    priority: 'Media',
    summary: 'Programa y coordina mantenimientos preventivos sin interrumpir la operacion diaria.',
    nextDeliverable: 'Calendario final por unidad y ventana operativa.',
    risks: ['Capacidad limitada en turno nocturno'],
    milestones: [
      { id: 31, name: 'Inventario tecnico consolidado', dueDate: '19 Mar', owner: 'Almacen', status: 'Listo' },
      { id: 32, name: 'Asignacion de cuadrillas', dueDate: '01 Abr', owner: 'Mantenimiento', status: 'En curso' },
      { id: 33, name: 'Inicio de ronda Q2', dueDate: '08 Abr', owner: 'Operaciones', status: 'Pendiente' },
    ],
  },
  {
    id: 4,
    name: 'Ritual de desempeno',
    owner: 'Daniela Solis',
    area: 'Servicio',
    progress: 33,
    status: 'Planeacion',
    budget: 90000,
    spent: 22000,
    team: 4,
    dueDate: '09 May',
    priority: 'Media',
    summary: 'Crea una rutina operativa para revisar KPIs semanales, acciones y responsables.',
    nextDeliverable: 'Tablero consolidado con acuerdos por celula.',
    risks: ['Falta definir esquema de escalamiento'],
    milestones: [
      { id: 41, name: 'Definicion de metricas por equipo', dueDate: '29 Mar', owner: 'Servicio', status: 'En curso' },
      { id: 42, name: 'Piloto en dos unidades', dueDate: '17 Abr', owner: 'Calidad', status: 'Pendiente' },
      { id: 43, name: 'Cierre y ajustes', dueDate: '09 May', owner: 'Direccion', status: 'Pendiente' },
    ],
  },
];

export type ProcessStatus = 'Estable' | 'En seguimiento' | 'Critico';
export type ProcessAutomation = 'Manual' | 'Mixto' | 'Automatizado';
export type ProcessFrequency = 'Diario' | 'Semanal' | 'Quincenal' | 'Mensual';

export interface ProcessStep {
  id: number;
  name: string;
  owner: string;
  sla: string;
  complete: boolean;
}

export interface RecurringProcess {
  id: number;
  name: string;
  area: string;
  owner: string;
  frequency: ProcessFrequency;
  status: ProcessStatus;
  automation: ProcessAutomation;
  compliance: number;
  lastRun: string;
  nextRun: string;
  bottleneck: string;
  description: string;
  steps: ProcessStep[];
}

export const recurringProcesses: RecurringProcess[] = [
  {
    id: 1,
    name: 'Aprobacion diaria de requisiciones',
    area: 'Compras',
    owner: 'Carlos Ibarra',
    frequency: 'Diario',
    status: 'En seguimiento',
    automation: 'Mixto',
    compliance: 86,
    lastRun: '25 Mar 18:00',
    nextRun: '26 Mar 18:00',
    bottleneck: 'Se acumulan aprobaciones fuera de horario en dos unidades.',
    description: 'Proceso que centraliza revisiones, validaciones presupuestales y liberacion a compras.',
    steps: [
      { id: 11, name: 'Recepcion de requisiciones', owner: 'Analista', sla: '2 h', complete: true },
      { id: 12, name: 'Revision presupuestal', owner: 'Finanzas', sla: '4 h', complete: true },
      { id: 13, name: 'Aprobacion final', owner: 'Gerencia', sla: '6 h', complete: false },
    ],
  },
  {
    id: 2,
    name: 'Cierre semanal de pendientes',
    area: 'Administracion',
    owner: 'Sofia Campos',
    frequency: 'Semanal',
    status: 'Estable',
    automation: 'Automatizado',
    compliance: 96,
    lastRun: '22 Mar 17:30',
    nextRun: '29 Mar 17:30',
    bottleneck: 'Sin bloqueos criticos, solo seguimiento de excepciones.',
    description: 'Consolida pendientes, genera resumen ejecutivo y actualiza backlog maestro.',
    steps: [
      { id: 21, name: 'Extraccion de pendientes', owner: 'Sistema', sla: '15 min', complete: true },
      { id: 22, name: 'Clasificacion por area', owner: 'Backoffice', sla: '1 h', complete: true },
      { id: 23, name: 'Envio de resumen', owner: 'Administracion', sla: '30 min', complete: true },
    ],
  },
  {
    id: 3,
    name: 'Revision de mantenimiento preventivo',
    area: 'Mantenimiento',
    owner: 'Luis Mejia',
    frequency: 'Quincenal',
    status: 'Critico',
    automation: 'Manual',
    compliance: 68,
    lastRun: '15 Mar 09:00',
    nextRun: '30 Mar 09:00',
    bottleneck: 'No hay capacidad suficiente para cubrir todos los equipos en una sola ventana.',
    description: 'Asegura inspecciones, programacion de cuadrillas y cierre de hallazgos tecnicos.',
    steps: [
      { id: 31, name: 'Inspeccion inicial', owner: 'Tecnico lider', sla: '1 dia', complete: true },
      { id: 32, name: 'Asignacion de cuadrillas', owner: 'Coordinacion', sla: '4 h', complete: false },
      { id: 33, name: 'Liberacion del reporte', owner: 'Supervision', sla: '6 h', complete: false },
    ],
  },
  {
    id: 4,
    name: 'Ritual quincenal de KPIs',
    area: 'Servicio',
    owner: 'Daniela Solis',
    frequency: 'Quincenal',
    status: 'En seguimiento',
    automation: 'Mixto',
    compliance: 81,
    lastRun: '14 Mar 11:00',
    nextRun: '28 Mar 11:00',
    bottleneck: 'Aun no se estandariza el formato de acciones correctivas.',
    description: 'Revisa tendencias, acuerdos y responsables de metricas de servicio.',
    steps: [
      { id: 41, name: 'Consolidar datos', owner: 'Analitica', sla: '2 h', complete: true },
      { id: 42, name: 'Sesion de revision', owner: 'Lideres', sla: '1 h', complete: false },
      { id: 43, name: 'Seguimiento de acuerdos', owner: 'PMO', sla: '48 h', complete: false },
    ],
  },
];

export type KPIStatus = 'Sobre meta' | 'En rango' | 'Atencion';

export interface ProcessKPI {
  id: string;
  title: string;
  area: string;
  current: number;
  target: number;
  unit: string;
  trend: string;
  direction: 'up' | 'down';
  status: KPIStatus;
  summary: string;
}

export const processKpis: ProcessKPI[] = [
  {
    id: 'task-completion',
    title: 'Cierre de tareas semanales',
    area: 'Operacion',
    current: 91,
    target: 88,
    unit: '%',
    trend: '+6 pts vs semana anterior',
    direction: 'up',
    status: 'Sobre meta',
    summary: 'Las celulas estan cerrando tareas priorizadas por encima del objetivo definido.',
  },
  {
    id: 'sla-approval',
    title: 'Cumplimiento SLA de aprobaciones',
    area: 'Compras',
    current: 82,
    target: 90,
    unit: '%',
    trend: '-4 pts por bloqueos de firmas',
    direction: 'down',
    status: 'Atencion',
    summary: 'Las autorizaciones de requisiciones urgentes estan fuera del SLA esperado.',
  },
  {
    id: 'cycle-time',
    title: 'Tiempo promedio de ciclo',
    area: 'Transformacion',
    current: 4.8,
    target: 5.5,
    unit: ' dias',
    trend: '-0.7 dias en el ultimo corte',
    direction: 'up',
    status: 'Sobre meta',
    summary: 'Los flujos priorizados estan completando etapas mas rapido que el objetivo.',
  },
  {
    id: 'risk-incidents',
    title: 'Procesos con incidencias criticas',
    area: 'Operacion',
    current: 3,
    target: 2,
    unit: '',
    trend: '+1 incidente abierto',
    direction: 'down',
    status: 'Atencion',
    summary: 'Se mantienen focos rojos en mantenimiento y aprobaciones especiales.',
  },
  {
    id: 'automation-rate',
    title: 'Nivel de automatizacion',
    area: 'PMO',
    current: 64,
    target: 70,
    unit: '%',
    trend: '+5 pts desde febrero',
    direction: 'up',
    status: 'En rango',
    summary: 'La cobertura automatizada sigue creciendo, aunque aun hay procesos manuales criticos.',
  },
  {
    id: 'meeting-discipline',
    title: 'Disciplina de rituales operativos',
    area: 'Servicio',
    current: 87,
    target: 85,
    unit: '%',
    trend: '+3 pts en asistencia y acuerdos',
    direction: 'up',
    status: 'Sobre meta',
    summary: 'Las sesiones de seguimiento se estan ejecutando con mayor consistencia.',
  },
];

export type OrgLevel = 'Direccion' | 'Coordinacion' | 'Operacion';

export interface OrgNode {
  id: number;
  name: string;
  role: string;
  area: string;
  level: OrgLevel;
  lead: string;
  people: number;
  location: string;
  focus: string;
  directReports: number;
  activeProjects: number;
  responsibilities: string[];
}

export const processOrgNodes: OrgNode[] = [
  {
    id: 1,
    name: 'Oficina de Operaciones',
    role: 'Direccion de Procesos',
    area: 'Direccion',
    level: 'Direccion',
    lead: 'Andrea Molina',
    people: 12,
    location: 'Corporativo',
    focus: 'Define prioridades, gobierno operativo y escalamiento de riesgos.',
    directReports: 4,
    activeProjects: 6,
    responsibilities: ['Prioridades trimestrales', 'Rituales ejecutivos', 'Remocion de bloqueos criticos'],
  },
  {
    id: 2,
    name: 'PMO de Transformacion',
    role: 'Coordinacion',
    area: 'Transformacion',
    level: 'Coordinacion',
    lead: 'Jorge Herrera',
    people: 7,
    location: 'Corporativo',
    focus: 'Coordina proyectos transversales y dependencias entre areas.',
    directReports: 2,
    activeProjects: 4,
    responsibilities: ['Roadmap de proyectos', 'Seguimiento de hitos', 'Priorizacion de backlog'],
  },
  {
    id: 3,
    name: 'Mesa de Compras',
    role: 'Coordinacion',
    area: 'Compras',
    level: 'Coordinacion',
    lead: 'Carlos Ibarra',
    people: 5,
    location: 'Monterrey',
    focus: 'Administra aprobaciones, proveedores y reglas de control.',
    directReports: 2,
    activeProjects: 2,
    responsibilities: ['SLA de requisiciones', 'Gobierno de compras', 'Gestion de proveedores'],
  },
  {
    id: 4,
    name: 'Celula de Servicio',
    role: 'Coordinacion',
    area: 'Servicio',
    level: 'Coordinacion',
    lead: 'Daniela Solis',
    people: 6,
    location: 'Queretaro',
    focus: 'Gestiona rituales de desempeno, acuerdos y planes correctivos.',
    directReports: 3,
    activeProjects: 3,
    responsibilities: ['KPIs semanales', 'Seguimiento de acuerdos', 'Escalamiento de hallazgos'],
  },
  {
    id: 5,
    name: 'Backoffice Administrativo',
    role: 'Operacion',
    area: 'Administracion',
    level: 'Operacion',
    lead: 'Sofia Campos',
    people: 9,
    location: 'Guadalajara',
    focus: 'Ejecuta cierres, tableros y control de pendientes semanales.',
    directReports: 0,
    activeProjects: 1,
    responsibilities: ['Cierres semanales', 'Seguimiento documental', 'Actualizacion de tablero maestro'],
  },
  {
    id: 6,
    name: 'Cuadrillas Preventivas',
    role: 'Operacion',
    area: 'Mantenimiento',
    level: 'Operacion',
    lead: 'Luis Mejia',
    people: 11,
    location: 'Saltillo',
    focus: 'Ejecuta inspecciones, mantenimientos y liberaciones tecnicas.',
    directReports: 0,
    activeProjects: 2,
    responsibilities: ['Inspecciones quincenales', 'Programacion de cuadrillas', 'Cierre de incidencias tecnicas'],
  },
  {
    id: 7,
    name: 'Equipo de Soporte de Procesos',
    role: 'Operacion',
    area: 'Transformacion',
    level: 'Operacion',
    lead: 'Marta Ruiz',
    people: 8,
    location: 'Remoto',
    focus: 'Monitorea tableros, actualiza tareas y acompana despliegues operativos.',
    directReports: 0,
    activeProjects: 5,
    responsibilities: ['Monitoreo diario', 'Documentacion de cambios', 'Soporte de lanzamientos'],
  },
];

export interface OrgCollaborator {
  id: number;
  name: string;
  role: string;
  title: string;
  area: string;
  location: string;
  responsibilities: string[];
}

export interface OrgChartAssignment {
  collaboratorId: number;
  managerId: number | null;
}

export const processOrgCollaborators: OrgCollaborator[] = [
  {
    id: 1,
    name: 'Andrea Molina',
    role: 'Director General',
    title: 'CEO',
    area: 'Direccion',
    location: 'Corporativo',
    responsibilities: ['Vision general del sistema', 'Aprobacion de prioridades', 'Direccion ejecutiva'],
  },
  {
    id: 2,
    name: 'Marta Ruiz',
    role: 'Director Operaciones',
    title: 'COO',
    area: 'Operaciones',
    location: 'Corporativo',
    responsibilities: ['Rituales operativos', 'Ejecucion interequipos', 'Seguimiento de backlog'],
  },
  {
    id: 3,
    name: 'Carlos Ibarra',
    role: 'Director Finanzas',
    title: 'CFO',
    area: 'Finanzas',
    location: 'Monterrey',
    responsibilities: ['Control presupuestal', 'Aprobaciones criticas', 'Gobierno financiero'],
  },
  {
    id: 4,
    name: 'Luis Mejia',
    role: 'Jefe Almacen',
    title: 'Jefe',
    area: 'Operaciones',
    location: 'Saltillo',
    responsibilities: ['Inventario operativo', 'Recepcion de insumos', 'Coordinacion de cuadrillas'],
  },
  {
    id: 5,
    name: 'Jorge Herrera',
    role: 'Jefe Compras',
    title: 'Jefe',
    area: 'Compras',
    location: 'Monterrey',
    responsibilities: ['Compras estrategicas', 'Proveedores', 'Aprobaciones de requisiciones'],
  },
  {
    id: 6,
    name: 'Sofia Campos',
    role: 'Contador',
    title: 'Contador',
    area: 'Finanzas',
    location: 'Guadalajara',
    responsibilities: ['Cierres semanales', 'Revision de documentos', 'Control contable'],
  },
  {
    id: 7,
    name: 'Ana Garcia',
    role: 'Supervisor',
    title: 'Supervisor',
    area: 'Servicio',
    location: 'Queretaro',
    responsibilities: ['Seguimiento de incidencias', 'Cobertura de turnos', 'Reportes diarios'],
  },
  {
    id: 8,
    name: 'Carlos Lopez',
    role: 'Analista de procesos',
    title: 'Analista',
    area: 'Transformacion',
    location: 'Remoto',
    responsibilities: ['Mapeo de flujos', 'Documentacion de hallazgos', 'Soporte a despliegues'],
  },
  {
    id: 9,
    name: 'Maria Rodriguez',
    role: 'Coordinadora PMO',
    title: 'Coordinador',
    area: 'Transformacion',
    location: 'Corporativo',
    responsibilities: ['Seguimiento de hitos', 'Control de dependencias', 'Comunicacion ejecutiva'],
  },
  {
    id: 10,
    name: 'Daniela Solis',
    role: 'Lider de servicio',
    title: 'Lider',
    area: 'Servicio',
    location: 'Queretaro',
    responsibilities: ['KPIs semanales', 'Planes correctivos', 'Escalamiento de hallazgos'],
  },
];

export const defaultProcessOrgChartAssignments: OrgChartAssignment[] = [
  { collaboratorId: 1, managerId: null },
  { collaboratorId: 2, managerId: 1 },
  { collaboratorId: 3, managerId: 1 },
  { collaboratorId: 4, managerId: 2 },
  { collaboratorId: 5, managerId: 2 },
  { collaboratorId: 6, managerId: 3 },
];
