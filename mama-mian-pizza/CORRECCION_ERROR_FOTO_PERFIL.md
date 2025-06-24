# Corrección Error Foto de Perfil

## Problema Identificado
El error "Objects are not valid as a React child" ocurría porque:

1. En `Perfil.jsx` se enviaban objetos como `{ message: '...', type: '...' }` a `setToast`
2. La función `showToast` en `App.jsx` esperaba solo strings
3. El botón "Reintentar" aparecía en la sección de información del perfil en lugar de en la sección de edición

## Cambios Realizados

### 1. Corrección de setToast
- **Problema**: Se pasaban objetos `{ message, type }` a `setToast`
- **Solución**: Cambiar todas las llamadas a `setToast` para pasar solo el mensaje como string
- **Archivos afectados**:
  - `src/components/Perfil/Perfil.jsx`
  - `src/components/CrearExperiencia/CrearExperiencia.jsx`

### 2. Reorganización de errores de foto
- **Problema**: Los errores de foto aparecían en la cabecera del perfil
- **Solución**: 
  - Agregado nuevo estado `photoError` específico para errores de foto
  - Movidos los errores de foto a la sección "Editar Perfil"
  - Filtrado `profileMessage` para excluir mensajes de foto del header

### 3. Eliminación del botón "Reintentar"
- **Problema**: Botón "Reintentar" aparecía en la información del perfil
- **Solución**: Removido el botón de la sección de error de carga de usuario

### 4. Estados agregados
```javascript
const [photoError, setPhotoError] = useState('');
const [editError, setEditError] = useState('');
```

### 5. Funciones modificadas
- `handlePhotoSelect`: Ahora usa `setPhotoError` en lugar de `showProfileMessage`
- `handleSavePhoto`: Usa `setPhotoError` para errores de foto
- `handleCancelPhoto`: Limpia `photoError`

### 6. UI actualizada
- Los errores de foto ahora aparecen solo en la sección "Editar Perfil"
- No hay botón "Reintentar" en la cabecera del perfil
- Filtro en `profileMessage` para evitar duplicación de mensajes de foto

## Resultado
- ✅ Eliminado el error de runtime "Objects are not valid as a React child"
- ✅ Removido el botón "Reintentar" de la cabecera del perfil
- ✅ Los errores de actualización de foto ahora aparecen solo en la sección "Editar Perfil"
- ✅ Mejor experiencia de usuario con mensajes de error contextuales

## Verificación
Para verificar que los cambios funcionan correctamente:
1. Intentar subir una foto inválida → Error debe aparecer en sección "Editar Perfil"
2. Error de carga de usuario → No debe mostrar botón "Reintentar"
3. Todas las notificaciones toast deben funcionar sin errores de runtime
