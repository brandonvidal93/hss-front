# HolySeeSoftware - Plataforma Integral de Gestión Eclesial

**Integrantes y Roles:**
* Stiven Layos Rico
* Andres Felipe Zapata
* Brandon Vidal Jaramillo
*(Roles: Arquitecto / Arquitecto Frontend / Arquitecto Backend)*

---

## 1. Descripción del Sistema y Contexto

HolySeeSoftware es una plataforma integral web/móvil diseñada para optimizar la gestión administrativa, financiera y comunitaria de iglesias en Colombia.

El sistema aborda problemas clave como la gestión ineficiente de la información de miembros, la falta de centralización de datos y la escasa transparencia en el control de aportes, que generalmente se llevan a cabo de forma manual o dispersa.

#### Objetivos Estratégicos
* **Centralizar** la información en una plataforma unificada y accesible.
* **Optimizar** la gestión administrativa, reduciendo errores y tiempos.
* **Fortalecer** la transparencia financiera sobre ofrendas, diezmos y donaciones.
* **Mejorar** la experiencia de los miembros de la iglesia, fomentando el contacto y la participación.

---

## 2. Arquitectura Utilizada: Diseño por N-Capas

El sistema HolySeeSoftware adopta una arquitectura de **Diseño por N-Capas** (4 capas: Presentación, Negocio, Acceso a Datos, Datos).

Este patrón fue elegido por ser el estándar para sistemas de información transaccionales y centralizados (CRUD), proporcionando una estructura robusta para abordar los requisitos del sistema de gestión eclesial.

### Estructura de Contenedores (Modelo C4, Nivel 2) [cite: 43]

La arquitectura se compone de los siguientes contenedores lógicos:

* **Frontend Web (React/Next.js):** Interfaz de usuario para Líderes y Administradores.
* **Backend API (Node.js/Express):** Lógica de negocio, autenticación y API REST/GraphQL.
* **Servicios de Negocio (Módulos):** Membresía.
* **Base de Datos Relacional (MS SQL Server):** Almacena datos de miembros.

### Impacto de la Arquitectura
* **Mantenibilidad:** La separación por capas aísla el impacto de las modificaciones, permitiendo la evolución de una capa sin afectar a las adyacentes.
* **Escalabilidad:** Permite la escalabilidad horizontal de las capas de presentación y negocio a través de balanceadores de carga.
* **Seguridad:** Las reglas de negocio y las validaciones se concentran en la capa de negocio, protegiendo la integridad de los datos.

---

## 3. Patrones de Diseño Aplicados

Se implementaron cinco patrones de diseño para resolver problemas concretos de la arquitectura, mejorar la mantenibilidad y la extensibilidad, cumpliendo con los requisitos del proyecto.

| Patrón | Capa | Problema que Resuelve | Justificación / Uso en HSS |
| :--- | :--- | :--- | :--- |
| **Repository** | Acceso a Datos | Acceso a datos acoplado a la lógica de negocio[cite: 781]. | Centraliza la persistencia (CRUD de Miembro, Aporte, Templo), facilitando pruebas unitarias mediante *mocks* y permitiendo el cambio de tecnología de BD. |
| **Factory Method** | Negocio (Dominio) | Creación dispersa de objetos que varían según el tipo. | Centraliza la construcción de objetos de dominio (ej., **Aporte**), aplicando reglas de inicialización (fecha, monto mínimo) en un solo lugar. |
| **Observer** | Negocio / Mensajería | Alto acoplamiento entre emisores y múltiples consumidores de eventos. | Desacopla procesos asíncronos (ej., **Registro de Aporte** $\rightarrow$ Notificación por Email/SMS, Actualización de Dashboard) vía *EventBus*. |
| **Strategy** | Negocio (Pagos) | Uso de grandes bloques `switch/if` para elegir algoritmos. | Utilizado en el procesamiento de **Aportes** para manejar diferentes métodos de pago (Efectivo, PayU, MercadoPago), facilitando la adición de nuevas pasarelas sin modificar el *Payment Processor*. |
| **Command** | Negocio / Transaccional | Operaciones transaccionales complejas que requieren trazabilidad y reintento. | Encapsula **operaciones críticas** (ej., Registrar Aporte, Asignación Pastoral) en objetos para ser encolados, auditados y reintentados, ideal para introducir CQRS. |

---

## 4. Stack Tecnológico y Requisitos

| Componente | Tecnologías |
| :--- | :--- |
| **Frontend Web** | React, Next.js, TypeScript, Tailwind CSS |
| **Backend API** | Node.js, Express, TypeScript |
| **Datos / Patrones**| Repository Pattern, Factory Method, Observer, Strategy, Command |

### Requisitos Obligatorios del Prototipo [cite: 1147]

* **Flujos CRUD:** Implementados para Templos, Pastores, Miembros y Comités (Flujo principal funcionando).
* **Patrones de Diseño:** Implementación clara de los 5 patrones documentados.
* **Principios SOLID:** Aplicación del Principio de Responsabilidad Única (SRP) y Abierto/Cerrado (OCP) gracias a la separación de servicios y el uso de interfaces (Repository, Strategy).

---

## 5. Instrucciones para la Instalación y Ejecución

Sigue estos pasos para levantar el proyecto:

### Requisitos Previos

* Node.js (versión 18+)
* NPM o Yarn

### 5.1. Clonar el Repositorio

Asegúrate de clonar el repositorio y navegar a la carpeta raíz del *frontend*:

```bash
git clone https://github.com/brandonvidal93/hss-front
cd hss-frontend
```

### 5.2. Configuración de Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto frontend para definir la URL de la API:

```bash
# .env.local
# Ajusta el puerto (ej: 3000, 8080) según donde corra tu Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 5.3. Instalación de Dependencias e Inicialización
Instala las dependencias y ejecuta el servidor de desarrollo del frontend:
```bash
# Instalar dependencias
npm install 

# Levantar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000` o `3001`. **Asegúrate de que tu servicio Backend API esté corriendo y accesible en la dirección configurada.**