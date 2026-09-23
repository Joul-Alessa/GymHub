# Implementation Log — 2026-09-08

> Nota: el nombre solicitado usaba barras (`08/09/2026`), pero Windows no permite `/` en nombres de archivo. Se sustituyeron por guiones: `Implementation-Log-08-09-2026.md`.

## Objetivo de la sesión

Construir el MVP de **Sportus** descrito en [Specs.md](Specs.md): catálogo de ejercicios, sistema de métricas flexible, diario de entrenamiento, gráficas de progreso/actividad, single-user sin autenticación, con arquitectura preparada para evolucionar a multi-usuario.

## Decisiones acordadas antes de implementar

| Tema | Decisión |
|---|---|
| Alcance | Solo MVP (fase 1 del spec) |
| Fotos de ejercicios | Filesystem local (`backend/uploads/`), la DB solo guarda la ruta |
| Lenguaje/gestor | npm + JavaScript plano (sin TypeScript) |
| Gráficas | Recharts para líneas; heatmap estilo GitHub construido a medida con CSS Grid |
| `package.json` | Generados vía `npm init`/`npm install`, nunca escritos a mano |
| Estructura | `frontend/` y `backend/` como carpetas top-level independientes |

## Estructura del repositorio creada

```
GymHub/
  Docs/
    Specs.md
    Implementation-Log-08-09-2026.md
  backend/
    src/
      db/                # schema.sql, connection.js (better-sqlite3 + seed)
      middleware/         # errorHandler.js, upload.js (multer)
      modules/
        sports/
        subclassifications/
        exercises/
        metrics/
        trainingSessions/
        stats/
      app.js
      server.js
    uploads/               # fotos subidas (gitignored)
    .env.example
  frontend/
    src/
      api/                 # cliente fetch por recurso
      components/
        common/            # Clay.jsx, Layout.jsx (design system claymorphism)
        exercises/         # ExerciseForm.jsx
        diary/             # EntryForm.jsx
        charts/            # ProgressLineChart.jsx, ActivityHeatmap.jsx
      pages/               # CatalogPage, ExerciseDetailPage, DiaryPage, StatsPage, MetricsPage, SettingsPage
      styles/theme.css      # variables CSS del tema claymorphism
  .claude/launch.json       # config para levantar el frontend con el Browser tool
  .gitignore
```

## Backend

- **Runtime**: Express 5, `better-sqlite3`, `multer`, `cors`, `dotenv`. Módulos organizados como `routes.js` → `controller.js` → `repository.js`.
- **Base de datos**: esquema SQLite en [backend/src/db/schema.sql](../backend/src/db/schema.sql) con tablas `sports`, `subclassifications`, `exercises`, `exercise_subclassifications`, `exercise_photos`, `metrics`, `units`, `exercise_common_metrics`, `training_sessions`, `training_entries`, `entry_metrics`.
  - Todas las tablas top-level incluyen una columna `user_id` nullable sin usar, como preparación explícita para el modo multi-usuario futuro.
  - `sports` y `subclassifications` **no tienen endpoint DELETE** (solo create/edit), tal como exige el spec para evitar problemas relacionales.
  - `training_entries.difficulty` tiene un `CHECK (difficulty BETWEEN 1 AND 5)` a nivel de base de datos.
- **Seed automático** al iniciar (si la DB está vacía): sports Gym/Basketball con sus subclasificaciones, y métricas comunes (Weight, Repetitions, Time, Distance, Calories, Heart Rate, Height) con sus unidades.
- **Endpoints principales**:
  - `GET/POST/PUT /api/sports`
  - `GET/POST/PUT /api/subclassifications`
  - `GET/POST/PUT/DELETE /api/exercises`, `POST/DELETE /api/exercises/:id/photos`, `GET /api/exercises/:id/history`, `GET /api/exercises/:id/progress`
  - `GET/POST/PUT /api/metrics`, `GET/POST /api/metrics/:id/units`, `PUT /api/metrics/units/:id`
  - `GET/POST/DELETE /api/training-sessions`, `POST/PUT/DELETE /api/training-sessions/:id/entries`
  - `GET /api/stats/heatmap`, `GET /api/stats/activity`
- **Fotos**: subidas vía `multipart/form-data` con `multer`, guardadas en `backend/uploads/`, servidas estáticamente en `/uploads`.

## Frontend

