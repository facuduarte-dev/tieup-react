# Tie-Up - React, PHP y MySQL

Tie-Up es una plataforma que conecta profesionales digitales con personas que necesitan contratar servicios. Esta versión migra la interfaz original a React y conserva PHP como backend y MySQL como base de datos.

## Tecnologías

- React 19 y Vite para la interfaz.
- PHP 8 y MySQL/MariaDB para la API y los datos.
- CSS responsive con la identidad visual original de Tie-Up.

## Funcionalidades

- Inicio y catálogo de servicios con búsqueda.
- Registro, inicio y cierre de sesión.
- Formulario de soporte conectado a MySQL.
- Cuenta privada y publicación de servicios.
- Panel administrativo con control de roles.
- Estados de carga, éxito y error.

## Estructura

```text
api/              API PHP y conexión a MySQL
src/components/   Componentes reutilizables
src/pages/        Pantallas de React
src/styles/       Estilos originales y adaptaciones responsive
src/api.js        Cliente fetch centralizado
src/App.jsx       Sesión, navegación y páginas protegidas
```

## Requisitos

- XAMPP con Apache y MySQL activos.
- Base de datos `tieup` instalada.
- Node.js 22 o superior.
- pnpm o npm.

## Ejecución local

1. Colocar el proyecto en `C:\xampp\htdocs\sofka-migracion-react`.
2. Encender Apache y MySQL desde XAMPP.
3. Verificar que exista la base `tieup`.
4. Instalar dependencias y levantar Vite:

```bash
pnpm install
pnpm run dev
```

5. Abrir `http://127.0.0.1:5173/`.

La API local se encuentra en:

```text
http://localhost/sofka-migracion-react/api/index.php
```

## Credenciales de base de datos

El entorno local de XAMPP utiliza `localhost`, usuario `root`, contraseña vacía y base `tieup`. Para un servidor se puede definir `TIEUP_CREDENTIALS_FILE` con la ruta de un archivo privado basado en `.db_credentials.example.txt`.

Nunca se debe subir el archivo real de credenciales.

## Comandos

```bash
pnpm run dev      # servidor de desarrollo
pnpm run build    # compilación optimizada
pnpm run lint     # revisión del código
pnpm run preview  # vista previa de dist
```

## GitHub Pages

GitHub Pages publica únicamente el frontend estático. PHP y MySQL necesitan un hosting compatible para que catálogo, autenticación, soporte y administración funcionen fuera del equipo local.

## Migración

Consulta [CAMBIOS.md](CAMBIOS.md) para conocer las decisiones y fases de la migración.
