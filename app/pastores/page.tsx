'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaUsers } from 'react-icons/fa';
import PastorList from '@/components/pastores/PastorList';
import PastorForm from '@/components/pastores/PastorForm';
import { PastorServices } from '@/services/PastorService';
import { Pastor } from '../../types/Pastor';

type ViewMode = 'list' | 'create' | 'edit';

export default function PastoresPage() {
  const [pastorData, setPastorData] = useState<Pastor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('list');
  const [selectedPastor, setSelectedPastor] = useState<Pastor | null>(null);

  // Función para obtener todos los pastores
  const fetchPastores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PastorServices.getAll();
      setPastorData(data);
    } catch (err) {
      setError('Error al cargar la lista de pastores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPastores();
  }, [fetchPastores]);

  // Maneja la acción de edición
  const handleEdit = (pastor: Pastor) => {
    setSelectedPastor(pastor);
    setMode('edit');
  };

  // Maneja el éxito de un formulario (crear/editar)
  const handleSuccess = () => {
    setMode('list');
    setSelectedPastor(null);
    fetchPastores();
  };

  // Maneja la eliminación
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este pastor?')) {
      try {
        await PastorServices.delete(id);
        fetchPastores(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el pastor. Asegúrese de que no esté asignado a un templo.' + err);
      }
    }
  };

  return (
    <div className="p-2 sm:p-3 lg:p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <FaUsers className="w-8 h-8 mr-3 text-indigo-600" />
          Gestión de Pastores
        </h1>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Nuevo Pastor
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Vistas Condicionales */}
      {mode === 'list' && (
        <PastorList
          data={pastorData}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {(mode === 'create' || mode === 'edit') && (
        <PastorForm
          pastorToEdit={selectedPastor} // Será null en modo 'create'
          onSuccess={handleSuccess}
          onCancel={() => setMode('list')}
        />
      )}
    </div>
  );
}