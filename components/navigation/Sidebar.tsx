import React from 'react';
import { FaChurch, FaHome, FaUser, FaUsers } from 'react-icons/fa';
import { FaListCheck, FaX } from 'react-icons/fa6';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => (
  <a href={href} className="flex items-center space-x-3 p-3 rounded-lg text-gray-200 hover:bg-indigo-700 transition duration-150 ease-in-out group">
    {React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5 group-hover:text-white transition-colors" })
      : icon}
    <span className="font-medium">{label}</span>
  </a>
);

/**
 * Sidebar: Barra de navegación principal con funcionalidad de Toggle en móvil.
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay (solo visible en móvil cuando el menú está abierto) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Barra Lateral Principal */}
      {/* <aside
        className={`fixed top-0 left-0 w-64 bg-indigo-800 text-white h-full z-30 shadow-xl transition-transform duration-300 ease-in-out 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 lg:flex flex-col`}
      > */}
      <aside
        className={`fixed z-30 lg:relative bg-indigo-800 text-white h-full shadow-xl transition-transform duration-300 ease-in-out 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 lg:flex flex-col w-40% md:w-[40%] lg:w-[25%]`}
      >

        {/* Logo/Título de la aplicación */}
        <div className="h-16 flex items-center justify-between border-b border-indigo-700 bg-indigo-900 px-4">
          <h2 className="text-2xl font-extrabold tracking-tight">HSS Admin</h2>

          {/* Botón de Cierre (solo en móvil) */}
          <button onClick={onClose} className="lg:hidden text-gray-300 hover:text-white p-2">
            <FaX className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido de la navegación */}
        <nav className="flex-grow p-4 space-y-2">
          <NavItem href="/" icon={<FaHome className="w-5 h-5" />} label="Inicio (Dashboard)" />
          <div className="pt-4 border-t border-indigo-700 mt-4 space-y-2">
            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider px-3 pb-1">Gestión de Flujos</p>

            <NavItem href="/templos" icon={<FaChurch className="w-5 h-5" />} label="Templos" />
            <NavItem href="/pastores" icon={<FaUser className="w-5 h-5" />} label="Pastores" />
            <NavItem href="/miembros" icon={<FaUsers className="w-5 h-5" />} label="Miembros" />
            <NavItem href="/comites" icon={<FaListCheck className="w-5 h-5" />} label="Comités" />
          </div>
        </nav>

        {/* Pie de página o sección de ajustes */}
        <div className="p-4 border-t border-indigo-700 text-sm text-indigo-300">
          <p>© 2025 HolySeeSoftware</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;