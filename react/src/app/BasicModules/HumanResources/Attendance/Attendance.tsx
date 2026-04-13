import Asistencia from '../Asistencia/Asistencia';

/**
 * Legacy compatibility wrapper.
 * The routed HR shell should use the backend-connected attendance module.
 */
export default function Attendance() {
  return <Asistencia />;
}
