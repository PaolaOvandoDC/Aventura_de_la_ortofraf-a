# La Aventura de la Ortografía

Este proyecto es una web educativa hecha con Node.js, Express, EJS, MongoDB y Cloudinary. Sirve para mostrar contenidos escolares como tareas, juegos, publicaciones, galería y un panel de administración.

## 1. Cómo está dividido el proyecto

### Backend
El backend está encargado de:
- recibir peticiones del navegador,
- consultar y guardar datos en MongoDB,
- manejar sesiones de administrador,
- subir imágenes a Cloudinary,
- renderizar páginas con EJS.

Archivos principales:
- [server.js](server.js): punto de entrada de la app. Aquí se crea el servidor, se configuran middlewares, sesiones y rutas.
- [routes/](routes): define las rutas de la aplicación. Cada archivo corresponde a una parte del sitio.
- [models/](models): esquemas de MongoDB para fotos, tareas, juegos, publicaciones y otros contenidos.
- [middleware/upload.js](middleware/upload.js): configuración para subir imágenes a Cloudinary.

### Frontend
El frontend está formado por:
- plantillas EJS en [views/](views),
- estilos en [public/css/style.css](public/css/style.css),
- JavaScript interactivo en [public/js/main.js](public/js/main.js).

La idea es simple:
- el backend prepara los datos,
- EJS muestra esas páginas en el navegador,
- el JavaScript añade interactividad como animaciones, lightbox y menús.

## 2. Estructura general

```text
Naye/
├── server.js
├── package.json
├── middleware/
│   └── upload.js
├── models/
│   ├── Game.js
│   ├── LearningPost.js
│   ├── LessonPost.js
│   ├── Photo.js
│   ├── SiteSettings.js
│   ├── StudentWork.js
│   ├── Task.js
│   └── WeeklyChallenge.js
├── routes/
│   ├── admin.js
│   ├── aprendemos.js
│   ├── aprendizaje.js
│   ├── escritor.js
│   ├── galeria.js
│   ├── index.js
│   ├── juegos.js
│   └── tareas.js
├── views/
│   ├── admin/
│   ├── aprendemos.ejs
│   ├── aprendizaje.ejs
│   ├── escritor.ejs
│   ├── galeria.ejs
│   ├── home.ejs
│   ├── juegos.ejs
│   ├── layout.ejs
│   └── tareas.ejs
├── public/
│   ├── css/
│   ├── images/
│   ├── js/
│   └── uploads/
```

## 3. Qué hace cada parte

### Server
[server.js](server.js) es el corazón. Aquí:
- se inicia Express,
- se conecta a MongoDB,
- se configuran sesiones,
- se registran las rutas,
- se sirve la carpeta public.

### Rutas
En [routes/](routes) cada archivo controla una sección del sitio:
- [routes/index.js](routes/index.js): página principal.
- [routes/galeria.js](routes/galeria.js): galería.
- [routes/juegos.js](routes/juegos.js): juegos.
- [routes/aprendemos.js](routes/aprendemos.js): publicaciones educativas.
- [routes/tareas.js](routes/tareas.js): tareas del rincón escolar.
- [routes/escritor.js](routes/escritor.js): producciones escritas de estudiantes.
- [routes/aprendizaje.js](routes/aprendizaje.js): recursos de aprendizaje.
- [routes/admin.js](routes/admin.js): panel administrativo.

### Modelos
En [models/](models) están los esquemas que dicen cómo se guardan los datos en MongoDB.
Por ejemplo:
- [models/Task.js](models/Task.js): guarda tareas.
- [models/Photo.js](models/Photo.js): guarda fotos de la galería.
- [models/Game.js](models/Game.js): guarda juegos.
- [models/LessonPost.js](models/LessonPost.js): guarda publicaciones de Aprendemos.
- [models/StudentWork.js](models/StudentWork.js): guarda trabajos escritos de estudiantes.

### Vistas
En [views/](views) están las páginas que ve el usuario. Son plantillas EJS, que mezclan HTML con datos del backend.
Ejemplo:
- [views/home.ejs](views/home.ejs): página de inicio.
- [views/tareas.ejs](views/tareas.ejs): listado de tareas.
- [views/admin/dashboard.ejs](views/admin/dashboard.ejs): panel para administrar contenido.

### Archivos públicos
En [public/](public) van los recursos estáticos:
- [public/css/style.css](public/css/style.css): estilos del sitio.
- [public/js/main.js](public/js/main.js): interacciones del frontend.
- [public/images](public/images) y [public/uploads](public/uploads): imágenes y recursos.

## 4. Flujo de una petición típica

1. El navegador entra a una URL como /tareas.
2. Express recibe esa ruta desde [server.js](server.js).
3. La ruta correspondiente en [routes/tareas.js](routes/tareas.js) pide datos a MongoDB.
4. El backend prepara esos datos y los envía a una vista EJS.
5. EJS arma la página HTML.
6. El navegador muestra la página y el JavaScript de [public/js/main.js](public/js/main.js) añade efectos e interacciones.

## 5. Cómo trabajar con este proyecto

### Para correrlo localmente
```bash
npm install
npm start
```

### Para editar contenido
- Para agregar contenido visual, entra al panel de administración en /admin.
- Para modificar el diseño, edita [public/css/style.css](public/css/style.css).
- Para agregar interacciones, edita [public/js/main.js](public/js/main.js).
- Para cambiar la lógica de cada sección, revisa [routes/](routes).

## 6. Resumen simple

- Backend: Express + MongoDB + rutas + modelos + subida de imágenes.
- Frontend: EJS + CSS + JavaScript.
- Admin: panel para manejar contenido sin tocar código.

## 7. Cambios recientes (rápido)

- Se quitó el efecto de "estrellitas" que seguía el cursor para reducir carga en el navegador. Archivos afectados: `public/js/main.js` y `views/layout.ejs`.
- Se agregó edición inline para `Tareas` y se añadió un control `Editar` en el panel de administración (parcial). Archivo afectado: `views/admin/dashboard.ejs`.

Estos cambios reducen el uso de CPU en el navegador y facilitan la edición desde el admin.

## 8. Cómo subir cambios a GitHub (rápido)

Desde la carpeta del proyecto ejecuta los siguientes comandos en PowerShell o terminal:

```powershell
cd "c:\Users\Asus\Downloads\aplicaciones\NADIA_OVANDO\Naye"
git add README.md views/layout.ejs public/js/main.js views/admin/dashboard.ejs
git commit -m "Docs: actualizar README con cambios recientes (cursor, admin edit)"
git push origin main
```

Después de `git push`, si tu repo está conectado con Render, el servicio debería desplegarse automáticamente.


