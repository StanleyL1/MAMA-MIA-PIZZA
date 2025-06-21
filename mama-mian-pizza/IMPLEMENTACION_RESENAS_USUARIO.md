# Implementación Completa de Reseñas y Experiencias de Usuario

## Descripción
Se implementó la integración completa de dos endpoints principales:
- `https://api.mamamianpizza.com/api/resenas/usuario/{id}` para obtener reseñas de productos
- `https://api.mamamianpizza.com/api/experiencias/user/{id}` para obtener experiencias del usuario
- `https://api.mamamianpizza.com/api/experiencias` (POST) para crear nuevas experiencias

La funcionalidad incluye tanto la visualización de contenido existente como la creación de nuevas experiencias mediante un modal interactivo.

## Archivos Creados/Modificados

### 1. Servicios Utilizados:
- **`src/services/resenasService.js`** (Nuevo): Manejo de reseñas de productos
- **`src/services/experienciasService.js`** (Existente): Manejo de experiencias del usuario
  - Función `crearExperiencia()` ya implementada para POST

### 2. Nuevos Componentes Creados:
- **`src/components/CrearExperiencia/CrearExperiencia.jsx`** (Nuevo): Formulario para crear experiencias
- **`src/components/CrearExperiencia/ModalExperiencia.jsx`** (Nuevo): Modal wrapper para el formulario
- **`src/components/CrearExperiencia/CrearExperiencia.css`** (Nuevo): Estilos del formulario
- **`src/components/CrearExperiencia/ModalExperiencia.css`** (Nuevo): Estilos del modal
- **`src/components/CrearExperiencia/index.js`** (Nuevo): Archivo de exportación

### 3. Componente Actualizado: `src/components/Perfil/Perfil.jsx`
- **Nuevos estados para experiencias**:
  - `experiencias`: Array de experiencias del usuario
  - `loadingExperiencias`: Estado de carga de experiencias
  - `errorExperiencias`: Manejo de errores de experiencias
  - `isModalExperienciaOpen`: Control del modal de crear experiencia

- **Funciones actualizadas**:
  - `fetchExperiencias()`: Obtiene experiencias del usuario
  - `refreshResenasYExperiencias()`: Actualiza ambos tipos de contenido
  - `getEstadoExperiencia()`: Determina el estado de una experiencia
  - `handleExperienciaCreada()`: Maneja la creación exitosa de experiencias
  - `handleAbrirModalExperiencia()`: Abre el modal de crear experiencia
  - `handleCerrarModalExperiencia()`: Cierra el modal

- **Integración completa**:
  - Sección combinada con estadísticas de ambos tipos
  - Carga simultánea de reseñas y experiencias
  - Manejo de errores unificado
  - Modal integrado para crear nuevas experiencias
  - Botones para crear experiencias en múltiples ubicaciones

### 4. Estilos Actualizados: `src/components/Perfil/Perfil.css`
- **Nuevos estilos para la sección unificada**:
  - `.perfil__contenido-container`: Contenedor principal
  - `.perfil__seccion`: Secciones individuales (reseñas/experiencias)
  - `.perfil__seccion-header`: Header con título y botón de agregar
  - `.perfil__seccion-titulo`: Títulos de cada sección
  - `.perfil__add-btn`: Botón para agregar nuevas experiencias
  - `.perfil__experiencia-card`: Tarjetas para experiencias
  - `.perfil__experiencia-header`: Encabezado de experiencias
  - `.perfil__experiencia-meta`: Metadata de experiencias
  - `.perfil__experiencia-estado`: Estado de aprobación
  - `.perfil__empty-actions`: Acciones en estado vacío

- **Estilos existentes adaptados**:
  - Estadísticas expandidas para incluir experiencias
  - Estados de carga y error para ambos tipos
  - Responsive design mejorado

## Estructura de Datos

### Respuesta del Endpoint de Reseñas
```json
{
  "message": "Reseñas del usuario obtenidas exitosamente",
  "usuario": {
    "id_usuario": 16,
    "nombre_usuario": "milenas",
    "total_resenas": 1,
    "resenas_aprobadas": 1,
    "resenas_pendientes": 0
  },
  "resenas": [
    {
      "id_resena": 4,
      "id_producto": 13,
      "nombre_producto": "Hawaiana Pizza",
      "comentario": "La pizza de piña es la mejor ❤👌",
      "valoracion": 5,
      "aprobada": 1,
      "estado": "aprobada",
      "fecha_creacion": "2025-06-19T05:55:53.000Z"
    }
  ]
}
```

### Respuesta del Endpoint de Experiencias
```json
{
  "message": "Experiencias del usuario obtenidas exitosamente",
  "experiencias": [
    {
      "id": 1,
      "titulo": "Experiencia increíble",
      "contenido": "La atención fue excelente y la comida deliciosa",
      "valoracion": 5,
      "estado": 1,
      "fecha_creacion": "2025-06-20T10:30:00.000Z"
    }
  ]
}
```

