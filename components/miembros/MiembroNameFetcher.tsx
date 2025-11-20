// components/miembros/MiembroNameFetcher.tsx (Reutilizado para Líder)
import React, { useState, useEffect } from 'react';
import { MiembroServices } from '@/services/MiembroService';
import { FaUserShield } from 'react-icons/fa';

interface MiembroNameFetcherProps {
  miembroId: string | null | undefined;
  role: 'Líder' | 'Miembro';
}

const MiembroNameFetcher: React.FC<MiembroNameFetcherProps> = ({ miembroId, role }) => {
  const [name, setName] = useState('Cargando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validId = miembroId?.trim();

    if (!validId) {
      setName('Sin Asignar');
      setLoading(false);
      return;
    }

    const fetchMiembro = async () => {
      setLoading(true);
      setName('Buscando...');
      try {
        const miembro = await MiembroServices.getById(validId);
        setName(`${miembro.nombres} ${miembro.apellidos}`);
      } catch (error) {
        setName(`${role} (ID inválido)`);
      } finally {
        setLoading(false);
      }
    };

    fetchMiembro();
  }, [miembroId, role]);

  const textColor = miembroId ? 'text-blue-700 font-semibold' : 'text-gray-500 italic';
  const Icon = role === 'Líder' ? FaUserShield : FaUserShield; // Usamos FaUserShield para Líder

  return (
    <span className={`flex items-center space-x-2 text-sm ${textColor}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{loading ? 'Cargando...' : name}</span>
    </span>
  );
};

export default MiembroNameFetcher;