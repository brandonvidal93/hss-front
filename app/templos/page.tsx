'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaChurch } from 'react-icons/fa';
import TemploList from '@/components/templos/TemploList';
import TemploForm from '@/components/templos/TemploForm';
import { TemploServices } from '@/services/TemploService';
import { Templo } from '../../types/Templo';

// Definimos los modos de la vista
type ViewMode = 'list' | 'create' | 'edit';

export default function TemplosPage() {
  const [temploData, setTemploData] = useState<Templo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar la vista actual: 'list', 'create', o 'edit'
  const [mode, setMode] = useState<ViewMode>('list');

  // Estado para almacenar el templo seleccionado para editar
  const [selectedTemplo, setSelectedTemplo] = useState<Templo | null>(null);

  // Función para obtener todos los templos
  const fetchTemplos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TemploServices.getAll();
      setTemploData(data);
    } catch (err) {
      setError('Error al cargar la lista de templos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplos();
  }, [fetchTemplos]);

  // Maneja la acción de edición
  const handleEdit = (templo: Templo) => {
    setSelectedTemplo(templo);
    setMode('edit');
  };

  // Maneja la acción de completar un formulario (crear/editar)
  const handleSuccess = () => {
    // Volver a la lista y recargar los datos
    setMode('list');
    setSelectedTemplo(null);
    fetchTemplos();
  };

  // Maneja la eliminación
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este templo?')) {
      try {
        await TemploServices.delete(id);
        fetchTemplos(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el templo.' + err);
      }
    }
  };

  return (
    <div className="p-2 sm:p-3 lg:p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <FaChurch className="w-8 h-8 mr-3 text-indigo-600" />
          Gestión de Templos
        </h1>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Nuevo Templo
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Condicional para mostrar la vista actual */}
      {mode === 'list' && (
        <TemploList
          data={temploData}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {(mode === 'create' || mode === 'edit') && (
        <TemploForm
          temploToEdit={selectedTemplo} // Será null en modo 'create'
          onSuccess={handleSuccess}
          onCancel={() => setMode('list')}
        />
      )}
    </div>
  );
}