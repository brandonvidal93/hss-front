import React from 'react';
import { FaEdit, FaTrashAlt, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { Templo } from '../../types/Templo';
import PastorNameFetcher from '../pastores/PastorNameFetcher';

interface TemploListProps {
  data: Templo[];
  loading: boolean;
  onEdit: (templo: Templo) => void;
  onDelete: (id: string) => void;
}

const TemploList: React.FC<TemploListProps> = ({ data, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p className="text-lg text-indigo-600">Cargando templos...</p>;
  }

  if (data.length === 0) {
    return <p className="text-lg text-gray-500">No hay templos registrados. ¡Crea el primero!</p>;
  }

  return (
    // Cuadrícula que se adapta: 1 columna en móvil, 2 en pantallas medianas, 3 en grandes.
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((templo) => (
        <div key={templo.id} className="bg-white shadow-xl rounded-lg overflow-hidden transition transform hover:scale-[1.02] duration-300 border border-gray-100">
          
          {/* Encabezado de la Tarjeta */}
          <div className="p-5 border-b bg-indigo-50/70">
            <h3 className="text-xl font-bold text-indigo-800 truncate">{templo.nombre}</h3>
          </div>

          {/* Cuerpo de la Tarjeta (Detalles) */}
          <div className="p-5 space-y-3">
            
            {/* Pastor Principal */}
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pastor Principal</p>
                <PastorNameFetcher pastorId={templo.pastorPrincipalId} />
            </div>

            {/* Dirección */}
            <div className="flex items-start space-x-2 text-sm text-gray-700">
              <FaMapMarkerAlt className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
              <p className="flex-grow">
                <span className="font-medium">Dirección: </span>{templo.direccion}
              </p>
            </div>

            {/* Ubicación */}
            <div className="flex items-start space-x-2 text-sm text-gray-700">
              <FaLocationDot className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
              <p className="flex-grow">
                <span className="font-medium">Ubicación: </span>{templo.ciudad}, {templo.departamento} ({templo.pais})
              </p>
            </div>
            
            {/* Fundación */}
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <FaCalendarAlt className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <p>
                <span className="font-medium">Fundación: </span>
                {new Date(templo.fechaFundacion).toLocaleDateString('es-CO')}
              </p>
            </div>
            
          </div>

          {/* Pie de página (Acciones) */}
          <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
            <button
              onClick={() => onEdit(templo)}
              className="flex items-center px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition"
              title="Editar Templo"
            >
              <FaEdit className="w-4 h-4 mr-1" />
              Editar
            </button>
            <button
              onClick={() => onDelete(templo.id)}
              className="flex items-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition"
              title="Eliminar Templo"
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

export default TemploList;