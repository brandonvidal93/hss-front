// app/comites/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaListCheck } from 'react-icons/fa6';
import ComiteList from '@/components/comites/ComiteList';
import ComiteForm from '@/components/comites/ComiteForm';
import { ComiteServices } from '@/services/ComiteService';
import { Comite } from '../../types/Comite';

type ViewMode = 'list' | 'create' | 'edit';

export default function ComitesPage() {
  const [comiteData, setComiteData] = useState<Comite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('list');
  const [selectedComite, setSelectedComite] = useState<Comite | null>(null);

  // Función para obtener todos los comités
  const fetchComites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ComiteServices.getAll();
      setComiteData(data);
    } catch (err) {
      setError('Error al cargar la lista de comités.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComites();
  }, [fetchComites]);

  // Maneja la acción de edición
  const handleEdit = (comite: Comite) => {
    setSelectedComite(comite);
    setMode('edit');
  };

  // Maneja el éxito de un formulario (crear/editar)
  const handleSuccess = () => {
    setMode('list');
    setSelectedComite(null);
    fetchComites();
  };

  // Maneja la eliminación
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este comité?')) {
      try {
        await ComiteServices.delete(id);
        fetchComites(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el comité. Podría estar asignado a otros elementos.' + err);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <FaListCheck className="w-8 h-8 mr-3 text-indigo-600" />
          Gestión de Comités
        </h1>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Nuevo Comité
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
        <ComiteList
          data={comiteData}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {(mode === 'create' || mode === 'edit') && (
        <ComiteForm
          comiteToEdit={selectedComite}
          onSuccess={handleSuccess}
          onCancel={() => setMode('list')}
        />
      )}
    </div>
  );
}