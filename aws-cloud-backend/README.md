# Tasks API

API REST para gestionar tareas, construida con **FastAPI** y **PostgreSQL**.

## Requisitos previos

- Python 3.10 o superior
- PostgreSQL instalado y corriendo
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

### 2. Crear y activar un entorno virtual

```bash
# Crear el entorno
python -m venv .venv

# Activar en Windows
.venv\Scripts\activate

# Activar en macOS/Linux
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Creá un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tasks_db
```

Reemplazá `usuario`, `contraseña` y `tasks_db` con los datos de tu instancia de PostgreSQL.

> El archivo `.env` no se sube al repositorio por seguridad. Cada desarrollador debe crearlo localmente.

### 5. Crear la base de datos en PostgreSQL

Conectate a PostgreSQL y ejecutá:

```sql
CREATE DATABASE tasks_db;
```

O desde la terminal:

```bash
psql -U usuario -h localhost -c "CREATE DATABASE tasks_db;"
```

> Las tablas se crean automáticamente al iniciar la aplicación.

## Iniciar el servidor

```bash
uvicorn main:app --reload
```

El servidor quedará disponible en `http://localhost:8000`.

## Documentación de la API

Una vez iniciado el servidor, podés acceder a:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Endpoints

| Método   | Ruta           | Descripción                                      |
|----------|----------------|--------------------------------------------------|
| `GET`    | `/tasks`       | Lista todas las tareas (`?completed=true/false`) |
| `GET`    | `/tasks/{id}`  | Obtiene una tarea por ID                         |
| `POST`   | `/tasks`       | Crea una nueva tarea                             |
| `PATCH`  | `/tasks/{id}`  | Actualiza parcialmente una tarea                 |
| `DELETE` | `/tasks/{id}`  | Elimina una tarea                                |

### Ejemplo de body para crear una tarea

```json
{
  "title": "Comprar leche",
  "description": "Ir al supermercado",
  "completed": false
}
```

## Estructura del proyecto

```
.
├── main.py          # Punto de entrada, configuración de la app
├── database.py      # Conexión a la base de datos
├── models.py        # Modelos de SQLAlchemy (tablas)
├── schemas.py       # Esquemas de Pydantic (validación)
├── requirements.txt # Dependencias del proyecto
├── .env             # Variables de entorno (no se sube al repo)
└── routers/
    └── tasks.py     # Rutas del CRUD de tareas
```
