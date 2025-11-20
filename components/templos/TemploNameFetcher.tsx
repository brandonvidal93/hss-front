import React, { useState, useEffect } from 'react';
import { TemploServices } from '@/services/TemploService'; // Asegúrate que la ruta sea correcta
import { FaChurch } from 'react-icons/fa';

interface TemploNameFetcherProps {
  temploId: string | null | undefined; // El ID del templo al que está asignado el pastor
}

const TemploNameFetcher: React.FC<TemploNameFetcherProps> = ({ temploId }) => {
  const [temploName, setTemploName] = useState('Cargando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validTemploId = temploId?.trim();

    if (!validTemploId) {
      setTemploName('Sin Asignar');
      setLoading(false);
      return;
    }

    const fetchTemplo = async () => {
      setLoading(true);
      try {
        const templo = await TemploServices.getById(validTemploId);
        setTemploName(templo.nombre);
      } catch (error) {
        setTemploName('Templo No Encontrado' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplo();
  }, [temploId]);

  const textColor = temploId ? 'text-indigo-700' : 'text-gray-500 italic';

  return (
    <span className={`flex items-center space-x-2 text-sm ${textColor}`}>
      <FaChurch className="w-4 h-4 flex-shrink-0" />
      <span>{loading ? 'Cargando...' : temploName}</span>
    </span>
  );
};

export default TemploNameFetcher;