- **Stack**: Vite + React 19 + React Router 7 + Recharts 3.
- **Tema claymorphism**: variables CSS centralizadas en `styles/theme.css` (sombras suaves duales, radios grandes, paleta pastel), reutilizadas por componentes comunes (`ClayCard`, `ClayButton`, `ClayInput`, `ClaySelect`, `ClayChip`, `ClayModal`, etc. en `components/common/Clay.jsx`).
- **Páginas**:
  - **Catalog**: listado de ejercicios con filtro por sport/subclasificación, creación vía modal.
  - **ExerciseDetail**: fotos (subir/borrar), edición, gráfico de progreso por métrica (Recharts `LineChart`), historial reciente de sets.
  - **Diary**: selector de fecha, creación de sesión, formulario de registro de sets (`EntryForm`) con métricas dinámicas seedeadas desde las "common metrics" del ejercicio pero permitiendo loguear cualquier métrica del catálogo, selector de dificultad 1-5, notas.
  - **Stats**: heatmap estilo GitHub (componente custom con CSS Grid) + gráfico de barras de actividad de los últimos 30 días.
  - **Metrics**: gestión del catálogo de métricas y sus unidades.
  - **Settings**: gestión de sports y subclasificaciones (solo alta/edición, sin borrado).
- **Proxy de desarrollo**: `vite.config.js` redirige `/api` y `/uploads` a `http://localhost:4000`.

## Incidentes durante el desarrollo y cómo se resolvieron

### 1. `better-sqlite3@13.0.3` causaba un *access violation* (crash nativo)

Al instalar la versión más reciente de `better-sqlite3` (13.0.3), cualquier llamada a `new Database(...)` producía un segmentation fault / `STATUS_ACCESS_VIOLATION` (`0xC0000005`), reproducible tanto en Git Bash como en PowerShell nativo. Se descartaron hipótesis de arquitectura/plataforma (Node 22.12 x64 win32 coincidía con el prebuild `win32-x64.node`, que además tenía el formato PE32+ correcto). La causa quedó acotada a un prebuild roto de esa versión (usa el nuevo esquema `prebuildify` + `node-gyp-build`) para esta combinación exacta de entorno. **Solución**: downgrade a `better-sqlite3@11.10.0` (esquema clásico `prebuild-install`), verificado con una prueba mínima (`new Database(':memory:')` + `CREATE TABLE`) antes de continuar con el resto del backend.

### 2. Borrar un ejercicio con sets registrados producía un 500

Al probar el flujo completo en el navegador (crear ejercicio → loguear un set → intentar borrar el ejercicio), la API devolvía `500 Internal Server Error` por una violación de `FOREIGN KEY constraint` (`training_entries.exercise_id` no tiene `ON DELETE CASCADE` ni `SET NULL`, a propósito, para no perder historial silenciosamente). **Solución**: se agregó una validación explícita en el controlador (`exercises/controller.js`) que cuenta las `training_entries` asociadas y devuelve `409 Conflict` con un mensaje claro ("Cannot delete an exercise that has logged training entries") en vez de dejar que la restricción de la base de datos truene como un error 500 no controlado. En el frontend, `ExerciseDetailPage.handleDelete` ahora captura el error y lo muestra con `ClayError` en vez de fallar silenciosamente con una promesa rechazada sin manejar.

## Verificación realizada

- **Backend** (PowerShell + `Invoke-RestMethod` / `curl`):
  - Seed inicial correcto (2 sports, 10 + 5 subclasificaciones, 7 métricas con sus unidades).
  - Flujo completo: crear ejercicio con subclasificaciones y common metrics → crear sesión → loguear un set con métricas → consultar `history` y `progress` → consultar `heatmap`.
  - Confirmado que `DELETE /api/sports/:id` y `DELETE /api/subclassifications/:id` no existen (404).
  - Subida de foto vía `multipart/form-data` y verificación de que se sirve en `/uploads/...` (200 OK).
  - Reproducido y corregido el bug de borrado de ejercicio con entradas asociadas (409 en vez de 500).
- **Frontend** (Browser tool embebido, contra el backend real vía proxy de Vite):
  - Navegación completa: Catalog → crear ejercicio (sport, subclasificación, common metrics) → Diary → crear sesión → loguear set con métricas y unidades → ver reflejado en la lista de sets del día.
  - ExerciseDetail: gráfico de progreso (`ProgressLineChart`) renderiza el punto logueado; historial reciente muestra el set con sus métricas y dificultad.
  - Stats: heatmap y gráfico de actividad de 30 días renderizan sin errores.
  - Foto subida se refleja en la tarjeta de detalle del ejercicio (verificado por request de red 200 OK a `/uploads/...`, no solo visualmente).
- **Limpieza**: se eliminaron los datos y archivos generados durante las pruebas (ejercicios, sesiones, foto de prueba, `sportus.sqlite*`, logs) antes de cerrar la sesión de desarrollo.

## Cómo correr el proyecto localmente

```bash
cd backend && npm run dev
```

```bash
cd frontend && npm run dev
```

El frontend queda en `http://localhost:5173` y proxya `/api` y `/uploads` hacia el backend en `http://localhost:4000`.

## Pendiente para futuras sesiones (fuera del alcance de este MVP)

Según el plan de fases del spec, quedan pendientes: fase de "Enhanced metrics & charts", upgrade a multi-usuario (autenticación real sobre las columnas `user_id` ya preparadas), features sociales, y features de IA opcionales.
