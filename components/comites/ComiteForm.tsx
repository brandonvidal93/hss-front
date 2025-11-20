// components/comites/ComiteForm.tsx
import React, { useState, useEffect } from 'react';
import { Comite } from '../../types/Comite';
import { ComiteServices } from '@/services/ComiteService';
import { TemploServices } from '@/services/TemploService';
import { MiembroServices } from '@/services/MiembroService';
import { Templo } from '@/types/Templo';
import { Miembro } from '@/types/Miembro'; // Usamos el tipo Miembro para el Líder
import { FaSave, FaTimes, FaUserShield, FaChurch } from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';

type ComiteFormValues = Omit<Comite, 'id'>;

interface ComiteFormProps {
  comiteToEdit: Comite | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ComiteForm: React.FC<ComiteFormProps> = ({ comiteToEdit, onSuccess, onCancel }) => {
  const isEditing = !!comiteToEdit;

  const initialFormState: ComiteFormValues = {
    nombre: '',
    descripcion: '',
    liderId: '',
    temploId: '',
    fechaCreacion: new Date(),
  };

  const [formData, setFormData] = useState<ComiteFormValues>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Opciones para Selects
  const [temploOptions, setTemploOptions] = useState<Templo[]>([]);
  const [liderOptions, setLiderOptions] = useState<Miembro[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Cargar opciones (Templos y Miembros para Líderes)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [templos, miembros] = await Promise.all([
          TemploServices.getAll(),
          MiembroServices.getAll()
        ]);
        setTemploOptions(templos);
        setLiderOptions(miembros);
      } catch (err) {
        console.error('Error al cargar opciones:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (comiteToEdit) {
      setFormData({
        nombre: comiteToEdit.nombre,
        descripcion: comiteToEdit.descripcion,
        liderId: comiteToEdit.liderId || '',
        temploId: comiteToEdit.temploId || '',
        fechaCreacion: comiteToEdit.fechaCreacion || new Date(),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [comiteToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      liderId: formData.liderId || null,
      temploId: formData.temploId || null,
      
    };

    try {
      let comiteGuardado: Comite;

      if (isEditing && comiteToEdit) {
        comiteGuardado = await ComiteServices.update(comiteToEdit.id, {
          ...payload,
          id: comiteToEdit.id,
          fechaCreacion: comiteToEdit.fechaCreacion, // Necesario para cumplir con el tipo Comite
        } as Comite);
      } else {
        comiteGuardado = await ComiteServices.create({
          ...payload,
          fechaCreacion: new Date(), // Asigna la fecha y hora actual
        } as Omit<Comite, 'id'>);
      }

      // La lógica de asignación se delega al backend en los endpoints de ComiteServices.create/update
      // Si el backend no maneja la sincronización en el update, usaríamos:

      // Sincronización (Opcional, si el update no asigna)
      // if (comiteGuardado.liderId !== payload.liderId) {
      //   await ComiteServices.asignarLider(comiteGuardado.id, payload.liderId || '');
      // }
      // if (comiteGuardado.temploId !== payload.temploId) {
      //   await ComiteServices.asignarTemplo(comiteGuardado.id, payload.temploId || '');
      // }


      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el comité.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        {isEditing ? 'Editar Comité' : 'Registrar Nuevo Comité'}
      </h2>

      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nombre y Descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="text-lg font-semibold text-gray-700 md:col-span-2 flex items-center"><FaListCheck className="w-4 h-4 mr-2" /> Identificación</h3>

          <input type="text" name="nombre" placeholder="Nombre del Comité" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />

          <div className="md:col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción/Objetivo</label>
            <textarea name="descripcion" id="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
          </div>
        </div>

        {/* Asignación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 md:col-span-2 flex items-center"><FaChurch className="w-4 h-4 mr-2" /> Asignación de Recursos</h3>

          {/* Líder (Miembro) */}
          <div>
            <label htmlFor="liderId" className="block text-sm font-medium text-gray-700 flex items-center"><FaUserShield className="w-4 h-4 mr-2" /> Líder Asignado</label>
            <select name="liderId" id="liderId" value={formData.liderId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white" disabled={loadingOptions}>
              {loadingOptions ? (
                <option value="">Cargando Miembros...</option>
              ) : (
                <>
                  <option value="">-- Sin Líder --</option>
                  {liderOptions.map(miembro => (
                    <option key={miembro.id} value={miembro.id}>{miembro.nombres} {miembro.apellidos} ({miembro.email})</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Templo */}
          <div>
            <label htmlFor="temploId" className="block text-sm font-medium text-gray-700 flex items-center"><FaChurch className="w-4 h-4 mr-2" /> Templo Perteneciente</label>
            <select name="temploId" id="temploId" value={formData.temploId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white" disabled={loadingOptions}>
              {loadingOptions ? (
                <option value="">Cargando Templos...</option>
              ) : (
                <>
                  <option value="">-- Sin Templo --</option>
                  {temploOptions.map(templo => (
                    <option key={templo.id} value={templo.id}>{templo.nombre}</option>
                  ))}
                </>
              )}
            </select>
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
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Comité' : 'Crear Comité')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComiteForm;