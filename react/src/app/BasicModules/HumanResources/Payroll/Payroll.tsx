import { NominasTab } from '../../../components/rh/NominasTab';
import { rhColaboradores } from '../mockData';

export default function Payroll() {
  return <NominasTab colaboradores={rhColaboradores} />;
}
