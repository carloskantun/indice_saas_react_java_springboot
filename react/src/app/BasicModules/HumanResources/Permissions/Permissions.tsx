import { useState } from 'react';
import { PermisosTab } from '../../../components/rh/PermisosTab';
import { SolicitarPermisoModal } from '../../../components/SolicitarPermisoModal';
import { rhColaboradores } from '../mockData';

export default function Permissions() {
  const [isSolicitarModalOpen, setIsSolicitarModalOpen] = useState(false);

  return (
    <>
      <PermisosTab onSolicitarPermiso={() => setIsSolicitarModalOpen(true)} />
      <SolicitarPermisoModal
        isOpen={isSolicitarModalOpen}
        onClose={() => setIsSolicitarModalOpen(false)}
        onSave={() => undefined}
        colaboradores={rhColaboradores.map(({ id, nombre, puesto }) => ({
          id,
          nombre,
          puesto,
        }))}
      />
    </>
  );
}
