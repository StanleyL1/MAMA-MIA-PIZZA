# Integración del Endpoint de Usuarios

Este documento describe la implementación de la integración con el endpoint de usuarios de la API de Mama Mia Pizza.

## Endpoint Implementado

**URL:** `https://api.mamamianpizza.com/api/users/{id}`  
**Método:** GET  
**Descripción:** Obtiene la información completa de un usuario por su ID

### Respuesta de la API

```json
{
  "id_usuario": 1,
  "nombre": "ERICK",
  "correo": "admin_1749692622800@mamamianpizza.com",
  "celular": "70830446",
  "fecha_nacimiento": null,
  "sexo": null,
  "dui": null,
  "foto_perfil": null
}
```

## Archivos Modificados/Creados

### 1. Servicio de Usuarios (`src/services/usuariosService.js`)

Nuevo archivo que contiene todas las funciones para interactuar con los endpoints de usuarios:

- `obtenerUsuario(userId)` - Obtiene información del usuario
- `actualizarUsuario(userId, userData)` - Actualiza información del usuario
- `actualizarFotoPerfil(userId, file)` - Actualiza la foto de perfil
- `cambiarPassword(userId, passwordData)` - Cambia la contraseña

### 2. Hook Personalizado (`src/hooks/useUsuario.js`)

Hook React personalizado que encapsula la lógica del estado y las operaciones del usuario:

```javascript
const {
  userInfo,        // Información del usuario
  loading,         // Estado de carga
  error,           // Errores
  fetchUserInfo,   // Obtener información
  updateUserInfo,  // Actualizar información
  updateProfilePhoto, // Actualizar foto
  changePassword,  // Cambiar contraseña
  clearError,      // Limpiar errores
  retry           // Reintentar operación
} = useUsuario();
```

### 3. Componente Perfil (`src/components/Perfil/Perfil.jsx`)

**Cambios principales:**

1. **Importación del hook y servicio:**
   ```javascript
   import { useUsuario } from '../../hooks/useUsuario';
   ```

2. **Campos de formulario actualizados:**
   - `nombre` - Nombre completo del usuario
   - `celular` - Número de teléfono
   - `fecha_nacimiento` - Fecha de nacimiento (date input)
   - `sexo` - Género (select: M/F/Otro)
   - `dui` - Documento de identidad

3. **Gestión de estado mejorada:**
   - Estados de carga y error manejados por el hook
   - Actualización automática de la información tras cambios
   - Validaciones mejoradas

4. **Interfaz actualizada:**
   - Indicadores de carga durante operaciones
   - Mensajes de error específicos
   - Botones de reintento
   - Campos de formulario que reflejan la estructura real de la API

### 4. Estilos CSS (`src/components/Perfil/Perfil.css`)

**Nuevos estilos agregados:**

```css
/* LOADING OVERLAY PARA FOTO */
.perfil__loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ab1319;
  font-size: 1.5rem;
}

/* BOTÓN DE REINTENTAR */
.perfil__retry-btn {
  background: #ab1319;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.2s;
}
```

## Funcionalidades Implementadas

### 1. Carga de Información del Usuario
- Se obtiene automáticamente al cargar el componente
- Manejo de estados de carga y error
- Opción de reintento en caso de fallo

### 2. Actualización de Perfil
- Formulario con validaciones
- Campos que coinciden con la estructura de la API
- Feedback visual durante la actualización

### 3. Cambio de Foto de Perfil
- Subida de archivos de imagen
- Preview antes de guardar
- Integración con el endpoint de actualización de foto

### 4. Cambio de Contraseña
- Validación de contraseña actual
- Confirmación de nueva contraseña
- Validaciones de seguridad (mínimo 6 caracteres)

## Manejo de Errores

El sistema incluye manejo comprehensivo de errores:

1. **Errores de red:** Timeout, conexión perdida, etc.
2. **Errores de API:** Códigos de estado HTTP específicos
3. **Errores de validación:** Campos requeridos, formatos incorrectos
4. **Errores de autenticación:** Usuario no autorizado

## Estados de Carga

Todos los componentes muestran indicadores visuales durante:
- Carga inicial de datos
- Actualizaciones de información
- Subida de archivos
- Cambios de contraseña

## Uso

Para usar este componente, simplemente pásale un objeto `user` con un `id`:

```javascript
<Perfil 
  user={{ id: 1, email: "usuario@ejemplo.com" }}
  setToast={setToast}
  updateUser={updateUser}
/>
```

El componente se encargará automáticamente de:
1. Obtener la información completa del usuario desde la API
2. Mostrar la información en la interfaz
3. Permitir ediciones y actualizaciones
4. Manejar todos los estados y errores correspondientes

## Notas Técnicas

- El hook `useUsuario` está diseñado para ser reutilizable en otros componentes
- Todas las operaciones son asíncronas y manejan errores apropiadamente
- Los formularios se validan tanto en el frontend como en el backend
- La información se actualiza automáticamente tras cada operación exitosa
