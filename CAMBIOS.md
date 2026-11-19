# Cambios de la migración a React

## Objetivo

Modernizar la interfaz de Tie-Up sin reemplazar el backend PHP ni modificar la base MySQL `tieup`.

## Qué se mantuvo

- Identidad, textos, colores y diseño general.
- Base de datos MySQL existente.
- Registro, login, sesiones y permisos procesados por PHP.
- Consultas preparadas y contraseñas protegidas con hash.

## Qué cambió

- El HTML se dividió en componentes y páginas JSX.
- La navegación se centralizó en `App.jsx`.
- La interfaz dinámica utiliza `useState`.
- La carga inicial y las consultas utilizan `useEffect`.
- Las listas se renderizan con `.map()` y claves únicas.
- Los filtros utilizan `.filter()`.
- Las peticiones se centralizaron en `src/api.js` mediante `fetch`.
- PHP responde en JSON como una API.
- Se añadieron estados de carga, error y confirmación.

## Arquitectura actual

```text
Usuario -> React -> api.js/fetch -> API PHP -> MySQL
```

React controla la interfaz. PHP conserva la lógica del servidor, las sesiones y los permisos. MySQL persiste los usuarios, servicios y mensajes.

## Funcionalidades migradas

- Página de inicio.
- Catálogo y búsqueda de servicios.
- Registro e inicio de sesión.
- Formulario de soporte.
- Cuenta privada.
- Publicación y gestión de servicios.
- Panel administrativo.

## Decisiones

- No se incorporaron Axios, Redux, React Router ni TypeScript.
- Se utilizó `fetch`, como solicita la guía.
- La navegación utiliza el hash para evitar dependencias adicionales.
- La versión PHP anterior se conservó en una carpeta separada.

## Incidencias resueltas

- Adaptación de rutas entre Vite y Apache.
- Envío de cookies de sesión con `credentials: 'include'`.
- CORS limitado a los orígenes locales de desarrollo.
- Configuración reutilizable de la conexión MySQL.
- Separación completa entre la versión original y la migración.

## Pendiente para producción

- Publicar la API y MySQL en un hosting compatible con PHP.
- Configurar `VITE_API_URL` con la dirección pública del backend.
- Añadir dominio y HTTPS definitivos.
