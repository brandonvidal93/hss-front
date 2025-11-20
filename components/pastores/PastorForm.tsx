import React, { useState, useEffect } from 'react';
import { Pastor } from '../../types/Pastor';
import { PastorServices } from '@/services/PastorService';
import { FaSave, FaTimes, FaUser, FaClipboardList } from 'react-icons/fa';

// Omitimos id y temploId (ya que el templo se asigna en el formulario de Templo)
type PastorFormValues = Omit<Pastor, 'id' | 'temploId' | 'fechaNacimiento' | 'fechaOrdenacion'> & {
  fechaNacimiento: string;
  fechaOrdenacion: string;
};

interface PastorFormProps {
  pastorToEdit: Pastor | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const estados: Pastor['estado'][] = ['ACTIVO', 'JUBILADO', 'SANCIONADO', 'EN_PROCESO'];

const PastorForm: React.FC<PastorFormProps> = ({ pastorToEdit, onSuccess, onCancel }) => {
  const isEditing = !!pastorToEdit;

  // Función auxiliar para obtener la fecha en formato YYYY-MM-DD
  const formatDate = (date: Date | string): string => {
    if (!date) return new Date().toISOString().substring(0, 10);
    return new Date(date).toISOString().substring(0, 10);
  };

  const initialFormState: PastorFormValues = {
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    licenciaMinisterial: '',
    estado: 'ACTIVO',
    fechaNacimiento: formatDate(new Date()),
    fechaOrdenacion: formatDate(new Date()),
  };

  const [formData, setFormData] = useState<PastorFormValues>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pastorToEdit) {
      setFormData({
        nombre: pastorToEdit.nombre,
        apellido: pastorToEdit.apellido,
        telefono: pastorToEdit.telefono,
        correo: pastorToEdit.correo,
        licenciaMinisterial: pastorToEdit.licenciaMinisterial,
        estado: pastorToEdit.estado,
        fechaNacimiento: formatDate(pastorToEdit.fechaNacimiento),
        fechaOrdenacion: formatDate(pastorToEdit.fechaOrdenacion),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [pastorToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Preparar el payload convirtiendo las fechas a Date (o según lo espere el backend)
    const payload = {
      ...formData,
      fechaNacimiento: new Date(formData.fechaNacimiento),
      fechaOrdenacion: new Date(formData.fechaOrdenacion),
    }

    try {
      if (isEditing && pastorToEdit) {
        // Incluimos el ID y temploId (no editable aquí) para el PUT
        await PastorServices.update(pastorToEdit.id, {
          ...payload,
          id: pastorToEdit.id,
          temploId: pastorToEdit.temploId,
        } as Pastor);
      } else {
        // En la creación, el backend espera temploId; pasamos cadena vacía para indicar sin asignación
        await PastorServices.create({
          ...payload,
          temploId: null,
        });
      }
      onSuccess();
    } catch (err: unknown) {
      const parseErrorMessage = (error: unknown): string => {
        if (typeof error !== 'object' || error === null) return 'Error al guardar el pastor.';
        const errObj = error as Record<string, unknown>;

        const response = errObj['response'];
        if (response && typeof response === 'object') {
          const data = (response as Record<string, unknown>)['data'];
          if (data && typeof data === 'object') {
            const apiMsg = (data as Record<string, unknown>)['error'];
            if (typeof apiMsg === 'string') return apiMsg;
          }
        }

        const messageProp = errObj['message'];
        if (typeof messageProp === 'string') return messageProp;

        return 'Error al guardar el pastor.';
      };

      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        {isEditing ? 'Editar Pastor' : 'Registrar Nuevo Pastor'}
      </h2>

      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sección 1: Datos Personales y Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 md:col-span-2 flex items-center"><FaUser className="w-4 h-4 mr-2" /> Información Básica</h3>

          {/* Nombre y Apellido */}
          <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />

          {/* Correo y Teléfono */}
          <input type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />

          {/* Fecha de Nacimiento */}
          <div>
            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" id="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>
        </div>

        {/* Sección 2: Datos Ministeriales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="text-lg font-semibold text-gray-700 md:col-span-2 flex items-center"><FaClipboardList className="w-4 h-4 mr-2" /> Información Ministerial</h3>

          {/* Licencia Ministerial */}
          <input type="text" name="licenciaMinisterial" placeholder="Licencia Ministerial" value={formData.licenciaMinisterial} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />

          {/* Fecha de Ordenación */}
          <div>
            <label htmlFor="fechaOrdenacion" className="block text-sm font-medium text-gray-700">Fecha de Ordenación</label>
            <input type="date" name="fechaOrdenacion" id="fechaOrdenacion" value={formData.fechaOrdenacion} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
            <select name="estado" id="estado" value={formData.estado} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white">
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Espacio para Templo Asignado (Solo lectura/Informativo) */}
          {isEditing && (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-600">Asignación actual:</p>
              <p className="text-xs text-gray-500 italic">
                El templo se gestiona desde la sección de Templos.
                {/* Aquí podrías agregar un TemploNameFetcher si lo necesitaras */}
                {pastorToEdit.temploId ? ` (ID Templo: ${pastorToEdit.temploId})` : ' (Sin templo asignado)'}
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onCancel} className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition duration-150" disabled={loading}>
            <FaTimes className="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button type="submit" className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:opacity-50" disabled={loading}>
            <FaSave className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Pastor' : 'Crear Pastor')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PastorForm;