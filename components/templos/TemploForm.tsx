import React, { useState, useEffect } from 'react';
import { Templo } from '../../types/Templo';
import { Pastor } from '../../types/Pastor';
import { TemploServices } from '@/services/TemploService';
import { PastorServices } from '@/services/PastorService';
import { FaSave, FaTimes, FaUser, FaExclamationTriangle } from 'react-icons/fa';

// Actualizamos TemploFormValues para incluir el pastorPrincipalId, que es obligatorio en el select
type TemploFormValues = Omit<Templo, 'id' | 'fechaFundacion'> & {
  fechaFundacion: string; // La fecha se manejará como string en el formulario
};

interface TemploFormProps {
  temploToEdit: Templo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const TemploForm: React.FC<TemploFormProps> = ({ temploToEdit, onSuccess, onCancel }) => {
  const isEditing = !!temploToEdit;

  // Ajustamos el estado inicial para incluir pastorPrincipalId (vacío o null)
  const initialFormState: TemploFormValues = {
    nombre: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: '',
    pastorPrincipalId: '', // Debe ser un string vacío al inicio para el select
    fechaFundacion: new Date().toISOString().substring(0, 10),
  };

  const [pastores, setPastores] = useState<Pastor[]>([]);
  const [loadingPastors, setLoadingPastors] = useState(true);
  const [formData, setFormData] = useState<TemploFormValues>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [assignedPastorIds, setAssignedPastorIds] = useState<Set<string>>(new Set());
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  // 3. Cargar la lista de pastores disponibles
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPastors(true);
      try {
        // Cargar Pastores disponibles
        const pastorData = await PastorServices.getAll();
        setPastores(pastorData);

        // Cargar todos los Templos para saber qué pastores ya están asignados
        const allTemplos = await TemploServices.getAll();
        const assignedIds = new Set<string>();

        allTemplos.forEach(templo => {
          // Excluir el templo actual si estamos editando
          const isCurrentTemplo = temploToEdit && templo.id === temploToEdit.id;

          if (templo.pastorPrincipalId && !isCurrentTemplo) {
            assignedIds.add(templo.pastorPrincipalId);
          }
        });
        setAssignedPastorIds(assignedIds);

      } catch (err) {
        console.error('Error al cargar datos de asignación:', err);
      } finally {
        setLoadingPastors(false);
      }
    };
    fetchData();
  }, [temploToEdit]);

  // Cargar datos del templo a editar
  useEffect(() => {
    // ... (Lógica de carga de datos de temploToEdit) ...
    if (temploToEdit) {
      const formattedDate = new Date(temploToEdit.fechaFundacion).toISOString().substring(0, 10);
      setFormData({
        nombre: temploToEdit.nombre,
        direccion: temploToEdit.direccion,
        ciudad: temploToEdit.ciudad,
        departamento: temploToEdit.departamento,
        pais: temploToEdit.pais,
        fechaFundacion: formattedDate,
        pastorPrincipalId: temploToEdit.pastorPrincipalId || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [temploToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar el error de asignación al cambiar la selección
    if (e.target.name === 'pastorPrincipalId') {
      setAssignmentError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAssignmentError(null); // Resetear error antes de validar

    const payload = {
      ...formData,
      fechaFundacion: new Date(formData.fechaFundacion),
      pastorPrincipalId: formData.pastorPrincipalId === '' ? null : formData.pastorPrincipalId,
    }

    // 🚨 2. VALIDACIÓN DE REGLA DE NEGOCIO
    if (payload.pastorPrincipalId && assignedPastorIds.has(payload.pastorPrincipalId)) {
      const pastor = pastores.find(p => p.id === payload.pastorPrincipalId);
      const pastorName = pastor ? `${pastor.nombre} ${pastor.apellido}` : 'El pastor seleccionado';

      setAssignmentError(
        `🚫 ${pastorName} ya está asignado como Pastor Principal de otro templo y no puede ser reasignado.`
      );
      setLoading(false);
      return; // Detener el envío del formulario
    }
    // -------------------------------------

    try {
      if (isEditing && temploToEdit) {
        const temploActualizado = await TemploServices.update(temploToEdit.id, {
          ...payload,
          id: temploToEdit.id,
        } as Templo);

        const nuevoPastorId = payload.pastorPrincipalId;
        const antiguoPastorId = temploToEdit.pastorPrincipalId;

        console.log(nuevoPastorId, antiguoPastorId);

        if (antiguoPastorId) {
          // Llamamos a asignarTemplo con null para desasignar el templo
          await PastorServices.asignarTemplo(antiguoPastorId, null);
        }

        if (nuevoPastorId) {
          await PastorServices.asignarTemplo(nuevoPastorId, temploToEdit.id);
        }
      } else {
        const nuevoTemplo = await TemploServices.create(payload as Templo);

        console.log(nuevoTemplo);

        if (payload.pastorPrincipalId) {
          await PastorServices.asignarTemplo(payload.pastorPrincipalId, nuevoTemplo.id);
        }
      }
      onSuccess();
    } catch (err: unknown) {
      // Manejar el error de forma segura sin usar `any`
      type AxiosLikeError = { response?: { data?: { error?: string } } };
      const axiosErr = err as AxiosLikeError;
      setError(axiosErr.response?.data?.error || 'Error al guardar el templo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        {isEditing ? 'Editar Templo' : 'Registrar Nuevo Templo'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre y Fundación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Templo</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Fecha de Fundación */}
          <div>
            <label htmlFor="fechaFundacion" className="block text-sm font-medium text-gray-700">Fecha de Fundación</label>
            <input
              type="date"
              name="fechaFundacion"
              id="fechaFundacion"
              value={formData.fechaFundacion}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Select para Pastor Principal */}
        <div className="md:col-span-2">
          <label htmlFor="pastorPrincipalId" className="block text-sm font-medium text-gray-700 flex items-center">
            <FaUser className="w-4 h-4 mr-2 text-indigo-600" />
            Pastor Principal Asignado
          </label>
          <select
            name="pastorPrincipalId"
            id="pastorPrincipalId"
            value={formData.pastorPrincipalId || ''}
            onChange={handleChange}
            // Añadimos un borde rojo si hay error de asignación
            className={`mt-1 block w-full border ${assignmentError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white`}
            disabled={loadingPastors || loading}
          >
            {loadingPastors ? (
              <option value="">Cargando pastores...</option>
            ) : (
              <>
                <option value="">-- No Asignado --</option>
                {pastores.map((pastor) => (
                  <option
                    key={pastor.id}
                    value={pastor.id}
                    // 🚨 Deshabilitar si el pastor ya está asignado a otro templo
                    disabled={assignedPastorIds.has(pastor.id) && pastor.id !== temploToEdit?.pastorPrincipalId}
                    className={assignedPastorIds.has(pastor.id) ? 'bg-gray-100 text-gray-400' : ''}
                  >
                    {pastor.nombre} {pastor.apellido} — {pastor.correo}
                  </option>
                ))}
              </>
            )}
          </select>

          {/* 🚨 3. MENSAJE DE ERROR (Tooltip/Feedback) */}
          {assignmentError && (
            <div className="mt-2 text-sm text-red-600 flex items-center p-2 bg-red-50 rounded-md">
              <FaExclamationTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              {assignmentError}
            </div>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="direccion"
            id="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Ciudad, Departamento, País */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              id="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
            <input
              type="text"
              name="departamento"
              id="departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="pais" className="block text-sm font-medium text-gray-700">País</label>
            <input
              type="text"
              name="pais"
              id="pais"
              value={formData.pais}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition duration-150"
            disabled={loading}
          >
            <FaTimes className="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
            disabled={loading}
          >
            <FaSave className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Templo' : 'Crear Templo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemploForm;