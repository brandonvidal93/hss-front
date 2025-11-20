import React from 'react';
import { FaBars } from 'react-icons/fa';

interface HeaderProps {
    toggleSidebar: () => void;
}

/**
 * Header: Muestra el nombre del software y el botón de Toggle para móvil.
 */
const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    // <header className="fixed top-0 left-0 lg:left-64 right-0 bg-white shadow-md z-10 h-16 flex items-center justify-between px-4">
    <header className="bg-white shadow-md h-16 flex items-center justify-between px-4">
      
      {/* Botón de Hamburguesa (Solo Visible en Móvil) */}
      <button 
        onClick={toggleSidebar} 
        className="text-gray-600 hover:text-indigo-600 p-2 lg:hidden mr-3 transition-colors"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Título Principal */}
      <h1 className="text-xl font-bold text-gray-800 tracking-wider">
        HolySeeSoftware
      </h1>
      
      {/* Espacio para elementos de la derecha (Perfil, Notificaciones) */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500 hidden sm:block">
          Bienvenido, Administrador
        </span>
      </div>
    </header>
  );
};

export default Header;