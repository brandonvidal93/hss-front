'use client'; // ¡CRÍTICO! Los hooks de React (como useState) requieren 'use client'

import React, { useState } from 'react';
import Header from '../components/navigation/Header'; // Ruta a /components/navigation/Header.tsx
import Sidebar from '../components/navigation/Sidebar'; // Ruta a /components/navigation/Sidebar.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <html lang="es">
      <head>
         <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div className="flex min-h-screen">
          
          {/* Componente de la Barra Lateral (Visible en todas las páginas) */}
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          
          <div className="flex-grow">
            {/* Componente del Encabezado (Visible en todas las páginas) */}
            <Header toggleSidebar={toggleSidebar} />
            
            {/* Contenido de la página actual (Dashboard, Miembros, Templos, etc.) */}
            {children}
          </div>
          
        </div>
      </body>
    </html>
  );
}