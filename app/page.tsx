import React from 'react';
import { FaListCheck } from 'react-icons/fa6';
import { FaCode, FaCross, FaUsers } from 'react-icons/fa';

/**
 * Información del proyecto y desarrolladores (Para el dashboard de inicio).
 */
const ProjectInfoCard = ({
  title,
  content,
  icon,
}: {
  title: string;
  content: string;
  icon: React.ReactElement<any>;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-2xl hover:border-indigo-400">
    <div className="flex items-center space-x-4 mb-3">
      {React.cloneElement(icon, { className: "w-8 h-8 text-indigo-600" })}
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
    <p className="text-gray-600">{content}</p>
  </div>
);

/**
 * Página Principal del Dashboard - Punto de entrada del Frontend.
 */
const DashboardPage = () => {

  // Datos de los desarrolladores (Basados en la documentación)
  const developers = [
    { name: "Stiven Layos Rico", role: "Arquitecto Desarrollador de Software" },
    { name: "Andres Felipe Zapata", role: "Arquitecto Desarrollador Frontend" },
    { name: "Brandon Vidal Jaramillo", role: "Arquitecto Desarrollador Backend" },
  ];

  return (
    // Estilos para el contenido principal, dejando espacio para la Sidebar (lg:ml-64) y el Header (pt-16)
    <main className="bg-gray-50 p-2 sm:p-3 lg:p-5">
      <div className="max-w-7xl mx-auto">

        {/* Título Principal */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
            <FaCross className="w-8 h-8 text-indigo-600" />
            <span>HolySeeSoftware</span>
          </h1>
          <p className="text-gray-500 mt-1">Plataforma integral de gestión eclesial.</p>
        </div>

        {/* Sección de Información del Software */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ProjectInfoCard
            title="Arquitectura"
            content="Implementación de Arquitectura por Capas con principios SOLID, garantizando alta mantenibilidad y testeabilidad."
            icon={<FaCode />}
          />

          <ProjectInfoCard
            title="Flujo Principal"
            content="Gestión completa del CRUD de Miembros. Asignación a Templos. Pastorado y Comités."
            icon={<FaUsers />}
          />

          <ProjectInfoCard
            title="Patrones Clave"
            content="Aplicación de Patrones Repository, Factory Method, y Principio D (Inversión de Dependencias)."
            icon={<FaListCheck />}
          />
        </section>

        {/* Sección de Desarrolladores */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Desarrolladores del Proyecto</h2>
          <div className="bg-white px-6 py-2 rounded-xl shadow-lg border border-gray-100">
            <ul className="divide-y divide-gray-200">
              {developers.map((dev, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">{dev.name}</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700`}>
                    {dev.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>
    </main>
  );
};

export default DashboardPage;