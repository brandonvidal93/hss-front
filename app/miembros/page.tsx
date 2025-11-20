'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaUsers } from 'react-icons/fa';
import MiembroList from '../../components/miembros/MiembroList'; 
import MiembroForm from '../../components/miembros/MiembroForm'; 
import { MiembroServices } from '@/services/MiembroService';
import { Miembro } from '../../types/Miembro';

type ViewMode = 'list' | 'create' | 'edit';

export default function MiembrosPage() {
  const [miembroData, setMiembroData] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('list');
  const [selectedMiembro, setSelectedMiembro] = useState<Miembro | null>(null);

  const fetchMiembros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MiembroServices.getAll();
      setMiembroData(data);
    } catch (err) {
      setError('Error al cargar la lista de miembros.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMiembros();
  }, [fetchMiembros]);

  // Maneja la acción de edición
  const handleEdit = (miembro: Miembro) => {
    setSelectedMiembro(miembro);
    setMode('edit');
  };

  // Maneja el éxito de un formulario (crear/editar)
  const handleSuccess = () => {
    setMode('list');
    setSelectedMiembro(null);
    fetchMiembros();
  };

  // Maneja la eliminación
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este miembro?')) {
      try {
        await MiembroServices.delete(id);
        fetchMiembros(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el miembro. Intentelo de nuevo.' + err);
      }
    }
  };

  return (
    <div className="p-2 sm:p-3 lg:p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <FaUsers className="w-8 h-8 mr-3 text-indigo-600" />
          Gestión de Miembros
        </h1>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Nuevo Miembro
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
        <MiembroList
          data={miembroData}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {(mode === 'create' || mode === 'edit') && (
        <MiembroForm
          miembroToEdit={selectedMiembro} 
          onSuccess={handleSuccess}
          onCancel={() => setMode('list')}
        />
      )}
    </div>
  );
}