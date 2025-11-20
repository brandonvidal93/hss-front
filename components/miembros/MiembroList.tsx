// components/miembros/MiembroList.tsx
import React from 'react';
import { FaEdit, FaTrashAlt, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { Miembro } from '../../types/Miembro';
// Reutilizamos el componente para obtener el nombre del templo
import TemploNameFetcher from '../templos/TemploNameFetcher';

interface MiembroListProps {
  data: Miembro[];
  loading: boolean;
  onEdit: (miembro: Miembro) => void;
  onDelete: (id: string) => void;
}

const getEstadoColor = (estado: Miembro['estado']) => {
  switch (estado) {
    case 'SERVIDOR':
      return 'bg-blue-100 text-blue-800 border-blue-500';
    case 'BAUTIZADO':
      return 'bg-green-100 text-green-800 border-green-500';
    case 'SIMPATIZANTE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-500';
    case 'NO_ASOCIADO':
      return 'bg-gray-100 text-gray-800 border-gray-500';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-500';
  }
};

const MiembroList: React.FC<MiembroListProps> = ({ data, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p className="text-lg text-indigo-600">Cargando miembros...</p>;
  }

  if (data.length === 0) {
    return <p className="text-lg text-gray-500">No hay miembros registrados.</p>;
  }

  return (
    // Diseño de cuadrícula para tarjetas responsivas
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((miembro) => (
        <div key={miembro.id} className="bg-white shadow-xl rounded-lg overflow-hidden transition transform hover:scale-[1.01] duration-300 border border-gray-100 flex flex-col">

          {/* Encabezado y Estado */}
          <div className={`p-4 border-b flex justify-between items-start ${miembro.activo ? 'bg-green-50' : 'bg-gray-50'}`}>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {miembro.nombres} {miembro.apellidos}
            </h3>
            <span className={`px-2 py-1 text-xs leading-none font-semibold rounded-full border ${getEstadoColor(miembro.estado)}`}>
              {miembro.estado.replace('_', ' ')}
            </span>
          </div>

          {/* Cuerpo de la Tarjeta (Detalles) */}
          <div className="p-4 space-y-3 flex-grow">

            {/* Templo Asignado (Usando el Fetcher) */}
            <div className="pb-2 border-b">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Templo Asignado</p>
              <TemploNameFetcher temploId={miembro.temploId} />
            </div>

            {/* Contacto */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <FaEnvelope className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>{miembro.email}</span>
              </div>
              {miembro.telefono && (
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <FaPhoneAlt className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{miembro.telefono}</span>
                </div>
              )}
            </div>

            {/* Fechas y Estado Activo */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
              <div>
                <p className="text-gray-500 flex items-center mb-0.5"><FaCalendarAlt className="w-3 h-3 mr-1" /> Nacimiento:</p>
                <p className="font-medium text-gray-700">{new Date(miembro.fechaNacimiento).toLocaleDateString('es-CO')}</p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center mb-0.5"><FaCalendarAlt className="w-3 h-3 mr-1" /> Bautismo:</p>
                <p className="font-medium text-gray-700">{miembro.fechaBautismo ? new Date(miembro.fechaBautismo).toLocaleDateString('es-CO') : 'N/A'}</p>
              </div>
              <div className="col-span-2 flex items-center justify-between pt-2 border-t">
                <p className="text-sm font-semibold text-gray-600">Activo:</p>
                {miembro.activo ? (
                  <FaToggleOn className="w-6 h-6 text-green-500" title="Miembro Activo" />
                ) : (
                  <FaToggleOff className="w-6 h-6 text-gray-400" title="Miembro Inactivo" />
                )}
              </div>
            </div>

          </div>

          {/* Pie de página (Acciones) */}
          <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
            <button
              onClick={() => onEdit(miembro)}
              className="flex items-center px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition"
              title="Editar Miembro"
            >
              <FaEdit className="w-4 h-4 mr-1" />
              Editar
            </button>
            <button
              onClick={() => onDelete(miembro.id)}
              className="flex items-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition"
              title="Eliminar Miembro"
            >
              <FaTrashAlt className="w-4 h-4 mr-1" />
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MiembroList;