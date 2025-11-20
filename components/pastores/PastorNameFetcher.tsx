import React, { useState, useEffect } from 'react';
import { PastorServices } from '@/services/PastorService';
import { FaUserCircle } from 'react-icons/fa';

interface PastorNameFetcherProps {
  pastorId: string | undefined; // Puede que no haya pastor asignado
}

const PastorNameFetcher: React.FC<PastorNameFetcherProps> = ({ pastorId }) => {
  const [pastorName, setPastorName] = useState('Cargando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pastorId) {
      setPastorName('No Asignado');
      setLoading(false);
      return;
    }

    const fetchPastor = async () => {
      setLoading(true);
      try {
        // En un caso real, la API de Templos debería optimizarse para incluir el nombre del pastor.
        // Pero, dado el diseño actual, hacemos una llamada individual.
        const pastor = await PastorServices.getById(pastorId);
        setPastorName(`${pastor.nombre} ${pastor.apellido}`); // Asumiendo que Pastor tiene nombre y apellido
      } catch (error) {
        setPastorName('Error/Pastor Eliminado' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchPastor();
  }, [pastorId]);

  return (
    <span className={`flex items-center space-x-2 ${!pastorId ? 'text-gray-500' : 'text-indigo-700 font-semibold'}`}>
      <FaUserCircle className="w-4 h-4" />
      <span>{loading ? 'Cargando...' : pastorName}</span>
    </span>
  );
};

export default PastorNameFetcher;