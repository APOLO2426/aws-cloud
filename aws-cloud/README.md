# Task App

Aplicación de gestión de tareas construida con **React + TypeScript + Vite**, conectada a una API REST.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior
- La API backend corriendo (ver sección [Backend](#backend))

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` no se incluye en el repositorio. Crea uno en la raíz del proyecto:

```bash
cp .env.example .env
```

O créalo manualmente con el siguiente contenido:

```env
VITE_API_URL=http://127.0.0.1:8000
```

> Reemplaza la URL con la dirección donde esté corriendo tu backend.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta el linter |

---

## Backend

Esta app consume una API REST. Asegúrate de que el backend esté corriendo y tenga **CORS habilitado** para el origen del frontend.

Si usas FastAPI, agrega este middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # desarrollo
        "https://tu-dominio.com",  # producción
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Endpoints requeridos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/tasks/` | Obtener todas las tareas |
| `POST` | `/tasks/` | Crear una tarea |
| `PATCH` | `/tasks/{id}/` | Actualizar una tarea |
| `DELETE` | `/tasks/{id}/` | Eliminar una tarea |

---

## Despliegue en AWS

Para producción, la arquitectura recomendada es:

- **Frontend** → S3 + CloudFront (o AWS Amplify)
- **Backend** → EC2, ECS o Lambda

Una vez tengas la URL del frontend en AWS, agrégala al `allow_origins` del backend y actualiza `VITE_API_URL` con la URL del backend antes de hacer el build.

```bash
npm run build
```

Los archivos estáticos quedarán en la carpeta `/dist` listos para subir a S3.