### Estructura para Crear Nueva Experiencia (POST)
```json
{
  "titulo": "Excelente experiencia",
  "valoracion": 5,
  "id_usuario": 1,
  "contenido": "La pizza estaba deliciosa y el servicio fue excelente."
}
```

## Características Implementadas

### 1. Estadísticas Unificadas del Usuario
- Total de reseñas de productos
- Reseñas aprobadas y pendientes
- Total de experiencias compartidas
- Experiencias aprobadas y pendientes

### 2. Sección de Reseñas de Productos (🍕)
- Nombre del producto reseñado
- Valoración con estrellas (⭐/☆)
- Comentario completo
- Estado de aprobación (aprobada/pendiente)
- Fecha de creación formateada

### 3. Sección de Experiencias (✨)
- Título de la experiencia
- Valoración con estrellas
- Contenido de la experiencia
- Estado de aprobación
- Fecha de creación
- **Botón para crear nuevas experiencias**

### 4. Modal de Crear Experiencia
- **Formulario completo** con validaciones
- **Campo título** (mínimo 5 caracteres, máximo 100)
- **Sistema de valoración** interactivo con estrellas
- **Campo contenido** (mínimo 20 caracteres, máximo 500)
- **Contador de caracteres** en tiempo real
- **Validaciones** en tiempo real y al enviar
- **Estados de carga** durante el envío
- **Manejo de errores** con mensajes específicos
- **Diseño responsive** para todos los dispositivos

### 5. Estados de Interfaz
- **Carga**: Indicador mientras se obtienen ambos tipos de datos
- **Error**: Mensajes de error con botón de reintento para ambos
- **Vacío**: Mensaje cuando no hay contenido con enlaces al menú y modal de experiencias
- **Éxito**: Secciones separadas para reseñas y experiencias

### 6. Funcionalidades UX
- Botón de actualización manual (🔄) para ambos tipos
- **Múltiples puntos de acceso** para crear experiencias:
  - Botón en estado vacío
  - Botón "+ Nueva Experiencia" en la sección de experiencias existentes
- Animación en hover del botón de actualización
- Estados visuales claros (aprobada/pendiente) con colores diferentes
- Formato de fecha legible en español
- Secciones visualmente diferenciadas con iconos
- **Modal con overlay** y animaciones suaves
- **Validación en tiempo real** del formulario
- **Feedback inmediato** al usuario

## Diferencias Visuales

### Reseñas de Productos
- **Color**: Borde rojo (tema principal de la pizzería)
- **Icono**: 🍕 (relacionado con productos)
- **Contenido**: Enfocado en productos específicos

### Experiencias
- **Color**: Borde verde (diferenciación visual)
- **Icono**: ✨ (relacionado con experiencias)
- **Contenido**: Enfocado en experiencias generales del servicio

## Manejo de Errores
- Captura de errores de red
- Mensajes de error descriptivos
- Botón de reintento
- Fallbacks para datos faltantes

## Responsive Design
- Adaptación de estadísticas para móviles
- Layout de reseñas responsive
- Botones optimizados para touch

## Uso
1. **Ver Contenido Existente**:
   - El usuario debe estar logueado
   - Navegar a la pestaña "Mis reseñas y experiencias" en el perfil
   - Los datos se cargan automáticamente al seleccionar la pestaña
   - Se muestran estadísticas consolidadas en la parte superior
   - Las reseñas y experiencias se presentan en secciones separadas

2. **Crear Nueva Experiencia**:
   - **Desde estado vacío**: Hacer clic en "Compartir Experiencia"
   - **Desde sección existente**: Hacer clic en "+ Nueva Experiencia"
   - Se abre un modal con formulario completo
   - Llenar título, valoración y contenido
   - El formulario valida en tiempo real
   - Al enviar, se muestra confirmación y se actualiza la lista

3. **Funcionalidades Adicionales**:
   - Posibilidad de actualizar manualmente con el botón 🔄
   - Enlaces para crear reseñas dirigiendo al menú
   - Estados visuales claros para cada elemento

## APIs Integradas
1. **Reseñas**: `GET /api/resenas/usuario/{id}` - Obtener reseñas existentes
2. **Experiencias**: `GET /api/experiencias/user/{id}` - Obtener experiencias existentes  
3. **Crear Experiencia**: `POST /api/experiencias` - Crear nueva experiencia

## Próximas Mejoras Sugeridas
- Paginación para usuarios con mucho contenido
- Filtros por estado de aprobación
- Opciones de editar/eliminar reseñas y experiencias
- Búsqueda por título o producto
- Ordenamiento por fecha/valoración
- Exportar historial en PDF
- Notificaciones de cambios de estado
- **Formulario para crear reseñas de productos**
- **Subida de imágenes en experiencias**
- **Sistema de me gusta/reacciones**
