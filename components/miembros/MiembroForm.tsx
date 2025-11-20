// components/miembros/MiembroForm.tsx
import React, { useState, useEffect } from 'react';
import { Miembro } from '../../types/Miembro';
import { MiembroServices } from '@/services/MiembroService';
import { FaSave, FaTimes, FaUser, FaCheckSquare } from 'react-icons/fa';
import { TemploServices } from '@/services/TemploService'; // Para el selector de Templo
import { Templo } from '@/types/Templo';

// Definimos los estados disponibles
const estados: Miembro['estado'][] = ['SERVIDOR', 'BAUTIZADO', 'SIMPATIZANTE', 'NO_ASOCIADO'];

// Omitimos id, fechaRegistro y hacemos las fechas como string para el formulario
type MiembroFormValues = Omit<Miembro, 'id' | 'fechaRegistro' | 'fechaNacimiento' | 'fechaBautismo'> & {
  fechaNacimiento: string;
  fechaBautismo: string | ''; // Permitir string vacío
};

interface MiembroFormProps {
  miembroToEdit: Miembro | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const MiembroForm: React.FC<MiembroFormProps> = ({ miembroToEdit, onSuccess, onCancel }) => {
  const isEditing = !!miembroToEdit;

  const formatDate = (date: Date | string | undefined | null): string | '' => {
    if (!date) return '';
    return new Date(date).toISOString().substring(0, 10);
  };

  const initialFormState: MiembroFormValues = {
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    estado: 'NO_ASOCIADO',
    temploId: '', // Debe ser un string vacío para el select
    activo: true,
    fechaNacimiento: formatDate(new Date()),
    fechaBautismo: '',
  };

  const [formData, setFormData] = useState<MiembroFormValues>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [temploOptions, setTemploOptions] = useState<Templo[]>([]);
  const [loadingTemplos, setLoadingTemplos] = useState(true);

  // Cargar templos
  useEffect(() => {
    const fetchTemplos = async () => {
      try {
        const data = await TemploServices.getAll();
        setTemploOptions(data);
      } catch (err) {
        console.error('Error al cargar templos:', err);
      } finally {
        setLoadingTemplos(false);
      }
    };
    fetchTemplos();
  }, []);

  useEffect(() => {
    if (miembroToEdit) {
      setFormData({
        nombres: miembroToEdit.nombres,
        apellidos: miembroToEdit.apellidos,
        email: miembroToEdit.email,
        telefono: miembroToEdit.telefono || '',
        estado: miembroToEdit.estado,
        temploId: miembroToEdit.temploId || '',
        activo: miembroToEdit.activo,
        fechaNacimiento: formatDate(miembroToEdit.fechaNacimiento),
        fechaBautismo: formatDate(miembroToEdit.fechaBautismo),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [miembroToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    let value: string | boolean;

    if (target.type === 'checkbox') {
      value = (target as HTMLInputElement).checked;
    } else {
      // Esto cubre SELECT, INPUT[text], INPUT[date], etc.
      value = target.value;
    }

    setFormData(prev => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Preparar el payload: convertir fechas y manejar nulls/vacíos
    const payload = {
      ...formData,
      fechaNacimiento: new Date(formData.fechaNacimiento),
      fechaBautismo: formData.fechaBautismo ? new Date(formData.fechaBautismo) : null,
      temploId: formData.temploId || null, // Asegurar que sea null si no se selecciona
      estado: formData.estado,
    }

    try {
      if (isEditing && miembroToEdit) {
        // Incluimos el ID y fechaRegistro para el PUT (asumiendo que el backend los necesita)
        await MiembroServices.update(miembroToEdit.id, {
          ...payload,
          id: miembroToEdit.id,
          fechaRegistro: miembroToEdit.fechaRegistro,
        } as Miembro);
      } else {
        // Creación
        await MiembroServices.create(payload as Miembro);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el miembro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        {isEditing ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}
      </h2>

      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sección 1: Datos Personales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-700 md:col-span-2 flex items-center"><FaUser className="w-4 h-4 mr-2" /> Datos Personales</h3>

          {/* Nombres y Apellidos */}
          <input type="text" name="nombres" placeholder="Nombres" value={formData.nombres} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />

          {/* Correo y Teléfono */}
          <input type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          <input type="tel" name="telefono" placeholder="Teléfono (Opcional)" value={formData.telefono} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />

          {/* Fecha de Nacimiento */}
          <div>
            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input type="date" name="fechaNacimiento" id="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>

          {/* Fecha de Bautismo */}
          <div>
            <label htmlFor="fechaBautismo" className="block text-sm font-medium text-gray-700">Fecha de Bautismo (Opcional)</label>
            <input type="date" name="fechaBautismo" id="fechaBautismo" value={formData.fechaBautismo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>
        </div>

        {/* Sección 2: Datos Eclesiales y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <h3 className="text-lg font-semibold text-gray-700 md:col-span-3 flex items-center"><FaCheckSquare className="w-4 h-4 mr-2" /> Estado y Asignación</h3>

          {/* Estado */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
            <select name="estado" id="estado" value={formData.estado} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white">
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Templo Asignado */}
          <div>
            <label htmlFor="temploId" className="block text-sm font-medium text-gray-700">Templo Asignado</label>
            <select name="temploId" id="temploId" value={formData.temploId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white" disabled={loadingTemplos}>
              {loadingTemplos ? (
                <option value="">Cargando Templos...</option>
              ) : (
                <>
                  <option value="">-- Sin Asignar --</option>
                  {temploOptions.map(templo => (
                    <option key={templo.id} value={templo.id}>{templo.nombre}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Checkbox Activo */}
          <div className="flex items-center pt-6">
            <input
              id="activo"
              name="activo"
              type="checkbox"
              checked={formData.activo}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-700">
              Miembro Activo
            </label>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onCancel} className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition duration-150" disabled={loading}>
            <FaTimes className="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button type="submit" className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:opacity-50" disabled={loading}>
            <FaSave className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Miembro' : 'Crear Miembro')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MiembroForm;