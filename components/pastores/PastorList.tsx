import React from 'react';
import { FaEdit, FaTrashAlt, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaIdCardAlt, FaUserTie } from 'react-icons/fa';
import { Pastor } from '../../types/Pastor';
import TemploNameFetcher from '../templos/TemploNameFetcher'; // Importar el nuevo componente

interface PastorListProps {
  data: Pastor[];
  loading: boolean;
  onEdit: (pastor: Pastor) => void;
  onDelete: (id: string) => void;
}

const getEstadoColor = (estado: Pastor['estado']) => {
  switch (estado) {
    case 'ACTIVO':
      return 'bg-green-100 text-green-800 border-green-500';
    case 'JUBILADO':
      return 'bg-yellow-100 text-yellow-800 border-yellow-500';
    case 'SANCIONADO':
      return 'bg-red-100 text-red-800 border-red-500';
    case 'EN_PROCESO':
      return 'bg-blue-100 text-blue-800 border-blue-500';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-500';
  }
};

const PastorList: React.FC<PastorListProps> = ({ data, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p className="text-lg text-indigo-600">Cargando pastores...</p>;
  }

  if (data.length === 0) {
    return <p className="text-lg text-gray-500">No hay pastores registrados. ¡Crea el primero!</p>;
  }

  return (
    // Cuadrícula adaptable para las tarjetas
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((pastor) => (
        <div key={pastor.id} className="bg-white shadow-xl rounded-lg overflow-hidden transition transform hover:scale-[1.01] duration-300 border border-gray-100 flex flex-col">

          {/* Encabezado y Estado */}
          <div className={`p-4 border-b flex justify-between items-start ${pastor.temploId ? 'bg-indigo-50' : 'bg-gray-50'}`}>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {pastor.nombre} {pastor.apellido}
            </h3>
            <span className={`px-2 py-1 text-xs leading-none font-semibold rounded-full border ${getEstadoColor(pastor.estado)}`}>
              {pastor.estado.replace('_', ' ')}
            </span>
          </div>

          {/* Cuerpo de la Tarjeta (Detalles) */}
          <div className="p-4 space-y-3 flex-grow">

            {/* Templo Asignado (Usando el Fetcher) */}
            <div className="pb-2 border-b">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Asignación</p>
              <TemploNameFetcher temploId={pastor.temploId || ''} />
            </div>

            {/* Correo y Teléfono */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <FaEnvelope className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>{pastor.correo}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <FaPhoneAlt className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>{pastor.telefono}</span>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
              <div>
                <p className="text-gray-500 flex items-center mb-0.5"><FaCalendarAlt className="w-3 h-3 mr-1" /> Nacimiento:</p>
                <p className="font-medium text-gray-700">{new Date(pastor.fechaNacimiento).toLocaleDateString('es-CO')}</p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center mb-0.5"><FaUserTie className="w-3 h-3 mr-1" /> Ordenación:</p>
                <p className="font-medium text-gray-700">{new Date(pastor.fechaOrdenacion).toLocaleDateString('es-CO')}</p>
              </div>
            </div>

            {/* Licencia */}
            <div className="pt-2 border-t">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center"><FaIdCardAlt className="w-3 h-3 mr-1" /> Licencia</p>
              <p className="font-mono text-sm text-gray-700">{pastor.licenciaMinisterial}</p>
            </div>
          </div>

          {/* Pie de página (Acciones) */}
          <div className="p-4 bg-gray-50 flex justify-end space-x-3 border-t">
            <button
              onClick={() => onEdit(pastor)}
              className="flex items-center px-3 py-1 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition"
              title="Editar Pastor"
            >
              <FaEdit className="w-4 h-4 mr-1" />
              Editar
            </button>
            <button
              onClick={() => onDelete(pastor.id)}
              className="flex items-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition"
              title="Eliminar Pastor"
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

export default PastorList;