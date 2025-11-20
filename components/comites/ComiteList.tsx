// components/comites/ComiteList.tsx
import React from 'react';
import { FaEdit, FaTrashAlt, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { Comite } from '../../types/Comite';
import TemploNameFetcher from '../templos/TemploNameFetcher';
import MiembroNameFetcher from '../miembros/MiembroNameFetcher'; // Nuevo fetcher

interface ComiteListProps {
  data: Comite[];
  loading: boolean;
  onEdit: (comite: Comite) => void;
  onDelete: (id: string) => void;
}

const ComiteList: React.FC<ComiteListProps> = ({ data, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p className="text-lg text-indigo-600">Cargando comités...</p>;
  }

  if (data.length === 0) {
    return <p className="text-lg text-gray-500">No hay comités registrados.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((comite) => (
        <div key={comite.id} className="bg-white shadow-xl rounded-lg overflow-hidden transition transform hover:scale-[1.01] duration-300 border border-gray-100 flex flex-col">

          {/* Encabezado */}
          <div className="p-4 border-b bg-indigo-50">
            <h3 className="text-xl font-bold text-indigo-800 leading-tight">{comite.nombre}</h3>
          </div>

          {/* Cuerpo de la Tarjeta (Detalles) */}
          <div className="p-4 space-y-3 flex-grow">

            {/* Templo Asignado */}
            <div className="pb-2 border-b">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Templo</p>
              <TemploNameFetcher temploId={comite.temploId} />
            </div>

            {/* Líder Asignado */}
            <div className="pb-2 border-b">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Líder del Comité</p>
              <MiembroNameFetcher miembroId={comite.liderId} role="Líder" />
            </div>

            {/* Descripción */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center"><FaInfoCircle className="w-3 h-3 mr-1" /> Descripción</p>
              <p className="text-sm text-gray-700 line-clamp-2">{comite.descripcion}</p>
            </div>

            {/* Fecha de Creación */}
            <div className="pt-2 border-t">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center"><FaCalendarAlt className="w-3 h-3 mr-1" /> Creado el</p>
              <p className="font-medium text-sm text-gray-700">{new Date(comite.fechaCreacion).toLocaleDateString('es-CO')}</p>
            </div>

          </div>

          {/* Pie de página (Acciones) */}
          <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
            <button
              onClick={() => onEdit(comite)}
              className="flex items-center px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition"
              title="Editar Comité"
            >
              <FaEdit className="w-4 h-4 mr-1" />
              Editar
            </button>
            <button
              onClick={() => onDelete(comite.id)}
              className="flex items-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition"
              title="Eliminar Comité"
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

export default ComiteList;