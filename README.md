# SAFECLASS Frontend — Manual del Desarrollador

Aplicación web React para el sistema de monitoreo de seguridad escolar SAFECLASS.

---

## Tabla de contenidos

1. [Descripción general](#1-descripción-general)
2. [Requisitos del sistema](#2-requisitos-del-sistema)
3. [Stack tecnológico](#3-stack-tecnológico)
4. [Instalación y arranque](#4-instalación-y-arranque)
5. [Scripts disponibles](#5-scripts-disponibles)
6. [Estructura del proyecto](#6-estructura-del-proyecto)
7. [Configuración](#7-configuración)
8. [Arquitectura de estado](#8-arquitectura-de-estado)
9. [Routing y protección de rutas](#9-routing-y-protección-de-rutas)
10. [Sistema de roles](#10-sistema-de-roles)
11. [Módulo de alertas](#11-módulo-de-alertas)
12. [Páginas y componentes](#12-páginas-y-componentes)
13. [Sistema de diseño](#13-sistema-de-diseño)
14. [Capa de datos](#14-capa-de-datos)
15. [Constantes y configuración del dominio](#15-constantes-y-configuración-del-dominio)
16. [Utilidades](#16-utilidades)
17. [Convenciones de código](#17-convenciones-de-código)
18. [Guía de contribución](#18-guía-de-contribución)

---

## 1. Descripción general

SAFECLASS Frontend es una Single Page Application (SPA) construida con React 18 y Vite. Proporciona interfaces diferenciadas por rol para:

- **Docentes**: visualización de alertas activas por aula en tiempo real.
- **Coordinadores**: panel analítico con gráficos semanales, heatmap de incidencias y ranking de aulas.
- **Administradores**: gestión de usuarios, configuración de cámaras y monitoreo del sistema.

La interfaz usa un tema oscuro profesional diseñado para uso continuo en entornos escolares con poca iluminación.

---

## 2. Requisitos del sistema

| Herramienta | Versión mínima | Notas |
|---|---|---|
| Node.js | 18.x LTS | Requerido por Vite |
| npm | 9.x | Incluido con Node.js 18 |
| Navegador moderno | Chrome 90+ / Firefox 90+ / Edge 90+ | Soporte de ES2020+ |

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| Framework UI | React | ^18.3.1 | Librería de componentes reactivos |
| Build tool | Vite | ^5.4.2 | Bundler y dev server ultrarrápido |
| Enrutamiento | React Router | ^6.26.0 | Navegación SPA con rutas anidadas |
| Estilos | Tailwind CSS | ^3.4.10 | Utility-first CSS con tema personalizado |
| Procesado CSS | PostCSS + Autoprefixer | — | Pipeline de transformación de estilos |
| Linting | ESLint | ^9.9.0 | Análisis estático de código |
| Plugin React | @vitejs/plugin-react | ^4.3.1 | Soporte JSX y Fast Refresh |

---

## 4. Instalación y arranque

```bash
# Entrar al directorio de la aplicación
cd SAFECLASS_Frontend/safeclass-frontend

# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173` con Fast Refresh activado.

### Build de producción

```bash
npm run build      # Genera dist/ optimizado
npm run preview    # Sirve el build localmente para verificar
```

---

## 5. Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| Desarrollo | `npm run dev` | Vite dev server con HMR en `localhost:5173` |
| Build | `npm run build` | Bundle optimizado en `dist/` |
| Preview | `npm run preview` | Sirve `dist/` localmente para pruebas |
| Lint | `npm run lint` | ESLint sobre todos los `.js` y `.jsx` en `src/` |

---

## 6. Estructura del proyecto

```
safeclass-frontend/
├── public/                        # Assets estáticos (no procesados por Vite)
├── src/
│   ├── main.jsx                   # Punto de entrada: ReactDOM.createRoot + BrowserRouter
│   ├── App.jsx                    # Proveedores de contexto + definición de rutas
│   ├── index.css                  # Estilos globales y directivas Tailwind
│   │
│   ├── context/                   # Estado global de la aplicación
│   │   ├── AuthContext.jsx        # Sesión de usuario: login, logout, password reset
│   │   ├── ToastContext.jsx       # Notificaciones toast efímeras
│   │   └── AlertContext.jsx       # Estado de alertas: lista, filtros, acciones, SSE
│   │
│   ├── hooks/                     # Custom hooks de conveniencia
│   │   ├── useAuth.js             # Acceso al AuthContext
│   │   ├── useAlerts.js           # Acceso al AlertContext
│   │   └── useToast.js            # Disparo de toasts
│   │
│   ├── constants/                 # Configuración de dominio invariable
│   │   ├── roles.js               # ROLES, ROLE_LABELS, ROLE_NAV, getRoleFromEmail
│   │   ├── alertConfig.js         # ALERT_TYPES, ALERT_CONFIG, STATUS_CONFIG, DISCARD_REASONS
│   │   └── camStatus.js           # Configuración visual de estados de cámara
│   │
│   ├── utils/
│   │   └── formatters.js          # Formateo de fechas, horas y duraciones
│   │
│   ├── data/
│   │   └── mockData.js            # Datos mock: usuarios, aulas, cámaras, alertas, stats
│   │
│   ├── components/
│   │   ├── ui/                    # Componentes atómicos reutilizables
│   │   │   ├── Badge.jsx          # Etiqueta de estado con color
│   │   │   ├── ConfidenceBar.jsx  # Barra de porcentaje de confianza IA
│   │   │   ├── Icon.jsx           # Renderizador de SVG icons inline
│   │   │   ├── Modal.jsx          # Overlay de diálogo accesible
│   │   │   ├── Skeleton.jsx       # Placeholder de carga animado
│   │   │   ├── Toast.jsx          # Componente de notificación toast
│   │   │   ├── Tooltip.jsx        # Tooltip con posicionamiento automático
│   │   │   └── VideoPlaceholder.jsx # Placeholder de stream de cámara
│   │   │
│   │   ├── layout/                # Estructura principal de la app
│   │   │   ├── AppShell.jsx       # Layout raíz: Sidebar + área de contenido + RightPanel
│   │   │   ├── Sidebar.jsx        # Navegación lateral con badge de alertas pendientes
│   │   │   └── RightPanel.jsx     # Feed lateral de alertas recientes
│   │   │
│   │   ├── alerts/                # Componentes del módulo de alertas
│   │   │   ├── AlertCard.jsx      # Tarjeta resumida de una alerta
│   │   │   └── AlertDetail.jsx    # Modal de detalle completo con acciones
│   │   │
│   │   ├── dashboard/             # Componentes de la vista docente
│   │   │   ├── ClassroomTabs.jsx  # Pestañas de navegación por aulas
│   │   │   └── KPICard.jsx        # Tarjeta de métrica con icono y tendencia
│   │   │
│   │   ├── coordinator/           # Componentes de la vista coordinador
│   │   │   ├── BarChart.jsx       # Gráfico de barras de alertas por día/tipo
│   │   │   ├── TypeChart.jsx      # Distribución porcentual por tipo
│   │   │   ├── Heatmap.jsx        # Matriz hora × aula de incidencias
│   │   │   └── ClassroomRanking.jsx # Ranking de aulas por frecuencia de alertas
│   │   │
│   │   └── admin/                 # Componentes del panel de administración
│   │       ├── CameraRow.jsx      # Fila de cámara en tabla de gestión
│   │       ├── UserRow.jsx        # Fila de usuario en tabla de gestión
│   │       ├── ModuleStatus.jsx   # Indicador de estado de módulo del sistema
│   │       ├── ThresholdSlider.jsx # Control de umbral de confianza IA
│   │       └── LogViewer.jsx      # Visor de logs del sistema
│   │
│   └── pages/                     # Páginas enrutadas
│       ├── auth/
│       │   ├── LoginPage.jsx      # Formulario de autenticación
│       │   └── ForgotPasswordPage.jsx # Formulario de recuperación de contraseña
│       ├── dashboard/
│       │   └── DashboardPage.jsx  # Vista principal: alertas activas + aulas
│       ├── history/
│       │   └── HistoryPage.jsx    # Historial filtrable de alertas pasadas
│       ├── coordinator/
│       │   └── CoordinatorPage.jsx # Panel analítico para coordinadores
│       └── admin/
│           └── AdminPage.jsx      # Panel con 4 pestañas: Usuarios, Cámaras, IA, Sistema
│
├── index.html                     # Plantilla HTML de Vite
├── vite.config.js                 # Configuración de Vite (alias @/, plugin React)
├── tailwind.config.js             # Paleta de colores, animaciones, fuentes
├── postcss.config.js              # Pipeline PostCSS
├── eslint.config.js               # Reglas de ESLint
└── package.json
```

---

## 7. Configuración

### Vite (`vite.config.js`)

```js
// Alias de importación: @/ → src/
// Permite: import Button from '@/components/ui/Badge'
resolve: {
  alias: { '@': './src' }
}
```

Para cambiar el puerto del dev server:
```js
server: { port: 3001 }
```

### Tailwind (`tailwind.config.js`)

El proyecto define una paleta de colores personalizada:

| Token | Uso |
|---|---|
| `surface-*` | Fondos del tema oscuro (panel, card, overlay) |
| `border-*` | Bordes de separación |
| `alert-danger` | Alertas de agresión (rojo) |
| `alert-warning` | Alertas de aislamiento (ámbar) |
| `alert-info` | Alertas de caída (azul) |
| `alert-success` | Estado confirmado (verde) |

Fuentes configuradas:
- `font-sans` → Inter (UI general)
- `font-mono` → JetBrains Mono (datos técnicos, IDs)

### ESLint (`eslint.config.js`)

Plugins activos: `eslint-plugin-react`, `eslint-plugin-react-hooks`. Incluye reglas de hooks para detectar dependencias faltantes en `useEffect`/`useCallback`.

---

## 8. Arquitectura de estado

La aplicación usa Context API de React para estado global. No se utiliza Redux ni Zustand.

### Jerarquía de proveedores (`App.jsx`)

```
<AuthProvider>           → sesión del usuario
  <ToastProvider>        → cola de notificaciones
    <AlertProvider>      → alertas, aulas, acciones
      <AppRoutes />
    </AlertProvider>
  </ToastProvider>
</AuthProvider>
```

### AuthContext

**Estado:** `user` (objeto de usuario o `null`)

**Acciones:**
- `login(email, password)` → Promise. Simula llamada al backend (900ms). Acepta cualquier email `@iecol.edu.co` con password `safeclass`.
- `logout()` → limpia el estado de usuario.
- `requestPasswordReset(email)` → Promise. Valida dominio institucional.

**Inferencia de rol desde email:**
```js
// admin@iecol.edu.co    → administrador
// coord@iecol.edu.co    → coordinador
// otro@iecol.edu.co     → docente
```

### ToastContext

**Acciones:** `showToast({ type, message, duration })`

Tipos disponibles: `success`, `error`, `warning`, `info`.

Uso desde cualquier componente:
```jsx
const { showToast } = useToast();
showToast({ type: 'success', message: 'Alerta confirmada correctamente' });
```

### AlertContext

Es el contexto más complejo. Gestiona:

- Lista de alertas (con filtros por estado, tipo y aula).
- Contador de alertas pendientes (usado en el badge del Sidebar).
- Estado de aulas (sincronizado automáticamente con las alertas pendientes).
- Simulación de nuevas alertas cada 45 segundos (para prototipo).

**Acciones:**
- `confirmAlert(id)` → cambia status a `CONFIRMADA`.
- `discardAlert(id, reason)` → cambia status a `DESCARTADA`.
- `escalateAlert(id)` → marca como escalada.

---

## 9. Routing y protección de rutas

### Rutas definidas en `App.jsx`

| Ruta | Componente | Acceso |
|---|---|---|
| `/login` | `LoginPage` | Público (redirige a `/` si hay sesión) |
| `/forgot-password` | `ForgotPasswordPage` | Público |
| `/*` | `AppShell` | Protegido — requiere sesión activa |

### `ProtectedRoute`

Guarda de ruta que redirige a `/login` si `user` es `null`:

```jsx
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};
```

### Rutas internas de `AppShell`

Definidas dentro del layout principal:

| Ruta | Página | Roles con acceso |
|---|---|---|
| `/` | `DashboardPage` | todos |
| `/history` | `HistoryPage` | todos |
| `/coordinator` | `CoordinatorPage` | coordinador, administrador |
| `/admin` | `AdminPage` | administrador |

El `Sidebar` oculta automáticamente los ítems de navegación según el rol usando `ROLE_NAV` de `constants/roles.js`.

---

## 10. Sistema de roles

Definido en `src/constants/roles.js`:

```js
export const ROLES = {
  DOCENTE:       'docente',
  COORDINADOR:   'coordinador',
  ADMINISTRADOR: 'administrador',
};
```

### Vistas por rol

| Rol | Dashboard | Historial | Coordinador | Admin |
|---|---|---|---|---|
| docente | ✓ | ✓ | — | — |
| coordinador | ✓ | ✓ | ✓ | — |
| administrador | ✓ | ✓ | ✓ | ✓ |

### Inferencia de rol por email

La función `getRoleFromEmail` asigna rol según el email institucional:

```js
if (email.includes('admin')) → administrador
if (email.includes('coord')) → coordinador
else @iecol.edu.co           → docente
```

---

## 11. Módulo de alertas

### Tipos de alerta

| Clave | Etiqueta | Color | Icono |
|---|---|---|---|
| `AGRESION` | Agresión | Rojo `#ef4444` | Puño |
| `AISLAMIENTO` | Aislamiento | Ámbar `#f59e0b` | Persona sola |
| `CAIDA` | Caída | Azul `#3b82f6` | Persona cayendo |
| `OTRO` | Otro | Gris `#64748b` | Alerta genérica |

### Estados de alerta

| Estado | Color | Descripción |
|---|---|---|
| `PENDIENTE` | Ámbar | Detectada, sin acción del docente |
| `CONFIRMADA` | Verde | Verificada como incidente real |
| `DESCARTADA` | Gris | Falsa alarma o explicada |

### Razones de descarte predefinidas

- Falsa alarma
- Juego normal
- Actividad curricular
- Error de cámara
- Otro

### Umbral de confianza

`DEFAULT_CONFIDENCE_THRESHOLD = 0.75` — solo se muestran al docente las alertas con confianza ≥ 75%.

### Componentes de alerta

**`AlertCard.jsx`**: tarjeta compacta que muestra tipo, aula, hora y confianza. Clic → abre `AlertDetail`.

**`AlertDetail.jsx`**: modal completo con:
- Imagen/video de la cámara.
- Barra de confianza (`ConfidenceBar`).
- Historial de acciones (`AlertAction[]`).
- Botones de acción: Confirmar / Descartar / Escalar (según estado actual).

---

## 12. Páginas y componentes

### `LoginPage`

Formulario con validación de dominio institucional. Muestra spinner durante la autenticación simulada (900ms). Al iniciar sesión redirige a `/`.

### `ForgotPasswordPage`

Envío de solicitud de recuperación. Valida que el email sea `@iecol.edu.co`. Muestra confirmación con instrucciones.

### `DashboardPage`

Vista principal para todos los roles. Contiene:
- `KPICard` × 4: alertas del día, pendientes, confirmadas, descartadas.
- `ClassroomTabs`: selector de aula con indicador de estado.
- `RightPanel` (en layout): feed de alertas recientes.

### `HistoryPage`

Tabla filtrable de alertas históricas con filtros por:
- Tipo de alerta.
- Estado.
- Rango de fechas.
- Aula.

### `CoordinatorPage`

Solo accesible para coordinadores y administradores. Incluye:
- `BarChart`: alertas por día de la semana.
- `TypeChart`: distribución porcentual por tipo.
- `Heatmap`: mapa de calor hora × aula.
- `ClassroomRanking`: listado ordenado de aulas por incidencias.

### `AdminPage`

Panel de administración con 4 pestañas:

| Pestaña | Contenido |
|---|---|
| Usuarios | Tabla de usuarios con `UserRow`. Botón crear usuario. Toggle activo/inactivo. |
| Cámaras | Tabla de cámaras con `CameraRow`. Estado RTSP en tiempo real. |
| Configuración IA | `ThresholdSlider` para umbral de confianza de cada tipo. |
| Sistema | `ModuleStatus` por módulo. `LogViewer` de logs recientes. |

### Componentes UI atómicos

| Componente | Props clave | Uso |
|---|---|---|
| `Badge` | `type`, `label` | Etiqueta de estado/rol |
| `ConfidenceBar` | `value` (0-1) | Visualización de confianza IA |
| `Icon` | `name`, `size`, `color` | Iconos SVG inline |
| `Modal` | `isOpen`, `onClose`, `title` | Overlay accesible con trampa de foco |
| `Skeleton` | `width`, `height` | Placeholder animado durante carga |
| `Toast` | Gestionado por `ToastContext` | Notificación efímera |
| `Tooltip` | `content`, `position` | Información contextual al hover |

---

## 13. Sistema de diseño

### Paleta de colores (tema oscuro)

```css
/* Fondos */
--surface-0: #0f172a    /* fondo base */
--surface-1: #1e293b    /* panel/sidebar */
--surface-2: #334155    /* cards */
--surface-3: #475569    /* elementos elevados */

/* Alertas */
--alert-danger:  #ef4444   /* agresión */
--alert-warning: #f59e0b   /* aislamiento */
--alert-info:    #3b82f6   /* caída */
--alert-success: #22c55e   /* confirmada */
```

### Animaciones personalizadas

| Clase | Efecto |
|---|---|
| `animate-pulse-slow` | Pulsación lenta para indicadores de cámara activa |
| `animate-shimmer` | Efecto shimmer en skeletons de carga |
| `animate-fade-in` | Entrada suave de modales y toasts |
| `animate-slide-up` | Entrada desde abajo de paneles |

### Tipografía

- **Inter** (`font-sans`): texto de interfaz, etiquetas, títulos.
- **JetBrains Mono** (`font-mono`): IDs de alertas, timestamps, datos técnicos.

---

## 14. Capa de datos

### Modo prototipo (actual)

La aplicación usa datos mock de `src/data/mockData.js`. No realiza llamadas HTTP reales. Los datos incluyen:

- Usuarios con diferentes roles.
- 6 aulas con estados variados.
- Cámaras RTSP por aula.
- Alertas en todos los estados del ciclo de vida.
- Estadísticas pre-calculadas para coordinador y admin.

### Simulación de tiempo real

`AlertContext` genera nuevas alertas cada **45 segundos** con:
- Tipo aleatorio.
- Aula aleatoria.
- Confianza entre 0.75 y 0.99.

### Migración al backend real

Para conectar al API REST de `SAFECLASS_Backend`:

1. Crear `src/api/` con clientes HTTP (fetch/axios por módulo).
2. Reemplazar los mocks en los contextos por llamadas reales.
3. Reemplazar la simulación de SSE por una conexión real a `/api/alerts/stream`.
4. Mover las credenciales al token JWT devuelto por el backend.

---

## 15. Constantes y configuración del dominio

### `src/constants/roles.js`

- `ROLES`: constantes de los tres roles del sistema.
- `ROLE_LABELS`: etiqueta y color de badge por rol.
- `ROLE_NAV`: qué secciones de navegación ve cada rol.
- `getRoleFromEmail(email)`: inferencia de rol por email.

### `src/constants/alertConfig.js`

- `ALERT_TYPES`: claves normalizadas de tipos.
- `ALERT_CONFIG`: icono, color y fondo por tipo de alerta.
- `ALERT_STATUS`: claves de estados.
- `STATUS_CONFIG`: color y etiqueta por estado.
- `DISCARD_REASONS`: array de razones de descarte predefinidas.
- `DEFAULT_CONFIDENCE_THRESHOLD`: umbral mínimo de confianza (0.75).

### `src/constants/camStatus.js`

Configuración visual (color, etiqueta, icono) para cada estado de cámara: `online`, `offline`, `error`.

---

## 16. Utilidades

### `src/utils/formatters.js`

| Función | Descripción |
|---|---|
| `formatDate(isoString)` | Fecha localizada: `"21 may 2026"` |
| `formatTime(isoString)` | Hora: `"14:35"` |
| `formatDateTime(isoString)` | Fecha y hora: `"21 may 2026 · 14:35"` |
| `formatRelative(isoString)` | Relativo: `"hace 5 minutos"` |
| `formatDuration(ms)` | Duración: `"1h 23m"` |

---

## 17. Convenciones de código

- **JSX con `.jsx`**: todos los componentes usan extensión `.jsx`; hooks y constantes usan `.js`.
- **Alias `@/`**: importar siempre desde `@/` en lugar de rutas relativas profundas (`../../`).
- **Contextos**: nunca acceder directamente al contexto con `useContext`; usar siempre el hook de conveniencia (`useAuth`, `useAlerts`, `useToast`).
- **Componentes funcionales**: solo componentes funcionales con hooks. Sin clases.
- **Estilo Tailwind**: clases inline en JSX. Evitar CSS ad-hoc salvo en `index.css` para estilos globales.
- **Nombrado**: componentes en `PascalCase`, hooks en `camelCase` con prefijo `use`, archivos de componentes en `PascalCase.jsx`.
- **Props**: desestructurar en la firma del componente. Documentar props no obvias con un comentario de una línea.
- **Immutabilidad**: nunca mutar estado directamente. Usar el patrón `setState(prev => ...)` para actualizaciones basadas en estado previo.

---

## 18. Guía de contribución

### Añadir una nueva página

1. Crear `src/pages/<seccion>/<NombrePage>.jsx`.
2. Añadir la ruta en `AppShell.jsx` (rutas internas) o `App.jsx` (rutas públicas).
3. Si requiere protección por rol, usar el patrón de `ROLE_NAV` o añadir una guarda de rol inline.

### Añadir un nuevo componente UI

1. Crear en `src/components/ui/<Nombre>.jsx`.
2. Exportar con `export default` o export nombrado.
3. Añadir al `index.js` del directorio si existe.
4. Mantenerlo sin dependencia de contextos globales para facilitar reutilización.

### Añadir un tipo de alerta

1. Añadir la clave en `ALERT_TYPES` (`constants/alertConfig.js`).
2. Añadir su configuración visual en `ALERT_CONFIG`.
3. Actualizar `mockData.js` con alertas del nuevo tipo para pruebas.
4. Sincronizar con el backend: añadir el valor en el enum `AlertType` de `prisma/schema.prisma`.

### Añadir una nueva animación Tailwind

En `tailwind.config.js`, añadir la keyframe y la clase de animación bajo `theme.extend`:

```js
keyframes: {
  'nueva-anim': { '0%': { opacity: 0 }, '100%': { opacity: 1 } }
},
animation: {
  'nueva-anim': 'nueva-anim 0.3s ease-out'
}
```
